const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res) => {
  const { name = "World" } = req.query;
  //res.send(`Hello ${name}!`);
  const path = "../img/Bristol_Cathedral_Lady_Chapel_Bristol_UK_-_Diliff.jpg";
  const readStream = fs.createReadStream(path);
  let transform = sharp()
    .toFormat("jpg")
    .resize(1024, 860);
  res.send(readStream.pipe(transform));
  //return readStream.pipe(transform);
};
