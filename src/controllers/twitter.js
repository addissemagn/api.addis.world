const { Autohook } = require("twitter-autohook");
const { formatText } = require("../utils");
const { twitter_config } = require("../config")

const startTwitterWebhook = async () => {
  try {
    const webhook = new Autohook(twitter_config);

    // removes existing webhooks
    await webhook.removeWebhooks();

    // listens to incoming activity
    webhook.on("event", async (event) => {
      if (
        event.direct_message_events &&
        event.direct_message_events[0].type == "message_create"
      ) {
        const message_event = event.direct_message_events[0].message_create;
        console.log(message_event);
        const { sender_id, message_data } = message_event;

        if (sender_id == process.env.VALID_SENDER_ID) {
          const bookmark = {
            text: formatText(message_data.text),
            hashtags: message_data.entities.hashtags.map(
              (hashtag) => hashtag.text
            ),
            url:
              message_data.entities.urls.length > 0
                ? message_data.entities.urls[0].expanded_url
                : "",
          };

          console.log(bookmark);
        } else {
          console.log(`invalid sender: ${sender_id}`);
        }
      }
    });

    // starts a server and adds a new webhook
    await webhook.start();

    // subscribes to a user's activity
    await webhook.subscribe({
      oauth_token: twitter_config.token,
      oauth_token_secret: twitter_config.token_secret,
    });
  } catch (err) {
    console.log(err);
  }
};

startTwitterWebhook();
