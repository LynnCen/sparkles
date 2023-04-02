const sm = require("sitemap");

const sitemap = sm.createSitemap({
  hostname: "https://www.foxth.com",
  cacheTime: 600000 // 600 sec - cache purge period
});

const xmlArr = [
  {
    url: "/",
    changefreq: "daily",
    priority: 1
  }
];
xmlArr.forEach(itm => {
  sitemap.add(itm)
})

const setup = ({ server }) => {
  server.get("/sitemap.xml", (req, res) => {
    sitemap.toXML((err, xml) => {
      if (err) {
        res.status(500).end();
        return;
      }

      res.header("Content-Type", "application/xml");
      res.send(xml);
    });
  });
};

module.exports = setup;
