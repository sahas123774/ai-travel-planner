const Review = require("../models/review");

exports.postReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    await new Review(
      req.session.user._id,
      req.session.user.name,
      rating,
      comment
    ).save();

    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
};