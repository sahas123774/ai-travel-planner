const { ObjectId } = require("mongodb");
const getDb = require("../utils/database").getDb;

class Review {
  constructor(userId, username, rating, comment) {
    this.userId = new ObjectId(userId);
    this.username = username;
    this.rating = Number(rating);
    this.comment = comment;
    this.createdAt = new Date();
  }

  save() {
    return getDb().collection("reviews").insertOne(this);
  }

  static fetchAll() {
    return getDb()
      .collection("reviews")
      .find()
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();
  }

  static async getStats() {
    const reviews = await getDb()
      .collection("reviews")
      .find()
      .toArray();

    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
      };
    }

    const average =
      reviews.reduce((a, b) => a + b.rating, 0) /
      reviews.length;

    return {
      average: average.toFixed(1),
      total: reviews.length,
    };
  }
}

module.exports = Review;