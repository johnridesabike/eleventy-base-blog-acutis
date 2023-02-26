/*
 * In Acutis, template components may either be written in Acutis syntax or
 * defined as functions. These functions fill the same role that filters or
 * shortcodes do in other template languages, although they work slightly
 * differently.
 */
const fs = require("fs/promises");
const slugify = require("@sindresorhus/slugify");
const { Component, Typescheme } = require("acutis-lang");

const Ty = Typescheme;

// The Acutis 11ty plugin uses async templates, so all components must be async.
module.exports = [
	// This does the same thing as the 11ty slugify filter.
	Component.funAsync(
		"Slugify",
		Ty.make([["children", Ty.string()]]),
		async ({ children }) => slugify(children, { decamelize: false })
	),
	// Loads any arbitrary file data.
	Component.funAsync(
		"Include",
		Ty.make([["path", Ty.string()]]),
		async ({ path }) => fs.readFile(path, { encoding: "utf8" })
	),
	// Acutis has no built-in way to check equality (nor any built-in functions at
	// all) so this does it manually.
	Component.funAsync(
		"IfEqual",
		Ty.make([
			["vals", Ty.tuple([Ty.string(), Ty.string()])],
			["children", Ty.string()],
		]),
		async ({ vals, children }) => (vals[0] === vals[1] ? children : "")
	),
	// Combine a base and a path into a full URL.
	Component.funAsync(
		"FullUrl",
		Ty.make([
			["base", Ty.string()],
			["path", Ty.string()],
		]),
		async ({ base, path }) => {
			const url = new URL(path, base);
			return url.href;
		}
	),
];
