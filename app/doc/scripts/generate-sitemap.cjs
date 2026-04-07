const fs = require("fs");

const hostname = "https://uplofile.kristofajosh.dev";

const staticRoutes = [
  { path: "/", changefreq: "weekly" },
  { path: "/installation", changefreq: "monthly" },
  { path: "/quick-start", changefreq: "monthly" },
  { path: "/components/root", changefreq: "monthly" },
  { path: "/components/trigger", changefreq: "monthly" },
  { path: "/components/preview", changefreq: "monthly" },
  { path: "/components/dropzone", changefreq: "monthly" },
  { path: "/components/hidden-input", changefreq: "monthly" },
  { path: "/api/props", changefreq: "monthly" },
  { path: "/api/actions", changefreq: "monthly" },
  { path: "/examples/basic", changefreq: "monthly" },
  { path: "/examples/dropzone", changefreq: "monthly" },
  { path: "/examples/image-gallery", changefreq: "monthly" },
  { path: "/examples/avatar", changefreq: "monthly" },
  { path: "/examples/file-list", changefreq: "monthly" },
  { path: "/examples/form", changefreq: "monthly" },
  { path: "/examples/video", changefreq: "monthly" },
  { path: "/examples/validation", changefreq: "monthly" },
  { path: "/examples/default-preview", changefreq: "monthly" },
  { path: "/examples/sortable-gallery", changefreq: "monthly" },
  { path: "/examples/root-imperative", changefreq: "monthly" },
  { path: "/examples/loading-state", changefreq: "monthly" },
  { path: "/examples/pause-resume", changefreq: "monthly" },
];

const routes = staticRoutes;

const renderUrl = ({ path: routePath, changefreq, lastmod }) => {
  const lines = [`  <url>`, `    <loc>${hostname}${routePath}</loc>`];

  if (lastmod) {
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
  }

  if (changefreq) {
    lines.push(`    <changefreq>${changefreq}</changefreq>`);
  }

  lines.push(`  </url>`);

  return lines.join("\n");
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(renderUrl).join("\n")}
</urlset>
`;

fs.writeFileSync("public/sitemap.xml", sitemap);
console.log("Sitemap generated with", routes.length, "routes");
