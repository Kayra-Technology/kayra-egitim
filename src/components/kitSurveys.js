import { asset } from "./assetUrl";

// Kits under development, each with a data-collection survey (Google Forms, 2026-09-28).
// Links go through the site's own short path (vercel.json redirect) so the form can change
// without touching the pages. `type` matches the related training program.
export const kitSurveys = [
  {
    type: "uav", name: "İHA kiti",
    text: "Başlangıç seviyesine uygun bir İHA kiti geliştiriyoruz. Fikrini 2 dakikada paylaş.",
    href: asset("anket/iha"),
  },
  {
    type: "rocket", name: "Roket kiti",
    text: "Başlangıç seviyesine uygun bir roket kiti geliştiriyoruz. Fikrini 2 dakikada paylaş.",
    href: asset("anket/roket"),
  },
];

export const findKitSurvey = (type) => kitSurveys.find((survey) => survey.type === type);
