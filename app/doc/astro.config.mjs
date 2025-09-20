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
          { label: "Basic", slug: "examples/basic"  },
          { label: "Custom", slug: "examples/custom"  },
        ],
      },
    ],
    customCss: ['./src/styles/global.css'],
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});