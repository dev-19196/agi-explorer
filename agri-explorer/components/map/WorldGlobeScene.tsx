"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useDictionary } from "@/i18n/use-dictionary";
import { lonLatToVector3 } from "@/lib/globe/world-geo";
import { createGlowSpriteTexture, createWorldTexture } from "@/lib/globe/world-texture";
import type { MapMarker } from "./WorldMap";

const GLOBE_RADIUS = 1;
const MARKER_SURFACE_OFFSET = 1.014;
const GLOW_BASE_SCALE = 0.1;

interface MarkerHandle {
  group: THREE.Group;
  dot: THREE.Mesh;
  dotMaterial: THREE.MeshBasicMaterial;
  glow: THREE.Sprite;
  glowMaterial: THREE.SpriteMaterial;
  marker: MapMarker;
}

interface SceneApi {
  syncMarkers: (markers: MapMarker[]) => void;
}

/** Đọc giá trị thật của 1 CSS custom property (đã resolve ở :root) — giữ màu
 * quả địa cầu đồng bộ với design system thay vì hard-code hex riêng. */
function readCssColor(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || fallback;
}

const CSS_VAR_REFERENCE = /^var\((--[\w-]+)\)$/;

/** `marker.color` đôi khi là chuỗi `var(--biome-xxx)` (xem BIOMES trong
 * types/content.ts) — hợp lệ với CSS/SVG nhưng `THREE.Color` không tự parse
 * được cú pháp `var()`, nên cần resolve về hex thật trước khi dùng. */
function resolveMarkerColor(color: string | undefined, fallback: string): string {
  if (!color) return fallback;
  const match = CSS_VAR_REFERENCE.exec(color.trim());
  return match ? readCssColor(match[1], fallback) : color;
}

function markerKey(m: MapMarker): string {
  return m.label;
}

/**
 * Tính quaternion xoay quả địa cầu để hướng `targetLocal` (1 điểm trên mặt
 * cầu, toạ độ cục bộ — VD centroid các marker) ra chính giữa, đối diện
 * camera — NHƯNG vẫn giữ hướng Bắc luôn hướng lên trên màn hình.
 *
 * Lưu ý quan trọng: `THREE.Quaternion.setFromUnitVectors(from, to)` chỉ tìm
 * 1 phép xoay đưa `from` tới `to`, KHÔNG kiểm soát độ "roll" (xoay quanh
 * chính trục nhìn) — với 1 số hướng centroid cụ thể, roll này có thể lên tới
 * hơn 100°, khiến cả vùng nhìn bị vẹo/lệch trục Bắc, dễ nhận lầm thành bị
 * "ngược" địa lý dù đường bờ biển vẽ đúng. Hàm này dựng trực tiếp 1 hệ toạ
 * độ trực chuẩn (right/up/target) để loại bỏ hoàn toàn phần roll dư đó —
 * đã verify: hướng Bắc sau khi xoay luôn nằm đúng mặt phẳng đứng màn hình
 * (không lệch trái/phải) bất kể centroid ở đâu.
 */
function computeNorthUpOrientation(targetLocal: THREE.Vector3): THREE.Quaternion {
  const target = targetLocal.clone().normalize();
  const worldUpRef = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(worldUpRef, target);
  if (right.lengthSq() < 1e-6) {
    // target gần trùng cực Bắc/Nam (worldUpRef song song target) — chọn tuỳ
    // ý 1 hướng "right" khác vuông góc với target để tránh chia cho ~0.
    right.set(1, 0, 0).cross(target);
    if (right.lengthSq() < 1e-6) right.set(0, 0, 1).cross(target);
  }
  right.normalize();
  const up = new THREE.Vector3().crossVectors(target, right).normalize();
  const basis = new THREE.Matrix4().set(
    right.x, right.y, right.z, 0,
    up.x, up.y, up.z, 0,
    target.x, target.y, target.z, 0,
    0, 0, 0, 1,
  );
  return new THREE.Quaternion().setFromRotationMatrix(basis);
}

interface WorldGlobeSceneProps {
  markers: MapMarker[];
  className?: string;
  onUnsupported: () => void;
}

/**
 * Quả địa cầu 3D — vanilla Three.js (không react-three-fiber) bọc trong 1
 * component React. Scene chỉ dựng 1 lần lúc mount (giữ nguyên trạng thái
 * xoay/zoom của người dùng); khi prop `markers` đổi (hover từ danh sách, đổi
 * lọc môi trường sống...), chỉ đồng bộ lại marker qua `SceneApi.syncMarkers`,
 * không dựng lại scene.
 */
export function WorldGlobeScene({ markers, className, onUnsupported }: WorldGlobeSceneProps) {
  const dict = useDictionary();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const sceneApiRef = useRef<SceneApi | null>(null);

  // Giữ tham chiếu mới nhất để dùng trong closure dựng scene (chỉ chạy 1 lần
  // lúc mount) — gán trong effect, KHÔNG gán trực tiếp lúc render.
  const onUnsupportedRef = useRef(onUnsupported);
  const routerRef = useRef(router);
  const dictRef = useRef(dict);
  useEffect(() => {
    onUnsupportedRef.current = onUnsupported;
    routerRef.current = router;
    dictRef.current = dict;
  }, [onUnsupported, router, dict]);

  useEffect(() => {
    const maybeContainer = containerRef.current;
    if (!maybeContainer) return;
    // Gán lại để kiểu suy ra là HTMLDivElement (không null) ngay từ khai báo —
    // việc narrow từ `| null` không tự xuyên qua các closure lồng bên dưới
    // (resize/animate), nhưng kiểu suy ra trực tiếp thì có.
    const container = maybeContainer;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      onUnsupportedRef.current();
      return;
    }
    if (!renderer.getContext()) {
      onUnsupportedRef.current();
      return;
    }

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const palette = {
      ocean: readCssColor("--color-pine-soft", "#e4ece5"),
      land: readCssColor("--color-ink-soft", "#46564c"),
      coastline: readCssColor("--color-pine-dark", "#1b3c2c"),
      graticule: "rgba(40,84,63,0.12)",
      atmosphere: readCssColor("--color-honey", "#e8ab4f"),
    };
    const defaultMarkerColor = readCssColor("--color-honey-dark", "#b9762a");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.1);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", dictRef.current.worldMap.globeAriaLabel);
    container.appendChild(renderer.domElement);

    // --- Quả địa cầu ---
    const worldTexture = createWorldTexture(palette);
    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: worldTexture,
      roughness: 0.9,
      metalness: 0,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);

    // --- Hào quang khí quyển (Fresnel rim glow, tông màu honey) ---
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(palette.atmosphere) } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        uniform vec3 glowColor;
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.4);
          gl_FragColor = vec4(glowColor, fresnel * 0.55);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.045, 48, 48);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

    const globeGroup = new THREE.Group();
    globeGroup.add(globeMesh, atmosphereMesh);
    // Xoay quả địa cầu để mặt chứa các marker ban đầu hướng về phía camera —
    // tránh trường hợp toàn bộ điểm phân bố (VD: chỉ ở Đông Nam Á) nằm ở mặt
    // sau, ẩn khỏi tầm nhìn ngay khi trang vừa tải.
    const initialMarkers = markers;
    if (initialMarkers.length > 0) {
      const centroid = new THREE.Vector3();
      for (const m of initialMarkers) {
        const [x, y, z] = lonLatToVector3(m.lat, m.lon, 1);
        centroid.add(new THREE.Vector3(x, y, z));
      }
      if (centroid.lengthSq() > 1e-6) {
        globeGroup.quaternion.copy(computeNorthUpOrientation(centroid));
      }
    }
    scene.add(globeGroup);

    // --- Ánh sáng: ambient cao + 1 directional dịu để có chút khối, không
    // tạo bóng gắt (phù hợp phong cách minh hoạ phẳng của design system). ---
    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const sun = new THREE.DirectionalLight(0xfff3da, 0.9);
    sun.position.set(3, 2, 4);
    scene.add(sun);

    // --- Xoay/zoom bằng chuột & cảm ứng ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1.55;
    controls.maxDistance = 4.6;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.7;
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 0.55;

    // --- Marker ---
    const glowTexture = createGlowSpriteTexture();
    const markerHandles = new Map<string, MarkerHandle>();
    let clickableDots: THREE.Object3D[] = [];

    function refreshClickableDots() {
      clickableDots = Array.from(markerHandles.values()).map((h) => h.dot);
    }

    function createMarkerHandle(marker: MapMarker): MarkerHandle {
      const color = new THREE.Color(resolveMarkerColor(marker.color, defaultMarkerColor));

      const dotMaterial = new THREE.MeshBasicMaterial({ color });
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 16), dotMaterial);

      const glowMaterial = new THREE.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0,
      });
      const glow = new THREE.Sprite(glowMaterial);
      glow.scale.setScalar(GLOW_BASE_SCALE);

      const group = new THREE.Group();
      group.add(glow, dot);
      const [x, y, z] = lonLatToVector3(
        marker.lat,
        marker.lon,
        GLOBE_RADIUS * MARKER_SURFACE_OFFSET,
      );
      group.position.set(x, y, z);
      group.userData.key = markerKey(marker);

      globeGroup.add(group);
      return { group, dot, dotMaterial, glow, glowMaterial, marker };
    }

    function syncMarkers(nextMarkers: MapMarker[]) {
      const nextKeys = new Set(nextMarkers.map(markerKey));

      for (const [key, handle] of markerHandles) {
        if (!nextKeys.has(key)) {
          globeGroup.remove(handle.group);
          handle.dot.geometry.dispose();
          handle.dotMaterial.dispose();
          handle.glowMaterial.dispose();
          markerHandles.delete(key);
        }
      }

      for (const marker of nextMarkers) {
        const key = markerKey(marker);
        const existing = markerHandles.get(key);
        if (existing) {
          existing.marker = marker;
          const color = new THREE.Color(resolveMarkerColor(marker.color, defaultMarkerColor));
          existing.dotMaterial.color.copy(color);
          existing.glowMaterial.color.copy(color);
        } else {
          markerHandles.set(key, createMarkerHandle(marker));
        }
      }

      refreshClickableDots();
    }

    sceneApiRef.current = { syncMarkers };

    // --- Raycasting: hover/click marker ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredKey: string | null = null;

    /** 1 điểm trên mặt cầu (tâm tại gốc toạ độ) hướng về phía camera hay
     * không — dùng để bỏ qua marker đang ở mặt sau quả địa cầu (bị che). */
    function isFrontFacing(worldPosition: THREE.Vector3): boolean {
      const toCamera = camera.position.clone().sub(worldPosition);
      return worldPosition.dot(toCamera) > 0;
    }

    function updatePointer(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function setHovered(key: string | null) {
      if (key === hoveredKey) return;
      hoveredKey = key;
      const tooltip = tooltipRef.current;
      const handle = key ? markerHandles.get(key) : null;
      if (tooltip) {
        if (handle) {
          tooltip.textContent = handle.marker.label;
          tooltip.style.opacity = "1";
        } else {
          tooltip.style.opacity = "0";
        }
      }
      renderer.domElement.style.cursor =
        handle && (handle.marker.href || handle.marker.onClick)
          ? "pointer"
          : handle
            ? "default"
            : "";
    }

    function handlePointerMove(event: PointerEvent) {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableDots, false);
      const worldPos = new THREE.Vector3();
      for (const hit of hits) {
        const parent = hit.object.parent;
        if (!parent) continue;
        parent.getWorldPosition(worldPos);
        if (isFrontFacing(worldPos)) {
          setHovered((parent.userData.key as string) ?? null);
          return;
        }
      }
      setHovered(null);
    }

    function handlePointerLeave() {
      setHovered(null);
    }

    function handleClick() {
      if (!hoveredKey) return;
      const handle = markerHandles.get(hoveredKey);
      if (!handle) return;
      const worldPos = new THREE.Vector3();
      handle.group.getWorldPosition(worldPos);
      if (!isFrontFacing(worldPos)) return;
      if (handle.marker.onClick) {
        handle.marker.onClick();
      } else if (handle.marker.href) {
        routerRef.current.push(handle.marker.href);
      }
    }

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("click", handleClick);

    // --- Kích thước responsive theo container (không theo window) ---
    function resize() {
      const { width, height } = container.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // --- Vòng lặp render ---
    const timer = new THREE.Timer();
    timer.connect(document);
    let animationId = 0;
    function animate() {
      animationId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();
      controls.update();

      const tooltip = tooltipRef.current;
      for (const [key, handle] of markerHandles) {
        const glowing = key === hoveredKey || Boolean(handle.marker.active);
        if (!glowing) {
          if (handle.glowMaterial.opacity !== 0) handle.glowMaterial.opacity = 0;
          continue;
        }
        if (reducedMotion) {
          handle.glow.scale.setScalar(GLOW_BASE_SCALE * 1.4);
          handle.glowMaterial.opacity = 0.55;
        } else {
          const pulse = (Math.sin(elapsed * 2.4) + 1) / 2; // 0..1
          handle.glow.scale.setScalar(GLOW_BASE_SCALE * (1.1 + pulse * 0.6));
          handle.glowMaterial.opacity = 0.35 + pulse * 0.35;
        }
      }

      // Theo dõi vị trí màn hình của marker đang hover mỗi khung hình — camera
      // có thể tự xoay (autoRotate) dù chuột không di chuyển.
      if (hoveredKey && tooltip) {
        const handle = markerHandles.get(hoveredKey);
        if (handle) {
          const worldPos = new THREE.Vector3();
          handle.group.getWorldPosition(worldPos);
          if (isFrontFacing(worldPos)) {
            const rect = container.getBoundingClientRect();
            const projected = worldPos.clone().project(camera);
            const x = ((projected.x + 1) / 2) * rect.width;
            const y = ((-projected.y + 1) / 2) * rect.height;
            tooltip.style.transform = `translate(${x}px, ${y}px) translate(-50%, -140%)`;
            tooltip.style.opacity = "1";
          } else {
            tooltip.style.opacity = "0";
          }
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // Đồng bộ marker ngay từ đầu (cùng cơ chế với những lần markers đổi sau
    // này) — xem effect thứ 2 bên dưới.
    syncMarkers(markers);

    return () => {
      sceneApiRef.current = null;
      cancelAnimationFrame(animationId);
      timer.disconnect();
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("click", handleClick);
      controls.dispose();

      for (const handle of markerHandles.values()) {
        handle.dot.geometry.dispose();
        handle.dotMaterial.dispose();
        handle.glowMaterial.dispose();
      }
      glowTexture.dispose();
      worldTexture.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // Chỉ dựng scene 1 lần lúc mount — markers/onUnsupported/router/dict luôn
    // đọc qua ref ở trên nên không cần liệt kê ở đây.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // markers đổi (hover từ danh sách, đổi lọc môi trường sống...) -> chỉ đồng
  // bộ lại marker, KHÔNG dựng lại scene (giữ nguyên góc xoay/zoom hiện tại).
  useEffect(() => {
    sceneApiRef.current?.syncMarkers(markers);
  }, [markers]);

  return (
    <div ref={containerRef} className={`relative touch-none overflow-hidden ${className ?? ""}`}>
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap rounded-[var(--radius-pill)] border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-ink opacity-0 shadow-[var(--shadow-card)] transition-opacity duration-150"
      />
      <p className="pointer-events-none absolute bottom-2 left-2 z-10 text-[11px] text-ink-faint/80">
        {dict.worldMap.dragHint}
      </p>
    </div>
  );
}
