import { apiFetch } from "./client";
import type {
  AnimalDto,
  ArticleDto,
  MediaDto,
  PlantDto,
  SeasonalEventDto,
  WeatherAlertDto,
} from "./types";

/**
 * BE chỉ có GET (list/single) + POST upsert + DELETE — không có PUT riêng
 * (xem Controllers/*.cs: `[HttpPost] Upsert` tự quyết định insert/update theo
 * khoá chính). Factory này gói lại thành CRUD chuẩn cho FE dùng.
 */
function createCrud<TDto, TKey extends string = string>(resourcePath: string) {
  return {
    list: (query?: Record<string, string | undefined>) => {
      const qs = query
        ? "?" +
          Object.entries(query)
            .filter(([, v]) => !!v)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v!)}`)
            .join("&")
        : "";
      return apiFetch<TDto[]>(`${resourcePath}${qs}`);
    },
    get: (key: TKey) => apiFetch<TDto>(`${resourcePath}/${encodeURIComponent(key)}`),
    upsert: (payload: TDto) =>
      apiFetch<void>(resourcePath, { method: "POST", body: payload }),
    remove: (key: TKey) =>
      apiFetch<void>(`${resourcePath}/${encodeURIComponent(key)}`, { method: "DELETE" }),
  };
}

export const plantsApi = createCrud<PlantDto>("/api/plants");
export const animalsApi = createCrud<AnimalDto>("/api/animals");
export const articlesApi = createCrud<ArticleDto>("/api/articles");
export const mediaApi = createCrud<MediaDto>("/api/media");
export const seasonalEventsApi = createCrud<SeasonalEventDto>("/api/seasonal-events");
export const weatherAlertsApi = createCrud<WeatherAlertDto>("/api/weather-alerts");
