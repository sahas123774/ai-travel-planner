const express =
require('express');

const triprouter =
express.Router();

const tripController =
require(
  '../controllers/tripController.js'
);

const isAuth =
require('../middleware/isAuth');


// HOME
triprouter.get(
  '/',
  tripController.getHome
);

triprouter.get(
  '/welcome',
  isAuth,
  tripController.getwelcome
)

triprouter.get(
   '/history',
   isAuth,
   tripController.getHistory
);


// GENERATE TRIP
triprouter.post(
  '/generate-trip',
  isAuth,
  tripController.postGenerateTrip
);


module.exports =
triprouter;