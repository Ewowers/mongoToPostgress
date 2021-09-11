const express = require("express");
const mongoose = require("mongoose");
const arr = require("./helper/getTable");
const pg = require("./helper/pg.heleper");
const { Sequelize } = require("sequelize");

const getCollection = async (schemaName) => {
  let Schema = new mongoose.Schema();
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
  let items = null;
  ar.forEach(async (item) => {
    let elem = await getCollection(item);
    pg(elem.name, elem.collection);
  });
  let url = "test"; //копируемая база монго
  await mongoose.connect("mongodb://127.0.0.1:27017/" + url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

start();
