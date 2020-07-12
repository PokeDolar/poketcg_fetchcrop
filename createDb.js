const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const pokemon = require("pokemontcgsdk");
const sleep = require("util").promisify(setTimeout);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TcgImageSchema = new Schema({
  imageUrlHiRes: { type: "String", required: true },
  number: { type: "String", required: true },
  id: { type: "String", required: true },
  name: { type: "String", required: true },
  artist: { type: "String", required: true },
  subtype: { type: "String", required: true },
  ancientTrait: { type: Boolean, required: false}
});

let PokeTcg = mongoose.model("PokeTCG", TcgImageSchema);

let files = Fs.readdirSync(__dirname + "/cards");
let jsons = [];
for (file of files) {
  jsons.push(require(`./cards/${file}`));
}

mongoose.connect("mongodb://localhost:27017/pokemontcgimages");

async function downloadImage(url, filename) {
  const path = Path.resolve(__dirname, `arts/`, `${filename}.png`);
  const writer = Fs.createWriteStream(path);
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

(async () => {
  let queue = [];
  let validTypes = ["Stage 2", "Stage 1", "Basic"];
  let validSets = [
    "bwp",
    "bw1",
    "bw2",
    "bw3",
    "bw4",
    "bw5",
    "bw6",
    "dv1",
    "bw7",
    "bw8",
    "bw9",
    "bw10",
    "xyp",
    "bw11",
    "xy0",
    "xy1",
    "xy2",
    "xy3",
    "xy4",
    "xy5",
    "dc1",
    "xy6",
    "xy7",
    "xy8",
    "xy9",
    "g1",
    "xy10",
    "xy11",
    "xy12",
    "sm1",
    "smp",
    "sm2",
    "sm3",
    "sm35",
    "sm4",
    "sm5",
    "sm6",
    "sm7",
    "sm75",
    "sm8",
    "sm9",
    "det1",
    "sm10",
    "sm11",
    "sma",
    "sm115",
    "sm12",
    "swsh1",
    "swsh2",
  ];

  for (cardlist of jsons) {
    for (card of cardlist) {
      //await downloadImage(`${card.name}-${card.cardid}-${card.artist}`);
      //console.log(`downloaded ${card.cardid}`);
      if (
        validTypes.includes(card.subtype) && validSets.includes(card.setCode)
      ) {
        try {
          let alreadyExits = await PokeTcg.findOne({id: card.id})

          if (!alreadyExits){
            let newPokemon = new PokeTcg(card);
            await newPokemon.save();
          }
          else{
            if (card.ancientTrait){
              alreadyExits.ancientTrait = true;

            console.log(alreadyExits);
              alreadyExits.save();
            }
          }
        } catch (e) {
          console.log(e);
          console.log("Could not save");
        }
      }
    }
  }
})().catch((e) => console.log(e));
