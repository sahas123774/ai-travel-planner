const mongodb =
require('mongodb');

const MongoClient =
mongodb.MongoClient;

let database;


// CONNECT TO MONGODB
async function mongoConnect() {

   const client =
   await MongoClient.connect(

      process.env.MONGODB_URL

   );

   database =
   client.db();

   console.log(
      'MongoDB Connected'
   );

}


// GET DATABASE
function getDb() {

   if (!database) {

      throw new Error(
         'Database not connected'
      );

   }

   return database;

}


module.exports = {

   mongoConnect,

   getDb

};