const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const pokemon = require("pokemontcgsdk");
const sleep = require("util").promisify(setTimeout);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TcgImageSchema = new Schema({
  imageUrlHiRes: { type: "String", required: true },
  nationalPokedexNumber: { type: "String", required: true },
  id: { type: "String", required: true },
  name: { type: "String", required: true },
  artist: { type: "String", required: true },
  subtype: { type: "String", required: true },
  setCode: { type: 'String', required: true},
  ability: { type: Boolean, required: true}
});

let PokeTcg = mongoose.model("PokeTCG", TcgImageSchema);

let files = Fs.readdirSync(__dirname + "/cards");
let jsons = [];
for (file of files) {
  jsons.push(require(`./cards/${file}`));
}

mongoose.connect("mongodb://localhost:27017/pokemontcgimages");

(async () => {
  let counter = 0
  for (cardlist of jsons) {
    for (card of cardlist) {
      //await downloadImage(`${card.name}-${card.cardid}-${card.artist}`);
      //console.log(`downloaded ${card.cardid}`);
      try{
        let cardObj = await PokeTcg.findOne({id: card.id})
        if (cardObj){
          // cardObj.nationalPokedexNumber = card.nationalPokedexNumber;
          // cardObj.setCode = card.setCode;
          cardObj.ability = card.ability ? true : false;
          cardObj.save()
          console.log(++counter);
        }
      }
      catch (e){
        console.log(e);
      }

    }
  }
})().catch((e) => console.log(e));
