<p align="center">
  <a href="https://harrison.works" target="_blank">
    <img width="100" src="./static/icon.png" alt="logo">
  </a>
</p>

<h2 align="center">🔥 Portfolio 🔥</h2>
<p align="center">Hi, my name is Harrison. I'm a designer who likes to code 🤓
</p>
<br/>
This repo contains the configuration of my jamstack portfolio which uses a headless wordpress. For the best experience, just view my portfolio via this link. If you are still curious how this works you have been warned, this will not work just by cloning the repo... 👹

<h3>
  <a href="https://harrison.works" target="_blank">
    https://harrison.works
  </a>
</h3>

## Tech Stack 📚

This portfolio is decoupled with the WordPress CMS hosted on basic shared hosting and the nuxt.js frontend being deployed by Vercel. If you are just getting started and want to do this type of setup yourself, I would look at this example first by Netlify

[headless-wp-nuxt](https://github.com/netlify-labs/headless-wp-nuxt)

#### Nuxt.js

##### Key Packages

- Bootstrap (general styling and resets)
- Three.js (for the header animations)
- GSAP (transition animations)
- nuxt-magpie (downloads all remote assets into build)

#### Wordpress

##### Setup

- Nude (Theme)
- Advanced Custom Fields
- Headless Mode
- WP REST Cache
- Vercel Deploy Hooks

## Permissions

This portfolio is a mishmash of public repositories and blog posts that I have modified and added my additions. You can use parts of the code for your own site, it is open source so people can learn from it and adapt it just like I did. However, I would encourage you to modify the theme and components to make them your own.

## Build

⚠️ You will need your own decoupled wordpress for this to work

#### Local Development Setup

```bash
# install dependencies
$ yarn
$ yarn dev
```

#### Generate For Deploy

```bash
# generate static project
# creates folder ./dist
$ yarn generate
$ yarn start
```
