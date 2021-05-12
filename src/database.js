const { db_config } = require("./config");
const MongoClient = require("mongodb").MongoClient;

const connString = `mongodb+srv://${db_config.USERNAME}:${db_config.PASS}@cluster0.${db_config.CLUSTER}.mongodb.net/${db_config.CONNECTION_NAME}?retryWrites=true&w=majority`;

const connectDatabase = async () => {
  try {
    const client = await MongoClient.connect(connString, {
      // useUnifiedTopology: true, // why is this making the connection time out!!
    });
    const db = client.db(db_config.NAME);
    const bookmarksCollection = db.collection("bookmarks");

    return { bookmarksCollection };
  } catch (err) {
    console.error(err);
  }
};

class BookmarksManager {
  constructor(bookmarksCollection) {
    this.bookmarksCollection = bookmarksCollection;
  }

  async createBookmark(bookmark) {
    try {
      const res = await this.bookmarksCollection.insertOne(bookmark);
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async getBookmarks() {
    try {
      const res = await this.bookmarksCollection.find().toArray();
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async getBookmark(url) {
    try {
      const res = await this.bookmarksCollection.findOne({ url: url });
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteBookmark(url) {
    try {
      const res = await this.bookmarksCollection.deleteMany({ url: url });
      return res;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = {
  connectDatabase,
  BookmarksManager,
};
