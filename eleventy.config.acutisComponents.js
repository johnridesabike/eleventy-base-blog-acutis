/*
 * In Acutis, template components may either be written in Acutis syntax or
 * defined as functions. These functions fill the same role that filters or
 * shortcodes do in other template languages, although they work slightly
 * differently.
 */
const path = require("path");
const fs = require("fs/promises");
const { Component, Typescheme } = require("acutis-lang");
const eleventyImage = require("@11ty/eleventy-img");
const slugify = require("@sindresorhus/slugify");

const Ty = Typescheme;

function relativeToInputPath(inputPath, relativeFilePath) {
	let split = inputPath.split("/");
	split.pop();
	return path.resolve(split.join(path.sep), relativeFilePath);
}

// Note that the Acutis 11ty plugin uses async templates, so all component
// functions must be async as well.
module.exports = (eleventyConfig) => {
	const components = {};
	// Eleventy Image component
	// https://www.11ty.dev/docs/plugins/image/
	components.Image = async function Image({
		src,
		alt,
		widths,
		sizes,
		page: { inputPath },
	}) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		let formats = ["avif", "webp", "auto"];
		let file = relativeToInputPath(inputPath, src);
		let metadata = await eleventyImage(file, {
			widths: widths || ["auto"],
			formats,
			outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
		});
		// TODO loading=eager and fetchpriority=high
		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		};
		return eleventyImage.generateHTML(metadata, imageAttributes);
	};
	components.Image.interface = Ty.make([
		["src", Ty.string()],
		["alt", Ty.string()],
		// We need to explicitly pass the page.inputPath value.
		["page", Ty.record([["inputPath", Ty.string()]])],
		["widths", Ty.nullable(Ty.list(Ty.string()))],
		["sizes", Ty.nullable(Ty.string())],
	]);

	// This does the same thing as the 11ty slugify filter.
	components.Slugify = async function Slugify({ children }) {
		return slugify(children, { decamelize: false });
	};
	components.Slugify.interface = Ty.make([["children", Ty.string()]]);

	// Load any arbitrary file content into a template.
	components.Include = async function ({ path }) {
		return fs.readFile(path, { encoding: "utf8" });
	};
	components.Include.interface = Ty.make([["path", Ty.string()]]);

	// Acutis has no built-in way to check equality (nor any built-in functions at
	// all) so this does it manually.
	components.IfEqual = async function ({ vals, children }) {
		return vals[0] === vals[1] ? children : "";
	};
	components.IfEqual.interface = Ty.make([
		["vals", Ty.tuple([Ty.unknown(), Ty.unknown()])],
		["children", Ty.string()],
	]);

	// Combine a base and a path into a full URL.
	components.FullUrl = async function ({ base, path }) {
		const url = new URL(path, base);
		return url.href;
	};
	components.FullUrl.interface = Ty.make([
		["base", Ty.string()],
		["path", Ty.string()],
	]);

	return components;
};
