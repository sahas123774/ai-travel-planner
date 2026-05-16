const generateTrip =
require(
  '../services/aiService'
);
const PDFDocument =
require('pdfkit');

const Trip =
require('../models/trip');

const axios = require('axios');


// HOME PAGE
exports.getHome =
(req, res) => {

  res.render(
    'index',
    {
      pagetitle:
        'AI Travel Planner'
    }
  );

};

//welcome page
exports.getwelcome =
(req,res) =>{
  res.render(
    'welcome',
    {
      pagetitle:
      'welcome to AI Travel Planner'
    }
  );
};


// GENERATE TRIP
// GENERATE TRIP
exports.postGenerateTrip =
async (req, res) => {

  try {

    const destination =
      req.body.destination;

    const days =
      req.body.days;

    const budget =
      req.body.budget;

    // AI CALL
    const tripPlan =
      await generateTrip(

        destination,

        days,

        budget

      );

    // SAVE TRIP
    const trip =
      new Trip(

        req.session.user._id,

        destination,

        days,

        budget,

        tripPlan

      );

    await trip.save();

    // DYNAMIC IMAGE
    let imageUrl =
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop';

    try {

      const response =
        await axios.get(

          `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${destination}+travel&image_type=photo&category=travel`
        );

      if (response.data.hits.length > 0) {

        imageUrl =
          response.data.hits[0].webformatURL;

      }

    }

    catch (err) {

      console.log(
        'Image fetch error:',
        err.message
      );

    }

    // SPLIT DAYS
    const dayPlans =
      tripPlan
      .split(/Day \d+:/)
      .filter(
        plan => plan.trim() !== ''
      );

    // RESULT PAGE
    res.render(
      'trip-result',
      {

        pagetitle:
          'Trip Result',

        destination,

        tripPlan,

        dayPlans,

        imageUrl

      }
    );

  }

  catch (err) {

    console.log(err);

    res.send(
      'Something went wrong'
    );

  }

};

exports.getHistory =
async (req, res) => {

   try {

      const trips =
        await Trip.fetchByUser(

           req.session.user._id

        );

      res.render(
         'history',
         {
            pagetitle:
            'Trip History',

            trips
         }
      );

   }

   catch (err) {

      console.log(err);

      res.send(
         'Error loading history'
      );

   }

};

// DOWNLOAD PDF
exports.downloadTripPdf =
async (req, res) => {

   try {

      const tripId =
      req.params.tripId;

      const trips =
      await Trip.fetchByUser(
         req.session.user._id
      );

      const trip =
      trips.find(
         t => t._id.toString() === tripId
      );

      if (!trip) {

         return res.send(
            'Trip not found'
         );

      }

      // CREATE PDF
      const doc =
      new PDFDocument();

      // RESPONSE HEADERS
      res.setHeader(
         'Content-Type',
         'application/pdf'
      );

      res.setHeader(
         'Content-Disposition',
         `attachment; filename=${trip.destination}-trip.pdf`
      );

      // PIPE PDF
      doc.pipe(res);

      // TITLE
      doc
      .fontSize(28)
      .text(
         'AI Travel Planner',
         {
            align: 'center'
         }
      );

      doc.moveDown();

      // DESTINATION
      doc
      .fontSize(22)
      .text(
         `Destination: ${trip.destination}`
      );

      doc.moveDown();

      // DETAILS
      doc
      .fontSize(16)
      .text(
         `Days: ${trip.days}`
      );

      doc.text(
         `Budget: ₹${trip.budget}`
      );

      doc.moveDown();

      // ITINERARY
      doc
      .fontSize(18)
      .text(
         'Trip Itinerary'
      );

      doc.moveDown();

      doc
      .fontSize(14)
      .text(
         trip.tripPlan,
         {
            align: 'left'
         }
      );

      doc.moveDown();

      // FOOTER
      doc
      .fontSize(12)
      .text(
         'Generated using AI Travel Planner',
         {
            align: 'center'
         }
      );

      // END PDF
      doc.end();

   }

   catch (err) {

      console.log(err);

      res.send(
         'Error generating PDF'
      );

   }

};

// AI CHAT
exports.postChat =
async (req, res) => {

   try {

      const message =
      req.body.message;

      const reply =
      await generateTrip(
         message,
         1,
         'medium'
      );

      res.json({
         reply
      });

   }

   catch (err) {

      console.log(err);

      res.status(500).json({
         reply:
         'AI Error'
      });

   }

};