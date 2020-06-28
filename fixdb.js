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
  setCode: { type: 'String', required: true}
});

let PokeTcg = mongoose.model("PokeTCG", TcgImageSchema);
mongoose.connect("mongodb://localhost:27017/pokemontcgimages");

(async () => {
  let objs = await PokeTcg.find();
  for (obj of objs){
    if (!obj.nationalPokedexNumber || !obj.setCode){
      obj.remove();
      console.log("removeu");
    }
  }
  console.log("Acabou")
})().catch((e) => console.log(e));
