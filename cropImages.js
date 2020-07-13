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
  ancientTrait: { type: Boolean, required: false},
  ability: { type: Boolean, required: true}
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
  let basicPokemons = await PokeTcg.find();

  //console.log(basicPokemons[0])
  let total = basicPokemons.length;
  let error = 0;
  let errors = [];
  let counter = 0;
  let crop=false;

  for (let index = 0; index < basicPokemons.length; index++) {
    let img = sharp(`./${basicPokemons[index].filePath}.png`);
    crop = false;
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
    if(["det1"].includes(set)){
      params.left = 58
      params.top = 101
      params.width = 484 - params.top + 1
      params.width = 675 - params.left + 1
    }
    if(["xyp"].includes(set)){
      crop = true;
    }
    if (["sm6-2a.png", "smp-SM30a", "smp-SM61", "smp-SM92", "smp-SM103", "smp-SM103a", "smp-SM104",
    "smp-SM104a", "smp-SM108", "smp-SM110", "smp-SM111", "smp-SM112", "smp-SM113",
    "smp-SM114", "smp-SM129","smp-SM130","smp-SM132","smp-SM137",    "smp-SM138",
    "smp-SM139",    "smp-SM140",    "smp-SM141",    "smp-SM142",    "smp-SM143",
    "smp-SM145",    "smp-SM149",    "smp-SM150",    "smp-SM151",    "smp-SM152",
    "smp-SM153",    "smp-SM154",    "smp-SM157",    "smp-SM158",    "smp-SM159",
    "smp-SM160",    "smp-SM161",    "smp-SM162",    "smp-SM163", "smp-SM164",
    "smp-SM165","smp-SM177",].includes(basicPokemons[index].id)){
      crop = false;
      params.left = 61
      params.top = 100
      params.width = 474 - params.top + 1
      params.width = 675 - params.left + 1
    }
     if(['xyp-XY49', 'xyp-XY57', 'xyp-XY58', 'xyp-XY59', 'xyp-XY92', 'xyp-XY93'].includes(basicPokemons[index].id)){
       params.left = 15;
       params.top = 155;
       params.width = 700 - (params.left * 2) - 1;
       params.height = 566 - params.top;
       crop = true;
       console.log(basicPokemons[index].id);
    
    }
    if (['xyp-XY67a', 'xyp-XY74', 'xyp-XY75', 'xyp-XY76', 'xyp-XY77', 'xyp-XY78',
    'xyp-XY79', 'xyp-XY80', 'xyp-XY81', 'xyp-XY82', 'xyp-XY83', 'xyp-XY110',
    'xyp-XY111', 'xyp-XY112', 'xyp-XY113', 'xyp-XY114', 'xyp-XY112', 'xyp-XY115',
    'xyp-XY116', 'xyp-XY117', 'xyp-XY118', 'xyp-XY119', 'xyp-XY120', 'xyp-XY185',
    'xyp-XY186'].includes(basicPokemons[index].id)){
      params.left = 15;
      params.top = 95;
      params.width = 700 - (params.left * 2) - 1;
      params.height = 546 - params.top;
      crop = true;
      console.log(basicPokemons[index].id);
    }
    if(crop){
      try {
        let croppedImg = await img
          .extract(params)
          .toFile(`./croparts/${basicPokemons[index].filePath}.png`);
        counter++;
        basicPokemons[index].cropped = true;
        console.log(`${counter}/${total}`);
        basicPokemons[index].save();
      } catch (e) {
        error++;
        basicPokemons[index].cropped = false;
  
        console.log(e);
        errors.push(basicPokemons[index]);
      }
      }
    }
    

  console.log("Acabou");
  console.log(errors);
})().catch((e) => console.log(e));
