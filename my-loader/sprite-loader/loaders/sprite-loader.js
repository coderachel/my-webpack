const path = require("path");
const fs = require("fs");
const SpriteSmith = require("spritesmith");

module.exports = function (source) {
  console.log(this.constructor, this);
  const callback = this.async();
  const imgs = source.match(/url\((\S*)\?__sprite/g);

  const matchedImgs = [];
  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/url\((\S*)\?__sprite/)[1];
    matchedImgs.push(path.join(__dirname, img));
  }

  SpriteSmith.run(
    {
      src: matchedImgs,
    },
    (err, result) => {
      fs.writeFileSync(
        path.join(process.cwd(), "dist/sprite.jpg"),
        result.image
      );
      source = source.replace(/url\((\S*)\?__sprite/g, (match) => {
        return `url("dist/sprite.jpg"`;
      });

      fs.writeFileSync(path.join(process.cwd(), "dist/index.css"), source);
      callback(null, source);
    }
  );
};