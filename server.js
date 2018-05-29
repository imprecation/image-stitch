const express = require('express');
const multer  = require('multer');
const mergeImg = require('merge-img');

const app = express();

// Uses memory storage instead of using disk based storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('dist'));

app.listen(8080, () => {
  console.info('Server running at localhost:8080');
})

app.post('/image/stitch', upload.array('images', 4), (req, res) => {
  const images = req.files.map(image => image.buffer);
  
  mergeImg(images)
    .then((stitchedImage) => {
      stitchedImage.getBase64('image/png', (err, image) => {
        res.send(image);
      })
    })
    .catch(err => {
      res.status(500).send(err.message);
    })
});

module.exports =  app;
