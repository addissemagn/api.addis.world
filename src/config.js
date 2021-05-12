const PROD = process.env.PROD === "true";

module.exports = {
  twitter_config: {
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    env: process.env.TWITTER_WEBHOOK_ENV,
  },
  db_config: {
    USERNAME: PROD ? process.env.PROD_DB_USERNAME : process.env.DEV_DB_USERNAME,
    PASS: PROD ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS,
    CONNECTION_NAME: PROD
      ? process.env.PROD_DB_CONNECTION_NAME
      : process.env.DEV_DB_CONNECTION_NAME,
    CLUSTER: PROD ? process.env.PROD_DB_CLUSTER : process.env.DEV_DB_CLUSTER,
    NAME: PROD ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
  },
};
