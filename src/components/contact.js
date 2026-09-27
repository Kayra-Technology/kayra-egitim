// Public contact details as published on https://www.kayra.technology/ (checked 2026-09-27).
export const contact = {
  email: "kurumsal@kayra.technology",
  location: "İTÜ Özdemir Bayraktar Tasarım ve Prototipleme Merkezi",
  website: "https://www.kayra.technology/",
};

/** mailto link with a prefilled subject, e.g. for a training enquiry. */
export const mailto = (subject) => `mailto:${contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
