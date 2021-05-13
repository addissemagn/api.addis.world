const metadata = require("./metadata");

const bookmarks = {
  // get all bookmarks
  get: async (req, res, db) => {
    const result = await db.getBookmarks();
    res.send(result);
  },
  // delete a bookmark by url
  delete: async (req, res, db) => {
    const { url } = req.body;
    await db.deleteBookmark(url);

    return {
      message: "deleted"
    }
  },
  // create bookmark
  create: async (req, res, db) => {
    const { url, is_link } = req.body;
    const dm = req.body.dm;

    // check if bookmark exists
    const result = await db.getBookmark(url);
    if (result) {
      return {
        message: "exists",
        ...result
      }
    }

    try {
      const bookmark = is_link ? await metadata.get(url) : {};

      const response = await db.createBookmark({
        ...dm,
        ...bookmark
      });

      return {
        message: "created",
        response,
        ...dm,
        ...bookmark
      };
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = bookmarks;
