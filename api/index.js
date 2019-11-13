const sharp = require("sharp");
const fs = require("fs");

module.exports = (req, res) => {
  const { name = "World" } = req.query;
  //res.send(`Hello ${name}!`);
  const path = "../img/Bristol_Cathedral_Lady_Chapel_Bristol_UK_-_Diliff.jpg";
  sharp(path)
    .rotate()
    .resize(1024, 840)
    .toBuffer()
    .then(data => {
      fs.writeFileSync("../img/yellow.png", data);
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      // stream the file
      fs.createReadStream(filePath, "utf-8").pipe(res);
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
