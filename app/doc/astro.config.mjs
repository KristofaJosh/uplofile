// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: "Uplofile",
    social: [
      {
        icon: "github",
        label: "GitHub",
        href: "https://github.com/KristofaJosh/uplofile",
      },
      {
        icon: "stackOverflow",
        label: "StackOverflow",
        href: "https://stackoverflow.com/users/8149165/chris-josh",
      },
    ],
    sidebar: [
      {
        label: 'Getting Started',
        items: [
          { label: 'Installation', slug: 'installation' },
        ],
      },
      {
        label: "Examples",
        items: [
          { label: "Basic", slug: "examples/basic" },
          { label: "Custom", slug: "examples/custom" },
          { label: "Card Type Upload", slug: "examples/card-type-upload" },
          { label: "Controlled Form", slug: "examples/controlled-form" },
          { label: "Dropzone Showcase", slug: "examples/dropzone-showcase" },
          { label: "Max Count and Accept", slug: "examples/max-count-and-accept" },
          { label: "Product Moderation", slug: "examples/product-moderation" },
          { label: "Spinner Avatar Upload", slug: "examples/spinner-avatar-upload" },
        ],
      },
    ],
    customCss: ['./src/styles/global.css'],
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});