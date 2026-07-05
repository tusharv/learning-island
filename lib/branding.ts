export const BRAND_NAME = "Learning Island";

export const BRAND_ASSETS = {
  logoPath: "/learning-island-logo.png",
  landscapeLogoPath: "/learning-island-logo-landscape.png",
  markPath: "/learning-island-mark.png",
  faviconPath: "/learning-island-mark.png",
  openGraphPath: "/learning-island-logo-landscape.png",
} as const;

export const BRAND_COLORS = {
  ocean: "#0ea5e9",
  deepOcean: "#0757b4",
  palm: "#52b51f",
  sunshine: "#ffc928",
  coral: "#ff5a44",
  warmPanel: "#fffdf0",
} as const;

export function buildOpenGraphImage() {
  return {
    url: BRAND_ASSETS.openGraphPath,
    width: 1800,
    height: 620,
    alt: `${BRAND_NAME} logo`,
  };
}
