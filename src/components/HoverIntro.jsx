import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { VehicleMark } from "./VehicleMark";
import { trainingPrograms } from "./trainingPrograms";
import { EnvironmentTransition } from "./EnvironmentTransition";

export function HoverIntro({ onSkip, onExplore, onDiscover, leaving, ready }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const triggerRefs = useRef([]);
  const pinned = useRef(false);
  const exitTimer = useRef(null);
  const compositionRef = useRef(null);
  const lastPointer = useRef(null);
  const resetUntil = useRef(0);
  const motionUntil = useRef(0);
  const hoverTimer = useRef(null);
  const hoverCandidate = useRef(null);
  const selected = trainingPrograms[activeIndex];
  const side = activeIndex !== null && activeIndex >= 2 ? "right" : "left";

  useEffect(() => {
    trainingPrograms.forEach(({ image }) => { new Image().src = image; });
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(hoverTimer.current);
      window.clearTimeout(exitTimer.current);
    };
  }, [ready, leaving]);

  function cancelHover() {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
    hoverCandidate.current = null;
  }

  function select(index, origin = null) {
    cancelHover();
    cancelExit();
    pinned.current = origin === null;
    if (activeIndex === index) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    motionUntil.current = performance.now() + (reducedMotion ? 0 : 600);
    setTransitioning(!reducedMotion);
    setActiveIndex(index);
    onExplore();
  }

  useEffect(() => {
    if (activeIndex === null) return;
    const timer = window.setTimeout(() => setTransitioning(false), 600);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  function reset(restoreFocus = false) {
    cancelHover();
    cancelExit();
    if (restoreFocus) triggerRefs.current[activeIndex]?.focus();
    pinned.current = false;
    resetUntil.current = Date.now() + 650;
    setActiveIndex(null);
    setTransitioning(false);
  }

  useEffect(() => {
    if (activeIndex === null) return;
    function handleEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        reset(true);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- run only on these state changes; handlers read refs, so re-running per render would reset timers.
  }, [activeIndex]);

  function handlePointerMove(event) {
    if (event.pointerType !== "mouse" || !ready || leaving) return;
    const point = { x: event.clientX, y: event.clientY };
    const previous = lastPointer.current;
    lastPointer.current = point;
    // Layout changes can generate pointer events without physical mouse movement.
    if (previous && previous.x === point.x && previous.y === point.y) return;
    if (activeIndex !== null) return;
    if (Date.now() < resetUntil.current) return;
    const trigger = event.target.closest("[data-vehicle-index]");
    if (!trigger) { cancelHover(); return; }
    const index = Number(trigger.dataset.vehicleIndex);
    const candidate = hoverCandidate.current;
    if (candidate && candidate.index === index && Math.hypot(point.x - candidate.x, point.y - candidate.y) <= 7) return;
    cancelHover();
    hoverCandidate.current = { index, ...point };
    // Avoid opening and immediately reversing while the pointer is still entering.
    hoverTimer.current = window.setTimeout(() => {
      select(index, lastPointer.current);
    }, 110);
  }

  function cancelExit() {
    window.clearTimeout(exitTimer.current);
  }

  function leaveContent(event) {
    if (event.pointerType !== "mouse") return;
    cancelHover();
    cancelExit();
    if (activeIndex === null || pinned.current) return;
    exitTimer.current = window.setTimeout(() => {
      if (!compositionRef.current?.contains(document.activeElement)) reset();
    }, Math.max(240, motionUntil.current - performance.now() + 80));
  }

  return (
    <div
      className={`intro intro-hover${leaving ? " is-leaving" : ""}${selected ? ` is-exploring dock-${side}` : ""}`}
      aria-label="Kayra Robotics eğitim alanlarını keşfet"
      onFocusCapture={onExplore}
    >
      <button className="intro-skip" type="button" onClick={onSkip}>ANA SAYFAYA GEÇ <ArrowUpRight size={13} /></button>
      <a className="intro-version-link" href="?intro=click">TIKLAMALI SÜRÜM <ArrowUpRight size={11} /></a>
      <div className="intro-brand">KAYRA <span>/</span> ROBOTICS</div>
      <div className="intro-composition" ref={compositionRef} onPointerMove={handlePointerMove} onPointerEnter={cancelExit} onPointerLeave={leaveContent}>
        <p className="intro-heading">HER ORTAMDA. AYNI VİZYON.</p>
        <div className="intro-stage">
          <div className="intro-grid" aria-label="Eğitim alanları">
            {trainingPrograms.map((program, index) => {
              const active = activeIndex === index;
              const rank = activeIndex === null || index < activeIndex ? index : index - 1;
              return (
                <button
                  ref={(element) => { triggerRefs.current[index] = element; }}
                  type="button" className={`intro-item${active ? " is-active" : ""}`}
                  style={{ "--delay": `${index * 0.13}s`, "--start-x": `${12.5 + index * 25}%`, "--mobile-x": `${25 + (index % 2) * 50}%`, "--mobile-y": `${25 + Math.floor(index / 2) * 50}%`, "--rest-x": `${38 + rank * 12}%` }}
                  key={program.type}
                  data-vehicle-index={index}
                  inert={activeIndex !== null && !active}
                  onPointerEnter={onExplore}
                  onFocus={() => onExplore()}
                  onClick={() => select(index)}
                  aria-label={`${program.name} eğitimini keşfet`} aria-expanded={active}
                  aria-controls={active ? "intro-training-detail" : undefined}
                >
                  <span className="intro-vehicle-scene">
                    {active && <EnvironmentTransition type={program.type} />}
                    <VehicleMark type={program.type} illuminated />
                  </span>
                  <span className="intro-item-label"><span>{String(index + 1).padStart(2, "0")}</span>{program.label}</span>
                  <span className="intro-item-summary">{program.summary}</span>
                  <span className="intro-item-hint">KEŞFET <ArrowUpRight size={10} /></span>
                </button>
              );
            })}
          </div>
          {selected && (
            <section className="intro-detail" id="intro-training-detail" aria-labelledby="intro-detail-title" key={selected.type} inert={transitioning}>
              <figure className="intro-photo">
                <img src={selected.image} alt={selected.imageAlt} />
                <figcaption><span>{selected.caption}</span></figcaption>
              </figure>
              <div className="intro-program">
                <p className="intro-program-eyebrow">{selected.name}</p>
                <h2 id="intro-detail-title">{selected.headline}</h2>
                <p className="intro-program-description">{selected.description}</p>
                <div className="intro-curriculum-heading"><span>EĞİTİMDE</span><span>03 BAŞLIK</span></div>
                <ol className="intro-curriculum">
                  {selected.modules.map(([title, description], index) => (
                    <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>
                  ))}
                </ol>
                <div className="intro-actions">
                  <button className="intro-discover" type="button" onClick={() => onDiscover(selected.type)}>Eğitimi keşfet <ArrowUpRight size={15} /></button>
                  <button className="intro-back" type="button" onClick={() => reset(true)}><ArrowLeft size={13} /> TÜM ALANLAR</button>
                </div>
              </div>
            </section>
          )}
        </div>
        <div className="intro-signature"><span />{selected ? "Meraktan yetkinliğe, birlikte." : "Geleceği harekete geçiriyoruz."}</div>
        <p className="intro-explore-hint">{selected ? "İNCELEMEK İÇİN ZAMANINIZ VAR" : "BİR ALANIN ÜZERİNDE DURUN YA DA DOKUNUN"}</p>
      </div>
      <p className="intro-footnote">EĞİTİM & MÜHENDİSLİK</p>
    </div>
  );
}
