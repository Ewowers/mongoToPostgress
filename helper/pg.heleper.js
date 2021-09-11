const { Sequelize, DataTypes } = require("sequelize");
let pgURL = "mongoToPostgres"; //база postgress
const sequelize = new Sequelize(pgURL, "postgres", "root", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

const start = async (name, array) => {
  let obj = array[0];
  let keys = new Map();
  let str = 'new ObjectId("613be70cc1f244edea0e8846")';

  const getType = (i) => {
    let type;
    if (typeof i === "string") return DataTypes.STRING;
    if (typeof i === "number") return DataTypes.INTEGER;
    if (typeof i === "boolean") return DataTypes.BOOLEAN;

    return type;
  };
  for (let key in obj) {
    if (key === "_id") {
      let str = toString(obj[key]);
      let str2 = str.substr(14);
      let str3 = str2.substr(0, str2.length - 2);
      keys.set("_id", DataTypes.STRING);
    } else {
      keys.set(key, getType(obj[key]));
    }
  }
  const Model = sequelize.define(
    name,
    {
      ...Object.fromEntries(keys),
    },
    {
      sequelize,
    }
  );
  await Model.sync();
  array.forEach(async (item, i) => {
    item._id = i;
    await Model.create({ ...item });
  });
};

module.exports = start;
