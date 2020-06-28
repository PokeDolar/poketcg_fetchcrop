const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const pokemon = require("pokemontcgsdk");
const sleep = require("util").promisify(setTimeout);
const mongoose = require("mongoose");
const sharp = require("sharp");
const Schema = mongoose.Schema;

const TcgImageSchema = new Schema({
  imageUrlHiRes: { type: "String", required: true },
  number: { type: "String", required: true },
  id: { type: "String", required: true },
  name: { type: "String", required: true },
  artist: { type: "String", required: true },
  subtype: { type: "String", required: true },
  filePath: { type: "String", required: true },
  setCode: { type: "String", required: true },
  cropped: { type: "Boolean" },
});

let PokeTcg = mongoose.model("PokeTCG", TcgImageSchema);

mongoose.connect("mongodb://localhost:27017/pokemontcgimages");

(async () => {
  // let setCodes = await PokeTcg.collection.distinct("setCode");
  // let basicPokemons = [];
  // for (setCode of setCodes) {
  //   let basicPokemon = await PokeTcg.findOne({
  //     setCode: setCode,
  //     subtype: "Basic",
  //   });
  //   basicPokemons.push(basicPokemon);
  // }
  let basicPokemons = await PokeTcg.find({ cropped: { $in: [null, false] } });

  //console.log(basicPokemons[0])
  let total = basicPokemons.length;
  let error = 0;
  let errors = [];
  let counter = 0;
  for (let index = 0; index < basicPokemons.length; index++) {
    let img = await sharp(`./${basicPokemons[index].filePath}.png`);

    let set = basicPokemons[index].setCode;

    params = {
      width: 605,
      height: 399,
      left: 47,
      top: 91,
    };
    if (
      ["sm1", "sm2", "sm3", "sm4", "sm5", "sm6", "sm7", "sm35", "smp"].includes(
        set
      )
    ) {
      params.left = 42;
      params.top = 83;
      params.height = 465 - params.top + 1;
      params.width = 657 - params.left + 1;
    }
    if (["bw5"].includes(set)) {
      params.left = 52;
      params.top = 99;
      params.height = 471 - params.top - 1;
      params.width = 652 - params.left;
    }
    if (["bw4"].includes(set)) {
      params.left = 52;
      params.top = 99;
      params.height = 471 - params.top;
      params.width = 652 - params.left;
    }
    if (["sm8", "sm9", "sm11"].includes(set)) {
      params.left = 52;
      params.top = 99;
      params.height = 471 - params.top + 1;
      params.width = 652 - params.left + 1;
    }
    if (
      ["sm10", "sm11", "sm12", "sm115", "sma", "swsh1", "swsh2"].includes(set)
    ) {
      params.left = 58;
      params.top = 100;
      params.height = 481 - params.top + 1;
      params.width = 673 - params.left + 1;
    }
    if (["sm75"].includes(set)) {
      params.left = 52;
      params.top = 99;
      params.height = 470 - params.top + 1;
      params.width = 652 - params.left + 1;
    }
    if (["xy12"].includes(set)) {
      params.left = 66;
      params.top = 128;
      params.height = 522 - params.top + 1;
      params.width = 629 - params.left + 1;
    }

    try {
      let croppedImg = await img
        .extract(params)
        .toFile(`./croparts/${basicPokemons[index].filePath}.png`);
      counter++;
      basicPokemons[index].cropped = true;

      console.log(`${counter}/${total}`);
    } catch (e) {
      error++;
      basicPokemons[index].cropped = false;

      console.log(e);
      errors.push(basicPokemons[index]);
    }
    basicPokemons[index].save();
    console.log(errors);
  }

  console.log("Acabou");
})().catch((e) => console.log(e));
