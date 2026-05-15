const generateTrip =
require(
  '../services/aiService'
);

const Trip =
require('../models/trip');


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
      const trip =
new Trip(

   req.session.user._id,

   destination,

   days,

   budget,

   tripPlan

);

await trip.save();

    // RESULT PAGE
    // SPLIT DAYS
const dayPlans =
tripPlan.split(/Day \d+:/)
.filter(plan => plan.trim() !== '');


    res.render(
      'trip-result',
    {
       pagetitle:
       'Trip Result',

       destination,

      tripPlan,

      dayPlans
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