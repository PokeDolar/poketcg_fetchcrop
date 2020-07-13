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
  filePath: { type: "String", required: true}
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
  let basicPokemons = await PokeTcg.find();
  //console.log(basicPokemons[0])
  let counter = 0
  for (let index = 0; index < basicPokemons.length; index++){
  
    if(!basicPokemons[index].filePath){
      try{
        await downloadImage(basicPokemons[index].imageUrlHiRes, basicPokemons[index].id);
        basicPokemons[index].filePath = `arts/${basicPokemons[index].id}`
        basicPokemons[index].save()
        console.log(`Baixou ${++counter}` );
      }
      catch(e){

        console.log("Erro baixando ");
        console.log(basicPokemons[index]);
        basicPokemons[index].remove()
      }
      
    }
    
  }
  console.log("Acabou");
})()