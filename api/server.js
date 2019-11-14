var express = require("express");
var app = express();
var multer = require("multer");
var cors = require("cors");
var Jimp = require("jimp");
var path = require("path");
var PORT = process.env.PORT || 3001;

app.use(cors());

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var upload = multer({ storage: storage }).single("file");

app.get("/:name/download", function(req, res) {
  const file = `${__dirname}/public/` + req.params.name;
  res.download(file);
});

app.post("/upload", async function(req, res) {
  let path = null;
  await upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    file = req.file.filename;
    await Jimp.read("public/" + file)
      .then(
        async tpl => await Jimp.loadFont("impact.fnt").then(font => [tpl, font])
      )
      .then(data => {
        tpl = data[0];
        font = data[1];
        tpl.contain(800, 800);
        var w = tpl.bitmap.width;
        var h = tpl.bitmap.height;

        tpl.print(
          font,
          0,
          0,
          {
            text: req.body.topText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP
          },
          w,
          h
        );

        tpl.print(
          font,
          0,
          0,
          {
            text: req.body.bottomText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
          },
          w,
          h
        );
        return tpl;
      })

      .then(tpl => tpl.quality(100).write("public/" + file));
    return res.status(200).json({ path: file });
  });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + 'build/index.html'))
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
