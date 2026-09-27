import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { VehicleMark } from "./VehicleMark";
import { trainingPrograms } from "./trainingPrograms";
import { EnvironmentTransition } from "./EnvironmentTransition";

export function Intro({ onSkip, onExplore, leaving }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const triggerRefs = useRef([]);
  const selected = trainingPrograms[activeIndex];
  const side = activeIndex !== null && activeIndex >= 2 ? "right" : "left";

  useEffect(() => {
    trainingPrograms.forEach(({ image }) => { new Image().src = image; });
  }, []);

  function select(index) {
    if (activeIndex === index) return;
    setTransitioning(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setActiveIndex(index);
    onExplore();
  }

  useEffect(() => {
    if (activeIndex === null) return;
    const timer = window.setTimeout(() => setTransitioning(false), 1000);
    return () => window.clearTimeout(timer);
  }, [activeIndex]);

  function reset(restoreFocus = false) {
    if (restoreFocus) triggerRefs.current[activeIndex]?.focus();
    setActiveIndex(null);
    setTransitioning(false);
  }

  useEffect(() => {
    if (activeIndex === null) return;
    function handleEscape(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        triggerRefs.current[activeIndex]?.focus();
        setActiveIndex(null);
        setTransitioning(false);
      }
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeIndex]);

  return (
    <div
      className={`intro${leaving ? " is-leaving" : ""}${selected ? ` is-exploring dock-${side}` : ""}`}
      aria-label="Kayra Robotics eğitim alanlarını keşfet"
      onFocusCapture={onExplore}
    >
      <button className="intro-skip" type="button" onClick={onSkip}>ANA SAYFAYA GEÇ <ArrowUpRight size={13} /></button>
      <div className="intro-brand">KAYRA <span>/</span> ROBOTICS</div>
      <div className="intro-composition">
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
                <button className="intro-back" type="button" onClick={() => reset(true)}><ArrowLeft size={13} /> TÜM ALANLAR</button>
              </div>
            </section>
          )}
        </div>
        <div className="intro-signature"><span />{selected ? "Meraktan yetkinliğe, birlikte." : "Geleceği harekete geçiriyoruz."}</div>
        <p className="intro-explore-hint">{selected ? "DİĞER ALANLARI DA KEŞFEDİN" : "KEŞFETMEK İÇİN BİR ALANA TIKLAYIN"}</p>
      </div>
      <p className="intro-footnote">EĞİTİM & MÜHENDİSLİK</p>
    </div>
  );
}
