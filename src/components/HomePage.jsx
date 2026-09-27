import { forwardRef, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { KayraBrand } from "./KayraBrand";
import { VehicleMark } from "./VehicleMark";
import { trainingPrograms, workshops } from "./trainingPrograms";
import { courseHref } from "./courseContent";
import { contact, mailto } from "./contact";
import { kitSurveys } from "./kitSurveys";
import { useReveal } from "../hooks/useReveal";
import "./home-page.css";

const pad = (number) => String(number).padStart(2, "0");

const approachSteps = [
  ["Fikir", "Sistemi bileşenlerine ayır; her parçanın neden orada olduğunu anla."],
  ["Deney", "Simülasyonda ve atölyede dene, ölç, gözlemle."],
  ["Öğrenme", "Sonucu değerlendir ve kendi görevini tasarla."],
];

/**
 * Landing page shown after (or instead of) the intro. Uses the same calm white / sage
 * language as the refined intro so the hand-off between them is seamless.
 */
export const HomePage = forwardRef(function HomePage({ ready, onReplayIntro, intro = null }, homeLink) {
  const [menuOpen, setMenuOpen] = useState(false);
  const root = useRef(null);
  useReveal(root, ready);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function close(event) { if (event.key === "Escape") setMenuOpen(false); }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={root} className={ready ? "home is-ready" : "home is-waiting"} inert={!ready}>
      <header className="home-header">
        <div className="home-shell home-header-inner">
          <a ref={homeLink} className="home-brand" href="#top" aria-label="Kayra ana sayfa"><KayraBrand /></a>
          <nav id="home-nav" className={menuOpen ? "home-nav is-open" : "home-nav"} aria-label="Ana menü">
            <a href="#alanlar" onClick={closeMenu}>Eğitimler</a>
            <a href="#atolye" onClick={closeMenu}>3D Atölye</a>
            <a href="#yaklasim" onClick={closeMenu}>Yaklaşım</a>
            <a href="#iletisim" onClick={closeMenu}>İletişim</a>
          </nav>
          <div className="home-header-side">
            <button className="home-replay" type="button" onClick={onReplayIntro}>Alanları keşfet <ArrowUpRight size={15} /></button>
            <button className="home-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="home-nav" aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {intro ? (
        <div className="home-intro" id="top">
          <h1 className="visually-hidden">Kayra Technology — otonom sistem eğitimleri</h1>
          {intro}
        </div>
      ) : (
      <section className="home-hero home-shell" id="top" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="home-kicker" data-reveal><span /> OTONOM SİSTEMLER · EĞİTİM & MÜHENDİSLİK</p>
          <h1 id="home-title" data-reveal>Teoriyi sahaya,<span>merakı yetkinliğe.</span></h1>
          <p className="home-lead" data-reveal>Robotik teknolojileri anlaşılır, uygulanabilir ve geleceğe hazır hâle getiriyoruz.</p>
          <div className="home-actions" data-reveal>
            <a className="home-button" href="#alanlar">Eğitimleri keşfet <ArrowDown size={16} /></a>
            <a className="home-text-link" href="#iletisim">Bize ulaşın <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="home-hero-visual" aria-hidden="true">
          <span className="home-orbit home-orbit-outer" />
          <span className="home-orbit home-orbit-inner" />
          <VehicleMark type="uav" className="home-hero-mark" />
          <span className="home-hero-note">HER ORTAMDA.<br />AYNI VİZYON.</span>
        </div>
        <nav className="home-domains" aria-label="Eğitim alanları">
          {trainingPrograms.map((program, index) => (
            <a key={program.type} href={`#program-${program.type}`} style={{ "--enter-delay": `${300 + index * 90}ms` }}>
              <VehicleMark type={program.type} />
              <span><small>{pad(index + 1)} · {program.label}</small>{program.summary}</span>
            </a>
          ))}
        </nav>
      </section>
      )}

      <section className="home-programs" id="alanlar" aria-labelledby="programs-title">
        <div className="home-shell">
          <header className="home-section-head" data-reveal>
            <div>
              <p className="home-kicker"><span /> 01 / EĞİTİM ALANLARI</p>
              <h2 id="programs-title">Dört alan.<span>Tek öğrenme yolu.</span></h2>
            </div>
            <p>Tasarımdan montaja, kontrolden<br />saha testine.</p>
          </header>

          {trainingPrograms.map((program, index) => (
            <article key={program.type} id={`program-${program.type}`} className={index % 2 ? "home-program is-flipped" : "home-program"} aria-labelledby={`program-${program.type}-title`}>
              <figure className="home-program-photo" data-reveal>
                <div className="home-photo-frame"><img src={program.image} alt={program.imageAlt} loading="lazy" decoding="async" width="1200" height="900" /></div>
                <figcaption><span>{program.caption}</span></figcaption>
                <span className="home-program-mark" aria-hidden="true"><VehicleMark type={program.type} /></span>
              </figure>
              <div className="home-program-copy" data-reveal>
                <p className="home-program-index"><span>{pad(index + 1)}</span> {program.name}</p>
                <h3 id={`program-${program.type}-title`}>{program.headline}</h3>
                <p className="home-program-description">{program.description}</p>
                <ol className="home-modules">
                  {program.modules.map(([title, description], moduleIndex) => (
                    <li key={title}><span>{pad(moduleIndex + 1)}</span><div><h4>{title}</h4><p>{description}</p></div></li>
                  ))}
                </ol>
                <a className="home-button" href={courseHref(program.type)}>Eğitimi keşfet <ArrowUpRight size={15} /></a>
              </div>
            </article>
          ))}

          <div className="home-workshops" aria-labelledby="workshops-title">
            <p className="home-kicker" data-reveal><span /> ATÖLYELER</p>
            <h3 id="workshops-title" className="visually-hidden">Atölyeler</h3>
            {workshops.map((workshop) => (
              <a key={workshop.type} className="home-workshop" href={courseHref(workshop.type)} data-reveal>
                <span className="home-workshop-mark" aria-hidden="true"><VehicleMark type={workshop.type} /></span>
                <span className="home-workshop-copy">
                  <small>{workshop.format.toLocaleUpperCase("tr")} · {workshop.summary.toLocaleUpperCase("tr")}</small>
                  <strong>{workshop.name}</strong>
                  <span>{workshop.description}</span>
                </span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="home-kits home-shell" id="kitler" aria-labelledby="kits-title">
        <header className="home-section-head" data-reveal>
          <div>
            <p className="home-kicker"><span /> GELİŞTİRDİĞİMİZ KİTLER</p>
            <h2 id="kits-title">Görüşünü paylaş.<span>Kitleri birlikte şekillendirelim.</span></h2>
          </div>
        </header>
        <div className="home-kit-grid">
          {kitSurveys.map((kit) => (
            <a key={kit.type} className="home-kit" href={kit.href} target="_blank" rel="noopener noreferrer" data-reveal>
              <span className="home-kit-mark" aria-hidden="true"><VehicleMark type={kit.type} /></span>
              <span className="home-kit-copy"><strong>{kit.name}</strong><span>{kit.text}</span></span>
              <span className="home-kit-cta">Ankete katıl <ArrowUpRight size={15} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="home-shell" id="atolye" aria-labelledby="lab-title">
        <div className="home-lab" data-reveal>
          <div className="home-lab-copy">
            <p className="home-kicker"><span /> 02 / DENEYSEL ATÖLYE</p>
            <h2 id="lab-title">Biraz yakından<span>bak.</span></h2>
            <p>Kayra ROV'u üç boyutlu çevirip yakınlaştıracağın, gövde, itki ve görev konularını model üzerinde inceleyeceğin etkileşimli atölye hazırlanıyor.</p>
            <span className="home-soon">Yakında</span>
          </div>
          <div className="home-lab-visual" aria-hidden="true">
            <span className="home-orbit" />
            <VehicleMark type="rov" />
            <span className="home-lab-label">ÇEVİR · İNCELE · MERAK ET</span>
          </div>
        </div>
      </section>

      <section className="home-approach home-shell" id="yaklasim" aria-labelledby="approach-title">
        <p className="home-kicker" data-reveal><span /> 03 / YAKLAŞIM</p>
        <h2 id="approach-title" className="home-statement" data-reveal>Meraktan yetkinliğe,<span>birlikte.</span></h2>
        <ol className="home-steps">
          {approachSteps.map(([title, text], index) => (
            <li key={title} data-reveal style={{ "--reveal-delay": `${index * 90}ms` }}><span>{pad(index + 1)}</span><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
      </section>

      <footer className="home-footer" id="iletisim">
        <div className="home-shell">
          <div className="home-footer-top">
            <div className="home-footer-brand"><KayraBrand /><p>Disiplinler arası eğitim programları<br />ve mühendislik danışmanlığı.</p></div>
            <div className="home-footer-contact">
              <p className="home-kicker"><span /> İLETİŞİM</p>
              <a href={mailto()}>{contact.email} <ArrowUpRight size={15} /></a>
              <span>{contact.location}</span>
            </div>
          </div>
          <div className="home-footer-bottom"><span>© 2026 KAYRA TECHNOLOGY</span><span>ROBOTİK · EĞİTİM · DANIŞMANLIK</span></div>
        </div>
      </footer>
    </main>
  );
});
