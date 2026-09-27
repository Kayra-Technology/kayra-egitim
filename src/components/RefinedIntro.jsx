import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";
import { KayraBrand } from "./KayraBrand";
import { VehicleMark } from "./VehicleMark";
import { EnvironmentTransition } from "./EnvironmentTransition";
import { trainingPrograms } from "./trainingPrograms";

const SLIDE_DURATION = 650;
const HOVER_DELAY = 120;
const EXIT_DELAY = 240;

/**
 * Default intro. As an overlay it ends with "Ana sayfaya geç"; with `inline` it is the first
 * section of the home page (?intro=scroll) and ends with a scroll cue instead.
 */
export function RefinedIntro({ onSkip, onExplore, onDiscover, leaving, ready, inline = false }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const activeRef = useRef(null);
  const pinned = useRef(false);
  const hoverTimer = useRef(null);
  const exitTimer = useRef(null);
  const candidate = useRef(null);
  const lastPointer = useRef(null);
  const motionUntil = useRef(0);
  const resetUntil = useRef(0);
  const triggers = useRef([]);
  const selected = trainingPrograms[activeIndex];
  const side = activeIndex !== null && activeIndex >= 2 ? "right" : "left";

  function cancelHover() {
    window.clearTimeout(hoverTimer.current);
    candidate.current = null;
  }

  function cancelExit() {
    window.clearTimeout(exitTimer.current);
  }

  function select(index, pin = false) {
    if (!ready || leaving) return;
    cancelHover();
    cancelExit();
    pinned.current = pin;
    if (activeRef.current === index) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motionUntil.current = performance.now() + (reducedMotion ? 0 : SLIDE_DURATION);
    activeRef.current = index;
    setTransitioning(!reducedMotion);
    setActiveIndex(index);
    onExplore();
  }

  function reset(restoreFocus = false) {
    cancelHover();
    cancelExit();
    if (restoreFocus) triggers.current[activeRef.current]?.focus();
    activeRef.current = null;
    pinned.current = false;
    resetUntil.current = performance.now() + SLIDE_DURATION;
    setActiveIndex(null);
    setTransitioning(false);
  }

  function considerHover(index, point) {
    if (!ready || leaving || activeRef.current !== null || performance.now() < resetUntil.current) return;
    if (candidate.current?.index === index) return;
    cancelHover();
    candidate.current = { index, ...point };
    hoverTimer.current = window.setTimeout(() => select(index), HOVER_DELAY);
    onExplore();
  }

  function handlePointerMove(event) {
    if (event.pointerType !== "mouse") return;
    const point = { x: event.clientX, y: event.clientY };
    const previous = lastPointer.current;
    lastPointer.current = point;
    if (previous?.x === point.x && previous?.y === point.y) return;
    if (activeRef.current !== null) return;
    const trigger = event.target.closest("[data-vehicle-index]");
    if (!trigger) { cancelHover(); return; }
    considerHover(Number(trigger.dataset.vehicleIndex), point);
  }

  function leaveContent(event) {
    if (event.pointerType !== "mouse") return;
    cancelHover();
    if (activeRef.current === null || pinned.current) return;
    const delay = Math.max(EXIT_DELAY, motionUntil.current - performance.now() + 80);
    exitTimer.current = window.setTimeout(() => reset(), delay);
  }

  useEffect(() => {
    trainingPrograms.forEach(({ image }) => { new Image().src = image; });
    return () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(exitTimer.current);
    };
  }, []);

  useEffect(() => {
    if (leaving) { cancelHover(); cancelExit(); return; }
    // A mouse already resting over a vehicle should work when drawing completes.
    if (ready && lastPointer.current) {
      const { x, y } = lastPointer.current;
      const trigger = document.elementFromPoint(x, y)?.closest("[data-vehicle-index]");
      if (trigger) considerHover(Number(trigger.dataset.vehicleIndex), { x, y });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on these state changes; handlers read refs, so re-running per render would reset timers.
  }, [ready, leaving]);

  useEffect(() => {
    if (activeIndex === null) return;
    const timer = window.setTimeout(() => setTransitioning(false), SLIDE_DURATION);
    function escape(event) {
      if (event.key === "Escape") { event.preventDefault(); reset(true); }
    }
    window.addEventListener("keydown", escape);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", escape);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on these state changes; handlers read refs, so re-running per render would reset timers.
  }, [activeIndex]);

  return (
    <div className={`intro intro-polished${inline ? " intro-inline" : ""}${leaving ? " is-leaving" : ""}${selected ? ` is-exploring dock-${side}` : ""}`} aria-label="Kayra Technology — eğitim alanlarını keşfet" onFocusCapture={onExplore}>
      {!inline && <header className="refined-header">
        <div aria-label="Kayra Technology"><KayraBrand /></div>
        <button className="refined-continue" type="button" onClick={onSkip}>Ana sayfaya geç <ArrowUpRight size={16} /></button>
      </header>}

      <div className="intro-composition" onPointerMove={handlePointerMove} onPointerEnter={cancelExit} onPointerLeave={leaveContent}>
        <p className="intro-heading">HER ORTAMDA. AYNI VİZYON.</p>
        <div className="intro-stage" aria-busy={!ready}>
          <div className="intro-grid" aria-label="Eğitim alanları">
            {trainingPrograms.map((program, index) => {
              const active = activeIndex === index;
              return (
                <button
                  ref={(element) => { triggers.current[index] = element; }}
                  key={program.type} className={`intro-item${active ? " is-active" : ""}`} type="button"
                  style={{ "--delay": `${index * 0.13}s`, "--start-x": `${12.5 + index * 25}%`, "--mobile-x": `${25 + index % 2 * 50}%`, "--mobile-y": `${25 + Math.floor(index / 2) * 50}%` }}
                  data-vehicle-index={index} inert={selected && !active ? true : undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") considerHover(index, { x: event.clientX, y: event.clientY });
                  }}
                  onClick={() => select(index, true)}
                  aria-label={`${program.name} eğitimini keşfet`} aria-expanded={active}
                  aria-controls={active ? "refined-training-detail" : undefined}
                >
                  <span className="intro-vehicle-scene">
                    {active && <EnvironmentTransition type={program.type} />}
                    <VehicleMark type={program.type} illuminated />
                  </span>
                  <span className="intro-item-label"><span>{String(index + 1).padStart(2, "0")}</span>{program.label}</span>
                  <span className="intro-item-summary">{program.summary}</span>
                  <span className="intro-item-hint">Keşfet <ArrowUpRight size={12} /></span>
                </button>
              );
            })}
          </div>

          {selected && (
            <section className="intro-detail" id="refined-training-detail" aria-labelledby="refined-detail-title" key={selected.type} inert={transitioning}>
              <figure className="intro-photo">
                <div className="refined-photo-frame"><img src={selected.image} alt={selected.imageAlt} /></div>
                <figcaption><span>{selected.caption}</span></figcaption>
              </figure>
              <div className="intro-program">
                <p className="intro-program-eyebrow">{selected.name}</p>
                <h2 id="refined-detail-title">{selected.headline}</h2>
                <p className="intro-program-description">{selected.description}</p>
                <div className="intro-curriculum-heading"><span>EĞİTİMDE</span><span>03 BAŞLIK</span></div>
                <ol className="intro-curriculum">
                  {selected.modules.map(([title, description], index) => (
                    <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>
                  ))}
                </ol>
                <div className="intro-actions">
                  <button className="intro-discover" type="button" onClick={() => onDiscover(selected.type)}>Eğitimi keşfet <ArrowUpRight size={15} /></button>
                  <button className="intro-back" type="button" onClick={() => reset(true)}><ArrowLeft size={14} /> Tüm alanlar</button>
                </div>
              </div>
            </section>
          )}
        </div>

        {selected && (
          <nav className="refined-field-nav" aria-label="Başka bir eğitim alanını seç">
            {trainingPrograms.map(({ type, label }, index) => (
              <button key={type} type="button" aria-current={index === activeIndex ? "true" : undefined} onClick={() => select(index, true)}>
                <span>{String(index + 1).padStart(2, "0")}</span>{label}
              </button>
            ))}
          </nav>
        )}
        <div className="intro-signature"><span />{selected ? "Meraktan yetkinliğe, birlikte." : "Geleceği harekete geçiriyoruz."}</div>
        <p className="intro-explore-hint">{selected ? "Keşfetmek için zamanınız var." : "Keşfetmek için bir alana dokunun ya da üzerine gelin."}</p>
      </div>

      {inline
        ? <button className="intro-scroll-cue" type="button" onClick={onSkip}>Eğitimleri gör <ArrowDown size={16} /></button>
        : <footer className="refined-footer"><span>ROBOTİK · EĞİTİM · DANIŞMANLIK</span><span>Fikirden uygulamaya.</span></footer>}
    </div>
  );
}
