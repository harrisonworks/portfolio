import axios from 'axios'
const dynamicRoutes = () => {
  const routes = axios
    .get(
      `${process.env.API_URL}/index.php/wp-json/wp/v2/posts?page=1&per_page=20&_embed=1&acf_format=standard`
    )
    .then((res) => {
      console.log(res.data.length)
      return res.data.map((post) => `/project/${post.slug}`)
    })
  // console.log(routes)
  return routes
}

export default {
  ssr: true,
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Harrison McEwen | Designer, Web Developer, and Creative Coder',
    titleTemplate: '%s',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1, viewport-fit=cover',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black-translucent',
      },

      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: ['~/assets/styles/main.scss'],

  // when generating this plugin needs to be run on the server
  plugins: [
    { src: '~/plugins/posts.server.js', mode: 'server' },
    {
      src: '~/plugins/gtag.js',
      mode: 'client',
    },
  ],

  components: true,

  generate: {
    routes: dynamicRoutes,
  },

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode',
    '@nuxtjs/device',
    ['nuxt-magpie', { keepFolderStructure: true }],
  ],

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxtjs/google-fonts',
    'nuxt-rfg-icon',
    '@nuxtjs/manifest',
    'nuxt-gsap-module',

    [
      'nuxt-social-meta',
      {
        url: 'https://harrison.works',
        title: 'Harrison McEwen - designer, web developer, and creative coder',
        site_name:
          'Harrison McEwen - designer, web developer, and creative coder',
        description:
          'Harrison is a designer, web developer, and creative coder. He has worked for large incumbents, small agencies, and medium-sized startups.',
        img: '/meta.png',
        img_size: { width: '1200', height: '630' },
        locale: 'en_US',
        twitter: '@user',
        twitter_card: '/meta.png',
        theme_color: '#d5d7ce',
      },
    ],
  ],
  sitemap: {
    hostname: 'https://harrison.works',
  },
  robots: {
    UserAgent: '*',
    Disallow: '',
    Sitemap: 'https://harrison.works',
  },
  googleFonts: {
    families: {
      Cabin: {
        wght: [400, 500, 600, 700],
        ital: [400, 500, 600, 700],
      },
    },
  },
  gsap: {
    extraPlugins: {
      scrollTrigger: true,
    },
  },

  publicRuntimeConfig: {
    baseURL: process.env.API_URL,
    gTag: process.env.G_TAG,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    terser: {
      // https://github.com/terser/terser#compress-options
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
}
