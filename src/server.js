"use strict";

require("dotenv").config();

const express = require("express"),
  bodyParser = require("body-parser"),
  url = require("url"),
  cors = require("cors"),
  { validateWebhook, validateSignature } = require("twitter-autohook");

const bookmarks = require("./controllers/bookmarks"),
  { connectDatabase, BookmarksManager } = require("./database"),
  { twitter_config } = require("./config"),
  { formatText } = require("./utils");

const app = express(),
  router = express.Router();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/public", express.static("public"));
app.use("/", router);
// must route to Netlify Lambda
app.use("/.netlify/functions/server", router);

// initialize/retrieve db wrapper class
let bookmarksManagerDb;
const getDb = async () => {
  if (!bookmarksManagerDb) {
    const { bookmarksCollection } = await connectDatabase();
    bookmarksManagerDb = new BookmarksManager(bookmarksCollection);
  }
  return bookmarksManagerDb;
};

router.get("/", (req, res) => res.send("API is working!"));

router.get("/bookmarks", async (req, res) =>
  bookmarks.get(req, res, await getDb())
);

/*
router.post("/bookmarks", async (req, res) =>
  bookmarks.create(req, res, await getDb())
);

router.delete("/bookmarks", async (req, res) =>
  bookmarks.delete(req, res, await getDb())
);
*/
router.get("/webhook/twitter", async (req, res) => {
  // fulfills the CRC check when Twitter sends a CRC challenge
  if (req.query.crc_token) {
    const crc = validateWebhook(req.query.crc_token, twitter_config, res);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(crc));
    return
  }
})

router.post("/webhook/twitter", async (req, res) => {
  // process incoming messages
  if (
    req.body.direct_message_events &&
    req.body.direct_message_events[0].type == "message_create"
  ) {
    const message_event = req.body.direct_message_events[0].message_create;
    const { sender_id, message_data } = message_event;

    console.log({ message_data });

    // accept valid sender
    if (sender_id == process.env.VALID_SENDER_ID) {
      // extract bookmark info from DM
      const bookmark = {
        text: formatText(message_data.text),
        hashtags: message_data.entities.hashtags
          .filter((h) => h != null)
          .map((h) => h.text),
        url:
          message_data.entities.urls.length > 0
            ? message_data.entities.urls[0].expanded_url
            : "",
      };

      // check for delete command
      const words = bookmark.text.split(" ")
      if (words.length > 0 && words[0] == "D") {
        const request = {
          body: {
            url: bookmark.url,
          },
        };

        const response = await bookmarks.delete(request, res, await getDb());
        console.log(response);
        res.status(200);
        res.send(response);
        return
      }

      // create bookmark
      const request = {
        body: {
          url: bookmark.url,
          dm: bookmark,
        },
      };

      const response = await bookmarks.create(request, res, await getDb());
      console.log(response)
      // send success response to twitter
      res.status(200);
      res.send(response);
    } else {
      res.status(200);
      res.send({ message: `invalid sender: ${sender_id}`});
    }
  }

});

module.exports = app;
