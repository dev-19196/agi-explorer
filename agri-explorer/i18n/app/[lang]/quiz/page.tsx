"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, BookMarked } from "lucide-react";
import { Link } from "@/i18n/Link";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { useUserActivity } from "@/lib/hooks/useUserActivity";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/use-dictionary";

const POOL = [
  ...plants.map((p) => ({ name: p.name, scientificName: p.scientificName })),
  ...animals.map((a) => ({ name: a.name, scientificName: a.scientificName })),
];

interface Question {
  prompt: string;
  answer: string;
  options: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestions(): Question[] {
  return shuffle(POOL)
    .slice(0, 8)
    .map((item) => {
      const distractors = shuffle(POOL.filter((p) => p.name !== item.name))
        .slice(0, 3)
        .map((p) => p.scientificName);
      return {
        prompt: item.name,
        answer: item.scientificName,
        options: shuffle([item.scientificName, ...distractors]),
      };
    });
}

export default function QuizPage() {
  const d = useDictionary();
  const qd = d.quiz;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const { recordQuizResult, activity: { quiz } } = useUserActivity();

  useEffect(() => {
    // Sinh câu hỏi (random) chỉ ở client để tránh lệch nội dung SSR/CSR.
    // Bọc trong startTransition để cập nhật này không bị coi là urgent
    // update đồng bộ ngay trong effect (tránh cascading-render warning).
    startTransition(() => {
      setQuestions(buildQuestions());
    });
  }, []);

  const current = questions[index];
  const finished = questions.length > 0 && index >= questions.length;

  const choose = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === current.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    const nextIdx = index + 1;
    if (nextIdx >= questions.length) {
      const badges = recordQuizResult(score + (selected === current.answer ? 1 : 0), questions.length);
      setNewBadges(badges);
    }
    setIndex(nextIdx);
  };

  const restart = () => {
    setQuestions(buildQuestions());
    setIndex(0);
    setScore(0);
    setSelected(null);
    setNewBadges([]);
  };

  const progress = useMemo(
    () => Math.round((Math.min(index, questions.length) / questions.length) * 100),
    [index, questions.length]
  );

  const badgeLabels: Record<string, string> = qd.badges as Record<string, string>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">{qd.title}</h1>

      {questions.length === 0 ? (
        <div className="mt-10 h-64 animate-pulse rounded-[var(--radius-card)] border border-line bg-canvas-soft" />
      ) : !finished ? (
        <div className="mt-8">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-canvas-deep">
            <div
              className="h-full bg-pine transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            {index + 1} / {questions.length} — {qd.highScore}: {score}
          </p>

          <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-canvas-soft p-8 text-center">
            <p className="text-sm text-ink-faint">{qd.scientificNameOf}</p>
            <p className="mt-1 font-display text-3xl text-ink">{current.prompt}</p>
            <p className="text-xs uppercase tracking-wide text-ink-faint">{qd.isWhat}</p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {current.options.map((opt) => {
              const isCorrect = opt === current.answer;
              const isPicked = opt === selected;
              const showState = selected !== null;
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  disabled={selected !== null}
                  className={`flex items-center justify-between gap-2 rounded-[var(--radius-card)] border px-4 py-3 text-left font-display italic transition-colors ${
                    showState && isCorrect
                      ? "border-pine bg-pine-soft text-pine-dark"
                      : showState && isPicked
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-line text-ink-soft hover:border-pine"
                  }`}
                >
                  {opt}
                  {showState && isCorrect && <CheckCircle2 className="size-4 shrink-0" />}
                  {showState && isPicked && !isCorrect && <XCircle className="size-4 shrink-0" />}
                </button>
              );
            })}
          </div>

          {selected && (
            <button
              onClick={next}
              className="mt-6 w-full rounded-[var(--radius-card)] bg-pine py-3 text-center font-medium text-white transition-opacity hover:opacity-90"
            >
              {index + 1 < questions.length ? qd.nextQuestion : qd.showResult}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-line bg-canvas-soft p-10 text-center">
          <Trophy className="size-10 text-honey-dark" />
          <p className="font-display text-2xl text-ink">
            {qd.scoreLabel
              .replace("{score}", String(score))
              .replace("{total}", String(questions.length))}
          </p>
          <p className="text-sm text-ink-soft">
            {score === questions.length
              ? qd.resultPerfect
              : score >= questions.length / 2
                ? qd.resultGood
                : qd.resultRetry}
          </p>
          <div className="mt-1 flex gap-4 text-xs text-ink-faint">
            <span>{qd.highScore}: <strong className="text-ink">{quiz.highScore}</strong></span>
            <span>{qd.totalPlayed}: <strong className="text-ink">{quiz.totalPlayed}</strong></span>
          </div>
          {newBadges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {newBadges.map((b) => (
                <Badge key={b} className="bg-honey text-white animate-bounce">
                  {badgeLabels[b] ?? b}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="mt-2 flex items-center gap-2 rounded-[var(--radius-pill)] bg-pine px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              <RotateCcw className="size-4" /> {qd.playAgain}
            </button>
            <Link
              href="/collection"
              className="mt-2 flex items-center gap-2 rounded-[var(--radius-pill)] border border-line px-5 py-2.5 text-sm font-medium text-ink-soft hover:border-pine hover:text-pine"
            >
              <BookMarked className="size-4" /> {qd.viewCollection}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
