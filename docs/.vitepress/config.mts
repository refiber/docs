import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Refiber",
  description: "For you who love Go & React",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "v0.2", link: "/v0.2/" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present Kevin Adam",
    },

    search: {
      provider: "local",
    },

    sidebar: {
      "/": [
        {
          text: "Examples",
          items: [
            { text: "Markdown Examples", link: "/markdown-examples" },
            { text: "Runtime API Examples", link: "/api-examples" },
          ],
        },
      ],

      "/v0.2/": [
        {
          text: "Getting Started",
          collapsed: true,
          items: [
            { text: "Installation", link: "/v0.2/" },
            { text: "Directory Structure", link: "/v0.2/structure" },
          ],
        },

        {
          text: "The Basics",
          items: [
            { text: "Routing", link: "/v0.2/basics/routing" },
            { text: "Model", link: "/v0.2/basics/model" },
            { text: "Controller", link: "/v0.2/basics/controller" },
            { text: "View", link: "/v0.2/basics/view" },
            { text: "Middleware", link: "/v0.2/basics/middleware" },
            { text: "Session", link: "/v0.2/basics/session" },
            { text: "Database", link: "/v0.2/basics/database" },
          ],
        },

        {
          text: "Testing",
          link: "/v0.2/testing",
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/refiber/refiber" },
    ],
  },
});
