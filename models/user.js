const getDb =
require('../utils/database')
.getDb;


class User {

   constructor(
      username,
      email,
      password
   ) {

      this.username = username;
      this.email = email;
      this.password = password;

   }


   // SAVE USER
   async save() {

      const db = getDb();

      return db
      .collection('users')
      .insertOne(this);

   }


   // FIND USER
   static async findByEmail(email) {

      const db = getDb();

      return db
      .collection('users')
      .findOne({
         email: email
      });

   }

}


module.exports = User;