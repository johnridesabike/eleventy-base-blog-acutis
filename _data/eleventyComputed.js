/**
 * Acutis templates don't use filters or shortcodes like other languages, so
 * it's important that we pre-compute any data we may need.
 */
const pluginRss = require("@11ty/eleventy-plugin-rss");
const { language, timeZone } = require("./metadata");

const filteredTags = new Set(["all", "nav", "post", "posts"]);

module.exports = {
	date: ({ page: { date } }) => {
		return {
			day: date.toLocaleString(language, { day: "numeric", timeZone }),
			fullMonth: date.toLocaleString(language, { month: "long", timeZone }),
			shortMonth: date.toLocaleString(language, { month: "short", timeZone }),
			year: date.toLocaleString(language, { year: "numeric", timeZone }),
			// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
			htmlDate:
				date.toLocaleString("en-US", { year: "numeric", timeZone }) +
				"-" +
				date.toLocaleString("en-US", { month: "2-digit", timeZone }) +
				"-" +
				date.toLocaleString("en-US", { day: "2-digit", timeZone }),
			dateRfc3339: pluginRss.dateToRfc3339(date),
		};
	},
	// 11ty sometimes sets the url to `false`, which clashes with type `string`.
	// We'll set falsey values to `null` instead, so it safely becomes nullable.
	safeUrl: ({ page: { url } }) => (url ? url : null),
	filteredTags: (data) =>
		(data.tags || []).filter((tag) => !filteredTags.has(tag)),
};
