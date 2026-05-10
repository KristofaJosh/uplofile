import { routes } from "virtual:react-router/server-build";

export async function loader() {
  const hostname = "https://uplofile.kristofajosh.dev";

  const urls = Object.values(routes)
    .filter((route) => {
      if (!route?.path && route?.id !== "routes/_index") return false;
      if (route?.path && route.path.includes("sitemap.xml")) return false;
      return true;
    })
    .map((route) => {
      // index routes often don't have a path property or their path is undefined
      // in React Router v7, index routes have index: true
      let path = route?.path || "";
      if (!path.startsWith("/")) path = "/" + path;
      const changefreq = path === "/" ? "weekly" : "monthly";

      return `  <url>
    <loc>${hostname}${path}</loc>
    <changefreq>${changefreq}</changefreq>
  </url>`;
    });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
