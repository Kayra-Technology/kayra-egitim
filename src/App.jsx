import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Intro } from "./components/Intro";
import { HoverIntro } from "./components/HoverIntro";
import { RefinedIntro } from "./components/RefinedIntro";
import { HomePage } from "./components/HomePage";
import { CoursePage } from "./components/CoursePage";
import { courseFromHash, courseHref } from "./components/courseContent";

// Default (2026-09-27, Görkem): the scrolling intro. ?intro=refined keeps the full-screen overlay version.
const introVariant = new URLSearchParams(window.location.search).get("intro") || "scroll";
const hoverPreview = introVariant !== "click";
const IntroView = introVariant === "click" ? Intro : introVariant === "hover" ? HoverIntro : RefinedIntro;
// scroll: the refined intro is the first section of the home page instead of an overlay.
const inlineIntro = introVariant === "scroll";

function App() {
  const [courseType, setCourseType] = useState(courseFromHash);
  const [introPhase, setIntroPhase] = useState(() =>
    courseFromHash() ? "done" : window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "exploring" : "drawing",
  );
  const homeLink = useRef(null);
  const returningHome = useRef(false);
  function discoverTraining(type) {
    window.location.hash = courseHref(type);
  }

  useLayoutEffect(() => {
    if (introPhase === "leaving") {
      // Clear an old section anchor without dispatching a route change that
      // would interrupt the intro's exit animation.
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      returningHome.current = true;
    } else if (introPhase === "done" && returningHome.current) {
      returningHome.current = false;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      homeLink.current?.focus({ preventScroll: true });
    }
  }, [introPhase]);

  useEffect(() => {
    function syncRoute() {
      setCourseType(courseFromHash());
      setIntroPhase("done");
    }
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    if (courseType || (introPhase !== "done" && !inlineIntro) || window.location.hash !== "#alanlar") return;
    const frame = requestAnimationFrame(() => document.getElementById("alanlar")?.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, [courseType, introPhase]);

  useEffect(() => {
    if (introPhase === "done" || introPhase === "exploring") return;
    const nextPhase = { drawing: hoverPreview ? "exploring" : "ready", ready: "leaving", leaving: "done" };
    const duration = { drawing: 2600, ready: 5000, leaving: 600 };
    const id = window.setTimeout(
      () => setIntroPhase(nextPhase[introPhase]),
      duration[introPhase],
    );
    return () => window.clearTimeout(id);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase === "done" || inlineIntro) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [introPhase]);

  if (courseType) return <CoursePage type={courseType} />;

  const explore = () => setIntroPhase((phase) => phase === "leaving" || (hoverPreview && phase === "drawing") ? phase : "exploring");

  if (inlineIntro) {
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    const intro = <RefinedIntro inline onDiscover={discoverTraining} ready={introPhase !== "drawing"} leaving={false} onExplore={explore} onSkip={() => scrollTo("alanlar")} />;
    return <HomePage ref={homeLink} ready intro={intro} onReplayIntro={() => scrollTo("top")} />;
  }

  return (
    <>
      {introPhase !== "done" && <IntroView onDiscover={discoverTraining} ready={introPhase !== "drawing"} leaving={introPhase === "leaving"} onExplore={explore} onSkip={() => setIntroPhase("leaving")} />}

      <HomePage ref={homeLink} ready={introPhase === "done"} onReplayIntro={() => setIntroPhase("exploring")} />
    </>
  );
}

const RovLab = lazy(() => import("./components/RovLab"));

export default function AppVersion() {
  if (new URLSearchParams(window.location.search).get("view") === "rov-lab") {
    return <Suspense fallback={<p role="status" style={{ padding: "3rem" }}>3D atölye hazırlanıyor…</p>}><RovLab /></Suspense>;
  }
  return <App />;
}
