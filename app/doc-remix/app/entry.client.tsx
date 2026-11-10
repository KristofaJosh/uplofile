import { PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;

if (import.meta.env.PROD && token) {
  posthog.init(token, {
    api_host: import.meta.env.VITE_POSTHOG_HOST,
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
  });
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <PostHogProvider client={posthog}>
        <HydratedRouter />
      </PostHogProvider>
    </StrictMode>,
  );
});
