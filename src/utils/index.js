const validUrl = require("valid-url");

const formatText = (text) => {
  // remove urls
  text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

  // remove hashtags
  return text.replace(/(^|\W)(#[a-z\d][\w-]*)/gi, "");
};

// converts maybeValidUrl into an absolute url
const formatImageUrl = (url, maybeValidUrl) => {
  if (!maybeValidUrl) {
    return null;
  }

  if (validUrl.isUri(maybeValidUrl)) {
    return maybeValidUrl;
  }

  // get origin from url
  var pathArray = url.split("/");
  var protocol = pathArray[0];
  var host = pathArray[2];
  var urlOrigin = protocol + "//" + host;

  // combine origin with path
  return new URL(maybeValidUrl, urlOrigin).href
};

module.exports = { formatText, formatImageUrl };
