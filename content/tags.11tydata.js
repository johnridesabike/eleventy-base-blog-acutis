const slugify = require("@sindresorhus/slugify");

module.exports = {
	pagination: {
		data: "collections",
		size: 1,
		alias: "tag",
		filter: [
			"all",
			"post",
			"posts",
			"allTags",
			"frontPage",
			"blog",
		],
		addAllPagesToCollections: true,
	},
	eleventyComputed: {
		title: ({ tag }) => `Tagged “${tag}”`,
		list: ({ collections, tag }) => {
			const arr = collections[tag].slice();
			arr.reverse();
			return arr;
		},
		length: ({ collections, tag }) => collections[tag].length,
	},
	permalink: ({ tag }) => `/tags/${slugify(tag, { decamelize: false })}/`,
};
