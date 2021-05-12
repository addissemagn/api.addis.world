# api.addis.world
where the optimizations my heart desires will live.

currently has a bookmarking system (aka Twitter bot 🤖) that uses:
- [twitter API](https://developer.twitter.com/en/docs) for incoming direct message activity via a webhook
- [cheerio](https://www.npmjs.com/package/cheerio) for extracing metadata from urls
- [mongoDB](https://www.mongodb.com) as the good ol reliable database
- [express.js](https://expressjs.com) for the restful api
- [vercel](vercel.com) for hosting
- [flogtail](https://www.flogtail.com) for log monitoring

---

---

running locally:
```
git clone git@github.com:addissemagn/api.addis.world.git && cd api.addis.world
yarn
yarn start
```

simply serving up a local twitter webhook, first follow [this guide](https://github.com/twitterdev/autohook) for `twitter-autohook` then run:
```
node src/controllers/twitter.js
```

deploying:
```
vercel          # deploy to preview
vercel --prod   # to prod
```

*full on setup comin soon*