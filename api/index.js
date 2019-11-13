const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res) => {
  const { name = "World" } = req.query;
  //res.send(`Hello ${name}!`);
  const path = "../img/Bristol_Cathedral_Lady_Chapel_Bristol_UK_-_Diliff.jpg";
  let transform = sharp(path)
    .rotate()
    .resize(1024, 840)
    .toBuffer()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.send("error:", err);
    });
  //   let transform = sharp()
  //     .toFormat("jpg")
  //     .resize(1024, 860);
  //res.send(readStream.pipe(transform));
  //return readStream.pipe(transform);
};
