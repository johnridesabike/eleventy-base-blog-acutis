# eleventy-base-blog v8, Acutis edition

A starter repository showing how to build a blog with the [Eleventy](https://www.11ty.dev/) site generator (using the [v2.0 release](https://www.11ty.dev/blog/eleventy-v2/)).

[![Netlify Status](https://api.netlify.com/api/v1/badges/f0881677-5b1b-44f7-b2c7-5b593860fa52/deploy-status)](https://app.netlify.com/sites/eleventy-base-blog-acutis/deploys)

## A note about this Acutis edition

This is a fork of the official [eleventy-base-blog] repository which has been
rewritten to use the [Acutis] template language. This is a proof-of-concept, and
it may not be as up-to-date as the original eleventy-base-blog.

[eleventy-base-blog]: https://github.com/11ty/eleventy-base-blog
[acutis]: https://johnridesa.bike/acutis/

Acutis is an experimental language that works differently than the other
languages that ship with Eleventy. This repository's configuration is
necessarily different than the original. Not all Eleventy features are
compatible with Acutis templates, and some features are rough around the edges,
such as error handling.

[You can see the exact differences here](https://github.com/11ty/eleventy-base-blog/compare/main...johnridesabike:eleventy-base-blog-acutis:main).

Feel free to play with this if you want to experiment. As the license states:
this software is provided "as is" without warranty of any kind.

## Getting Started

1. Clone this Repository

```
git clone https://github.com/johnridesabike/eleventy-base-blog-acutis.git my-blog-name
```

2. Navigate to the directory

```
cd my-blog-name
```

3. Have a look at `eleventy.config.js` to see if you want to configure any Eleventy options differently.
4. Install dependencies

```
npm install
```

5. Edit `_data/metadata.js` to change the site data.
6. Run Eleventy

Generate a production-ready build:

```
npx @11ty/eleventy
```

Or build and host locally on a local development server:

```
npx @11ty/eleventy --serve
```

Or you can run [debug mode](https://www.11ty.dev/docs/debugging/) to see all the internals.

## Features

- Using [Eleventy v2.0](https://www.11ty.dev/blog/eleventy-v2/) with zero-JavaScript output.
	- Content is exclusively pre-rendered (this is a static site).
	- All URLs are decoupled from the content’s location on the file system.
	- Configure templates via the [Eleventy Data Cascade](https://www.11ty.dev/docs/data-cascade/)
- **Performance focused**: four-hundos Lighthouse score out of the box!
	- [View the Lighthouse report for the latest build](https://eleventy-base-blog-acutis.netlify.app/reports/lighthouse/) courtesy of the [Netlify Lighthouse plugin](https://github.com/netlify/netlify-plugin-lighthouse).
	- _0 Cumulative Layout Shift_
	- _0ms Total Blocking Time_
- Local development live reload provided by [Eleventy Dev Server](https://www.11ty.dev/docs/dev-server/).
- Content-driven [navigation menu](https://www.11ty.dev/docs/plugins/navigation/)
- [Image optimization](https://www.11ty.dev/docs/plugins/image/) via the `{% Image / %}` Acutis component.
	- Zero-JavaScript output.
	- Support for modern image formats automatically (e.g. AVIF and WebP)
	- Prefers `<img>` markup if possible (single image format) but switches automatically to `<picture>` for multiple image formats.
	- Automated `<picture>` syntax markup with `srcset` and optional `sizes`
	- Includes `width`/`height` attributes to avoid [content layout shift](https://web.dev/cls/).
	- Includes `loading="lazy"` for native lazy loading without JavaScript.
	- Includes [`decoding="async"`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding)
	- Images can be co-located with blog post files.
	- View the [Image component source code](https://github.com/johnridesabike/eleventy-base-blog-acutis/blob/main/eleventy.config.acutisComponents.js)
- Built-in [syntax highlighter](https://www.11ty.dev/docs/plugins/syntaxhighlight/) (zero-JavaScript output).
- Blog Posts
	- Draft posts: use `draft: true` to mark a blog post as a draft. Drafts are **only** included during `--serve`/`--watch` and are excluded from full builds. View the [Drafts plugin source code](https://github.com/johnridesabike/eleventy-base-blog-acutis/blob/main/eleventy.config.drafts.js).
	- Automated next/previous links
	- Accessible deep links to headings
- Generated Pages
	- Home, Archive, and About pages.
	- [Feeds for Atom and JSON](https://www.11ty.dev/docs/plugins/rss/)
	- `sitemap.xml`
	- Zero-maintenance tag pages ([View on the Demo](https://eleventy-base-blog-acutis.netlify.app/tags/))
	- Content not found (404) page

## Demos

- [Netlify](https://eleventy-base-blog-acutis.netlify.com/)

## Deploy this to your own site

Deploy this Eleventy site in just a few clicks on these services:

- [Get your own Eleventy web site on Netlify](https://app.netlify.com/start/deploy?repository=https://github.com/johnridesabike/eleventy-base-blog-acutis)
- If you run Eleventy locally you can drag your `_site` folder to [`drop.netlify.com`](https://drop.netlify.com/) to upload it without using `git`.
- Read more about [Deploying an Eleventy project](https://www.11ty.dev/docs/deployment/) to the web.

### Implementation Notes

- `content/about/index.md` is an example of a content page.
- `content/blog/` has the blog posts but really they can live in any directory. They need only the `post` tag to be included in the blog posts [collection](https://www.11ty.dev/docs/collections/).
- Use the `eleventyNavigation` key (via the [Eleventy Navigation plugin](https://www.11ty.dev/docs/plugins/navigation/)) in your front matter to add a template to the top level site navigation. This is in use on `content/index.11tydata.js` and `content/about/index.md`.
- Content can be in _any template format_ (blog posts needn’t exclusively be markdown, for example). Configure your project’s supported templates in `eleventy.config.js` -> `templateFormats`.
- The `public` folder in your input directory will be copied to the output folder (via `addPassthroughCopy` in the `eleventy.config.js` file). This means `./public/css/*` will live at `./_site/css/*` after your build completes.
- Provides two content feeds:
	- `content/feed/feed.acutis`
	- `content/feed/json.11ty.js`
- This project uses three [Eleventy Layouts](https://www.11ty.dev/docs/layouts/):
	- `_includes/layoutBase.acutis`: the top level HTML structure
	- `_includes/layoutHome.acutis`: the home page template (wrapped into `layoutBase.acutis`)
	- `_includes/layoutPost.acutis`: the blog post template (wrapped into `layoutBase.acutis`)
- `_includes/postsList.acutis` is an Acutis template and is a reusable component used to display a list of all the posts. `content/index.acutis` has an example of how to use it.

