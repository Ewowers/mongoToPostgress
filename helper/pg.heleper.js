const { Sequelize, DataTypes } = require("sequelize");
const config = require("config");
const sequelize = new Sequelize(config.get("postgresDatabase"), config.get("postgresName"), config.get("postgresPassword"), {
  host: config.get("postgresHost"),
  port: config.get("postgresPort"),
  dialect: "postgres",
  logging: false,
});

const start = async (name, array) => {
  let obj = array[0];
  let keys = new Map();
  const getType = (i) => {
    if (typeof i === "string") return DataTypes.TEXT;
    if (typeof i === "number") return DataTypes.INTEGER;
    if (typeof i === "boolean") return DataTypes.BOOLEAN;
    if (i instanceof Date) return DataTypes.DATE;
    if (Array.isArray(i)) return DataTypes.ARRAY;
    return DataTypes.TEXT;
  };
  for (let key in obj) {
    if (key === "_id") {
      keys.set("_id", DataTypes.STRING);
    } else {
      keys.set(key, getType(obj[key]));
    }
  }
  const Model = sequelize.define(
    name,
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ...Object.fromEntries(keys),
    },
    {
      sequelize,
    }
  );
  await Model.sync();
  array.forEach(async (item, i) => {
    let _id = `${item._id}`;
    item._id = _id;
    let candidate = await Model.findOne({ where: { _id: _id } });
    if (!candidate) await Model.create({ ...item });
  });
  console.log("end");
};

module.exports = start;
