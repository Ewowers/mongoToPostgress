const { MongoClient, SpeCollection } = require("mongodb");
var url = "mongodb://localhost:27017/";
const client = new MongoClient(url, { useUnifiedTopology: true }); // { useUnifiedTopology: true } removes connection warnings;

const dbName = "schema2";
let get = async () => {
  let arrClaster;
  let promise = client.connect().then(
    (client) => client.db(dbName).listCollections().toArray() // Returns a promise that will resolve to the list of the collections
  );
  let a = await promise.then((cols) => {
    //cols.forEach((item) => arrClaster.push(item.name));
    return cols.map((item) => item.name);
  });

  promise.finally(() => {
    client.close();
  });
  return a;
};

module.exports = get;
