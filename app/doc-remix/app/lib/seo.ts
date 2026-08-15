import type { MetaDescriptor } from "react-router";

const siteUrl = "https://uplofile.kristofajosh.dev";
const socialImageUrl = `${siteUrl}/og-image.png`;

function canonicalUrl(pathname: string) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  return new URL(path, siteUrl).toString();
}

export function withPageMeta(
  pathname: string,
  metadata: MetaDescriptor[],
): MetaDescriptor[] {
  const title = metadata.find(
    (item): item is { title: string } =>
      "title" in item && typeof item.title === "string",
  )?.title;
  const description = metadata.find(
    (item): item is { name: string; content: string } =>
      "name" in item &&
      item.name === "description" &&
      "content" in item &&
      typeof item.content === "string",
  )?.content;
  const url = canonicalUrl(pathname);

  if (!title || !description) {
    throw new Error("Page metadata requires a title and description.");
  }

  return [
    ...metadata,
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: socialImageUrl },
    {
      property: "og:image:alt",
      content: "Uplofile — Composable React file upload UI primitives",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: socialImageUrl },
  ];
}
