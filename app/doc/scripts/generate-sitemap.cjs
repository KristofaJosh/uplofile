const fs = require("fs");

const routes = [
  "/",
  "/installation",
  "/quick-start",
  "/components/root",
  "/components/trigger",
  "/components/preview",
  "/components/dropzone",
  "/components/hidden-input",
  "/api/props",
  "/api/actions",
  "/examples/basic",
  "/examples/dropzone",
  "/examples/image-gallery",
  "/examples/avatar",
  "/examples/file-list",
  "/examples/form",
  "/examples/video",
  "/examples/validation",
  "/examples/default-preview",
  "/examples/sortable-gallery",
  "/examples/root-imperative",
  "/examples/loading-state",
];

const hostname = "https://uplofile.kristofajosh.dev";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${hostname}${route}</loc></url>`).join("\n")}
</urlset>
`;

fs.writeFileSync("public/sitemap.xml", sitemap);
console.log("Sitemap generated with", routes.length, "routes");
