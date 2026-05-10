import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type MetaFunction,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const meta: MetaFunction = () => {
  return [
    { charset: "utf-8" },
    { title: "Uplofile - React File Upload Components" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "description",
      content:
        "Headless, composable React file upload library. Bring your own upload logic, style it however you want.",
    },

    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://uplofile.kristofajosh.dev/" },
    {
      property: "og:title",
      content: "Uplofile - React File Upload Components",
    },
    {
      property: "og:description",
      content:
        "Headless, composable React file upload library. Bring your own upload logic, style it however you want.",
    },
    {
      property: "og:image",
      content: "https://uplofile.kristofajosh.dev/og-image.png",
    },

    // Twitter
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:url", content: "https://uplofile.kristofajosh.dev/" },
    {
      property: "twitter:title",
      content: "Uplofile - React File Upload Components",
    },
    {
      property: "twitter:description",
      content:
        "Headless, composable React file upload library. Bring your own upload logic, style it however you want.",
    },
    {
      property: "twitter:image",
      content: "https://uplofile.kristofajosh.dev/og-image.png",
    },
  ];
};

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500&display=swap",
  },
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon-96x96.png",
    sizes: "96x96",
  },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "shortcut icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
