import { useEffect, useRef, useState, type CSSProperties } from "react";

type Topic = {
  name: string;
  category: "Technologie" | "Philosophie" | "Science" | "Théorie";
};

const topics: Topic[] = [
  { name: "L’intelligence artificielle", category: "Technologie" },
  { name: "L’informatique quantique", category: "Technologie" },
  { name: "La réalité augmentée", category: "Technologie" },
  { name: "La blockchain", category: "Technologie" },
  { name: "Le transhumanisme", category: "Technologie" },
  { name: "La cybersécurité", category: "Technologie" },
  { name: "L’Internet des objets", category: "Technologie" },
  { name: "Le paradoxe de Fermi", category: "Science" },
  { name: "La sélection naturelle", category: "Science" },
  { name: "La matière noire", category: "Science" },
  { name: "L’effet placebo", category: "Science" },
  { name: "La plasticité cérébrale", category: "Science" },
  { name: "L’entropie", category: "Science" },
  { name: "La théorie du chaos", category: "Théorie" },
  { name: "Le rasoir d’Ockham", category: "Théorie" },
  { name: "Le dilemme du prisonnier", category: "Théorie" },
  { name: "L’effet papillon", category: "Théorie" },
  { name: "La dissonance cognitive", category: "Théorie" },
  { name: "La théorie des jeux", category: "Théorie" },
  { name: "L’existentialisme", category: "Philosophie" },
  { name: "Le stoïcisme", category: "Philosophie" },
  { name: "L’absurde", category: "Philosophie" },
  { name: "Le déterminisme", category: "Philosophie" },
  { name: "L’utilitarisme", category: "Philosophie" },
  { name: "Le libre arbitre", category: "Philosophie" },
];

function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const deadlineRef = useRef(0);

  useEffect(() => {
    if (!isRunning) return;
    const update = () => {
      const nextSeconds = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSeconds(nextSeconds);
      if (nextSeconds === 0) setIsRunning(false);
    };
    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [isRunning]);

  const toggle = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    const nextSeconds = seconds === 0 ? initialSeconds : seconds;
    if (seconds === 0) setSeconds(initialSeconds);
    deadlineRef.current = Date.now() + nextSeconds * 1000;
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
  };

  return { seconds, isRunning, toggle, reset, initialSeconds };
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function TimerCard({ eyebrow, title, description, timer }: {
  eyebrow: string;
  title: string;
  description: string;
  timer: ReturnType<typeof useTimer>;
}) {
  const elapsed = ((timer.initialSeconds - timer.seconds) / timer.initialSeconds) * 100;
  const fillStyle = { "--fill": `${elapsed}%` } as CSSProperties;
  const buttonLabel = timer.isRunning
    ? "Mettre en pause"
    : timer.seconds === 0
      ? "Recommencer"
      : timer.seconds < timer.initialSeconds
        ? "Reprendre"
        : "Lancer le minuteur";

  return (
    <section className="timer-card">
      <div className="timer-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div
        className={`timer-dial ${elapsed > 48 ? "is-filled" : ""} ${timer.isRunning ? "is-running" : ""}`}
        style={fillStyle}
        aria-label={`${formatTime(timer.seconds)} restantes`}
      >
        <div className="liquid">
          <span className="liquid-wave liquid-wave--one" />
          <span className="liquid-wave liquid-wave--two" />
        </div>
        <div className="timer-dial__inner">
          <span className="timer-value">{formatTime(timer.seconds)}</span>
          <span className="timer-state">
            {timer.seconds === 0 ? "Terminé" : timer.isRunning ? "En cours" : timer.seconds < timer.initialSeconds ? "En pause" : "Prêt"}
          </span>
        </div>
      </div>
      <div className="timer-actions">
        <button className="timer-primary" type="button" onClick={timer.toggle}>{buttonLabel}</button>
        <button className="timer-reset" type="button" onClick={timer.reset}>Réinitialiser</button>
      </div>
    </section>
  );
}

export default function App() {
  const [currentTopic, setCurrentTopic] = useState<Topic>(topics[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const researchTimer = useTimer(10 * 60);
  const speechTimer = useTimer(60);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const drawTopic = () => {
    if (isSpinning) return;
    researchTimer.reset();
    speechTimer.reset();
    setIsSpinning(true);
    let step = 0;
    const spin = () => {
      setCurrentTopic((previous) => {
        const choices = topics.filter((topic) => topic.name !== previous.name);
        return choices[Math.floor(Math.random() * choices.length)];
      });
      step += 1;
      if (step < 18) timeoutRef.current = window.setTimeout(spin, 42 + step * 6);
      else setIsSpinning(false);
    };
    spin();
  };

  return (
    <main className="app-shell">
      <header className="site-header"><span className="brand-name">euphradeia</span></header>
      <div className="brand-note-row">
        <span className="origin-note">
          <svg className="origin-arrow" viewBox="0 0 52 38" fill="none" aria-hidden="true">
            <path d="M49 35C37 32 21 23 6 6" />
            <path d="M7 15L5 5L15 6" />
          </svg>
          du grec : l’art de bien parler<br />et de s’exprimer avec clarté
        </span>
      </div>
      <div className="content">
        <section className="intro">
          <span className="intro-kicker">Un exercice en trois temps</span>
          <h1>Tirez. Explorez. Parlez.</h1>
          <p>Un sujet au hasard, dix minutes pour construire une pensée, une minute pour la faire entendre.</p>
        </section>
        <section className={`topic-card ${isSpinning ? "is-spinning" : ""}`}>
          <div className="topic-topline">
            <span className="eyebrow">Étape 01</span>
            <span className="category-pill">{currentTopic.category}</span>
          </div>
          <div className="topic-window">
            <p className="topic-word" aria-live={isSpinning ? "off" : "polite"} aria-atomic="true">{currentTopic.name}</p>
          </div>
          <button className="draw-button" type="button" onClick={drawTopic} disabled={isSpinning}>
            {isSpinning ? "Le hasard choisit…" : "Tirer un nouveau sujet"}
          </button>
        </section>
        <div className="timers-grid">
          <TimerCard eyebrow="Étape 02" title="Construire sa pensée" description="Cherchez, questionnez et organisez vos idées." timer={researchTimer} />
          <TimerCard eyebrow="Étape 03" title="Prendre la parole" description="Allez à l’essentiel, clairement et sans notes." timer={speechTimer} />
        </div>
      </div>
    </main>
  );
}
