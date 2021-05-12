const formatText = (text) => {
  // remove urls
  text = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

  // remove hashtags
  return text.replace(/(^|\W)(#[a-z\d][\w-]*)/gi, "");
};

const isValidUrl = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

// converts maybeValidUrl into an absolute url
const formatUrl = (url, maybeValidUrl) => {
    if (!maybeValidUrl) {
      return null
    }

    if (isValidUrl(maybeValidUrl)) {
        return maybeValidUrl;
    }

    // get origin from url
    var pathArray = url.split( '/' );
    var protocol = pathArray[0];
    var host = pathArray[2];
    var urlOrigin = protocol + "//" + host;

    // combine origin with path
    return urlOrigin + maybeValidUrl
}

module.exports = { formatText, isValidUrl, formatUrl }
