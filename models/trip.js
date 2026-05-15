const mongodb =
require('mongodb');

const getDb =
require('../utils/database')
.getDb;


class Trip {

   constructor(

      userId,

      destination,

      days,

      budget,

      tripPlan

   ) {

      this.userId =
      new mongodb.ObjectId(
         userId
      );

      this.destination =
      destination;

      this.days =
      days;

      this.budget =
      budget;

      this.tripPlan =
      tripPlan;

      this.createdAt =
      new Date();

   }


   // SAVE TRIP
   async save() {

      const db =
      getDb();

      return db
      .collection('trips')
      .insertOne(this);

   }


   // FETCH USER TRIPS
   static async fetchByUser(
      userId
   ) {

      const db =
      getDb();

      return db
      .collection('trips')
      .find({

         userId:
         new mongodb.ObjectId(
            userId
         )

      })
      .sort({

         createdAt: -1

      })
      .toArray();

   }

}


module.exports =
Trip;