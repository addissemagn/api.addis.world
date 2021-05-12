"use strict";

const app = require("./src/server");
const { twitter_config } = require("./src/config")
const { Autohook } = require("twitter-autohook");

require("dotenv").config();

app.listen(5000, async () => {
  try {
    // register twitter webhook
    const webhookUrl = process.env.TWITTER_WEBHOOK_URL;
    const webhook = new Autohook(twitter_config);
    await webhook.removeWebhooks();
    await webhook.start(webhookUrl);
    await webhook.subscribe({
      oauth_token: twitter_config.token,
      oauth_token_secret: twitter_config.token_secret,
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Local app listening on port 5000!");
});
