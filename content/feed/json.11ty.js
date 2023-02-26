/*
 * Acutis is not suited for writing JSON, but most template languages aren't.
 * Let's use the right tool for the job and just let JSON.stringify do the work.
 */

function Page() {}

Page.prototype.data = function data() {
	return {
		eleventyExcludeFromCollections: true,
		permalink: "/feed/feed.json",
	};
};

Page.prototype.render = function render({
	permalink,
	collections: {
		blog: { list },
	},
	metadata: {
		title,
		language,
		url: siteUrl,
		description,
		author: { name: authorName, url: authorUrl },
	},
}) {
	const json = {
		version: "https://jsonfeed.org/version/1.1",
		title: title,
		language: language,
		home_page_url: siteUrl,
		feed_url: permalink,
		description: description,
		author: {
			name: authorName,
			url: authorUrl,
		},
		items: list.map(
			({
				url,
				templateContent,
				data: {
					title,
					date: { dateRfc3339 },
				},
			}) => {
				const urlObj = new URL(url, siteUrl);
				const fullUrl = urlObj.href;
				return {
					id: fullUrl,
					url: fullUrl,
					title: title,
					content_html: templateContent || "",
					date_published: dateRfc3339,
				};
			}
		),
	};
	return JSON.stringify(json, null, 2);
};

module.exports = Page;
