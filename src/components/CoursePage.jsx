import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { KayraBrand } from "./KayraBrand";
import { VehicleMark } from "./VehicleMark";
import { allPrograms, findProgram } from "./trainingPrograms";
import { courseContent, courseHref } from "./courseContent";
import { contact, mailto } from "./contact";
import { findKitSurvey } from "./kitSurveys";

const pad = (number) => String(number).padStart(2, "0");

/** Training detail page. Content stays at headline level: topics, optional hands-on work, related trainings. */
export function CoursePage({ type }) {
  const program = findProgram(type);
  const course = courseContent[type];
  const heading = useRef(null);
  const homeHref = `${window.location.pathname}${window.location.search}#alanlar`;
  const hasPractice = course.practice.length > 0;
  const kitSurvey = findKitSurvey(type);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${program.name} · Kayra`;
    window.scrollTo({ top: 0, behavior: "instant" });
    heading.current?.focus({ preventScroll: true });
    return () => { document.title = previousTitle; };
  }, [type, program.name]);

  return (
    <div className="course-page">
      <a className="course-skip" href="#course-main" onClick={event => { event.preventDefault(); heading.current?.focus(); }}>İçeriğe geç</a>
      <header className="course-header course-shell">
        <a href={homeHref} aria-label="Kayra — eğitim alanlarına dön"><KayraBrand /></a>
        <a className="course-back" href={homeHref}><ArrowLeft size={15} /> Tüm eğitimler</a>
      </header>
      <main id="course-main" className="course-shell">
        <nav className="course-breadcrumb" aria-label="Sayfa yolu"><a href={homeHref}>Eğitimler</a><span>/</span><span aria-current="page">{course.domain}</span></nav>

        <section className="course-hero" aria-labelledby="course-title">
          <div className="course-hero-copy">
            <p className="course-kicker"><span /> {program.name}</p>
            <h1 id="course-title" ref={heading} tabIndex={-1}>{course.title.split("\n").map((line, index) => <span key={line} className={index ? "course-title-accent" : ""}>{line}</span>)}</h1>
            <p className="course-lead">{program.description}</p>
            <a className="course-primary" href={mailto(`${program.name} eğitimi hakkında`)}>Bilgi al <Mail size={16} /></a>
            <div className="course-meta">
              <span>{pad(course.topics.length)} KONU</span>
              {program.format && <span>{program.format.toLocaleUpperCase("tr")}</span>}
              {hasPractice && <span>UYGULAMALI</span>}
            </div>
          </div>
          {program.image ? (
            <figure className="course-hero-photo"><img src={program.image} alt={program.imageAlt} /><figcaption><span>{program.caption}</span></figcaption><div className="course-mark" aria-hidden="true"><VehicleMark type={type} /></div></figure>
          ) : (
            <div className="course-hero-drawing" aria-hidden="true"><span className="course-orbit" /><VehicleMark type={type} /><span className="course-drawing-label">{program.summary.toLocaleUpperCase("tr")}</span></div>
          )}
        </section>

        <section className="course-topics" aria-labelledby="topics-title">
          <div className="course-section-heading"><div><p className="course-kicker">01 / KONULAR</p><h2 id="topics-title">Neler var?</h2></div></div>
          <ol className="course-topic-list">
            {course.topics.map((topic, index) => <li className="course-topic" key={topic}><span>{pad(index + 1)}</span>{topic}</li>)}
          </ol>
        </section>

        {kitSurvey && (
          <aside className="course-kit" aria-labelledby="kit-title">
            <div><p className="course-kicker">GELİŞTİRDİĞİMİZ KİT</p><h2 id="kit-title">{kitSurvey.name}: görüşünü paylaş.</h2><p>{kitSurvey.text}</p></div>
            <a className="course-primary" href={kitSurvey.href} target="_blank" rel="noopener noreferrer">Ankete katıl <ArrowUpRight size={16} /></a>
          </aside>
        )}

        {hasPractice && (
          <section className="course-practice-block" aria-labelledby="practice-title">
            <p className="course-kicker">02 / UYGULAMA</p>
            <h2 id="practice-title">Elle tutulur çalışmalar.</h2>
            <ul>{course.practice.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
        )}

        <section className="course-related" aria-labelledby="related-title"><div className="course-section-heading"><div><p className="course-kicker">{hasPractice ? "03" : "02"} / KEŞFE DEVAM</p><h2 id="related-title">Diğer eğitimler.</h2></div></div><nav aria-label="Diğer eğitimler">{allPrograms.filter(item => item.type !== type).map(item => <a href={courseHref(item.type)} key={item.type}><VehicleMark type={item.type} /><div><h3>{item.name}</h3><p>{item.summary}</p></div><ArrowRight size={19} /></a>)}</nav></section>
      </main>
      <footer className="course-footer course-shell"><span>KAYRA TECHNOLOGY · {contact.location.toLocaleUpperCase("tr")}</span><a href={mailto()}>{contact.email} <ArrowUpRight size={14} /></a></footer>
    </div>
  );
}
