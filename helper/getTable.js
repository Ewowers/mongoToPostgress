const { MongoClient, SpeCollection } = require("mongodb");
const config = require("config");
var url = "mongodb://localhost:27017/";
const client = new MongoClient(url, { useUnifiedTopology: true }); // { useUnifiedTopology: true } removes connection warnings;

let get = async () => {
  let promise = client.connect().then(
    (client) => client.db(config.get("mongoDataBase")).listCollections().toArray() // Returns a promise that will resolve to the list of the collections
  );
  let a = await promise.then((cols) => {
    return cols.map((item) => item.name);
  });

  promise.finally(() => {
    client.close();
  });
  console.log(a);
  return a;
};

module.exports = get;
