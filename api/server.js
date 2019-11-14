var express = require("express");
var app = express();
var multer = require("multer");
var cors = require("cors");
var Jimp = require("jimp");
var PORT = 3001;

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
  const file = `${__dirname}/upload-folder/` + req.body.name;
  res.download(file);
});

app.post("/upload", async function(req, res) {
  let path = null;
  await upload(req, res, async function(err) {
    console.log(req);
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    file = req.file.filename;
    Jimp.read("public/" + file, async (err, lenna) => {
      if (err) throw err;
      await lenna
        .quality(100) // set JPEG quality
        .greyscale() // set greyscale
        .write("public/"+file); // save
      let message = 'Hello!'
      let x = 10
      let y = 10
      Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
        .then(font => {
          lenna.print(font, x, y, message);
          return lenna;
        })
        .then(lenna => {
          let file = `meme.${lenna.getExtension()}`;
          return lenna.write(file); // save
        });
    });
    return res.status(200).json({ message: file });
  });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
