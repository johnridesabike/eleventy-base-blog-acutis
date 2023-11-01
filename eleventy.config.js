const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const acutisEleventy = require("acutis-lang/eleventy");
const acutisComponents = require("./eleventy.config.acutisComponents.js");

const pluginDrafts = require("./eleventy.config.drafts.js");

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css"
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	// Instead of using filters, we need to define collections.

	// Get all post tags, sorted alphabetically.
	eleventyConfig.addCollection("allTags", (collectionApi) => {
		const tagSet = new Set();
		collectionApi
			.getAll()
			.forEach((item) => {
				(item.data.filteredTags || []).forEach((tag) => tagSet.add(tag))}
			);
		const arr = Array.from(tagSet);
		arr.sort((a, b) => a.localeCompare(b));
		return arr
	});

	// Create a collection of the last 3 posts for the front page.
	eleventyConfig.addCollection("frontPage", (collectionApi) => {
		const allPosts = collectionApi
			.getFilteredByTag("posts")
			.filter((x) => x.data.safeUrl)
			.sort((a, b) => b.date - a.date);
		const posts = allPosts.slice(0, 3);
		const length = posts.length;
		const remainder = allPosts.length - length;
		return { list: posts, length, remainder };
	});

	// Derive a new collection from "posts" that sorts by descending date and adds
	// previous and next links.
	eleventyConfig.addCollection("blog", (collectionApi) => {
		const posts = collectionApi
			.getFilteredByTag("posts")
			.filter((x) => x.data.safeUrl)
			.sort((a, b) => b.date - a.date);
		for (let i = 0; i < posts.length; i++) {
			posts[i].data.next = posts[i - 1] || null;
			posts[i].data.previous = posts[i + 1] || null;
		}
		return {
			list: posts,
			length: posts.length,
		};
	});

	// This is a quick-and-easy way for us to use the eleventyNavigation metadata
	// without the eleventyNavigation plugin itself. It does not support all of
	// the eleventyNavigation features, like nesting.
	eleventyConfig.addCollection("navigation", (collectionApi) =>
		collectionApi
			.getAll()
			.filter((item) => "eleventyNavigation" in item.data)
			.sort(
				(a, b) =>
					(a.data.eleventyNavigation.order || 0) -
					(b.data.eleventyNavigation.order || 0)
			)
	);

	eleventyConfig.addPlugin(acutisEleventy, {
		components: acutisComponents(eleventyConfig),
	});

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
			"11ty.js",
			"acutis"
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "acutis",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "acutis",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
