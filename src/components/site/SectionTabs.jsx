import "./section-tabs.css";

// The three parts of kayra.technology: Ar-Ge (corporate Next.js site), this app (/egitim)
// and the careers app (/kariyer, kayra-kariyer repo).
// The corporate navbar links the same three sections; keep labels and paths in sync.
export const sections = [
  { id: "arge", label: "Ar-Ge", href: "/" },
  { id: "egitim", label: "Eğitim", href: "/egitim" },
  { id: "kariyer", label: "Kariyer", href: "/kariyer" },
];

/** Section tabs shown inside each page's own header (one bar, no separate strip). */
export function SectionTabs({ current }) {
  return (
    <nav className="section-tabs" aria-label="Kayra bölümleri">
      {sections.map((section) => (
        <a key={section.id} href={section.href} aria-current={section.id === current ? "page" : undefined}>{section.label}</a>
      ))}
    </nav>
  );
}
