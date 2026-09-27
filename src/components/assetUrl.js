/**
 * Resolves a file from public/ against Vite's base path, so the site works at "/" (own domain)
 * and under a sub-path such as "/egitim/" (served from another site). Example: asset("images/a.webp").
 */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
