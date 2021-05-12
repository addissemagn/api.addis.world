const fetch = require("node-fetch"),
  cheerio = require("cheerio"),
  { formatUrl } = require("../utils");

const metadata = {
  // extract metadata from a url
  get: async (url) => {
    try {
      const response = await fetch(url);
      const html = await response.text();

      const $ = cheerio.load(html);
      const title =
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        $('meta[name="title"]').attr("content");
      const description =
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content");
      const site_name = $('meta[property="og:site_name"]').attr("content");
      const image =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[property="og:image:url"]').attr("content");
      const icon =
        $('link[rel="icon"]').attr("href") ||
        $('link[rel="shortcut icon"]').attr("href");
      const keywords =
        $('meta[property="og:keywords"]').attr("content") ||
        $('meta[name="keywords"]').attr("content");

      const extracted = {
        url,
        title,
        description,
        site_name,
        // convert into absolute urls
        image: formatUrl(url, image),
        icon: formatUrl(url, icon),
        keywords,
      };

      return extracted;
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = metadata;
