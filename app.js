const mongoose = require("mongoose");
const arr = require("./helper/getTable");
const pg = require("./helper/pg.heleper");
const config = require("config");
const getCollection = async (schemaName) => {
  let Schema = new mongoose.Schema({});
  let schema = mongoose.model(schemaName, Schema);
  let collection = await schema.find();
  let array = [];
  collection.forEach((item) => {
    for (let key in item) {
      if (key !== "_doc") continue;
      array.push(item[key]);
    }
  });
  return {
    name: schemaName,
    collection: array,
  };
};

const start = async () => {
  let ar = await arr();
  ar.forEach(async (item) => {
    let elem = await getCollection(item);
    pg(elem.name, elem.collection);
  });
  await mongoose.connect(config.get("mongo") + config.get("mongoDataBase"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

start();
