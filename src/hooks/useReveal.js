import { useEffect } from "react";

/**
 * Fades elements marked with `data-reveal` into view the first time they enter the viewport.
 * Elements stay visible if IntersectionObserver is unavailable; reduced-motion users get no
 * movement because the global reduced-motion rule collapses the transition.
 *
 * @param {React.RefObject<HTMLElement>} rootRef container whose `[data-reveal]` descendants are observed
 * @param {boolean} enabled start observing only once the page is actually shown
 */
export function useReveal(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current;
    if (!enabled || !root) return undefined;
    const targets = [...root.querySelectorAll("[data-reveal]")];
    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-revealed"));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [rootRef, enabled]);
}
