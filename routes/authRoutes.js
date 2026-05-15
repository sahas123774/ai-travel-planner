const express =
require('express');

const router =
express.Router();

const authController =
require('../controllers/authController');


// SIGNUP
router.get(
   '/signup',
   authController.getSignup
);

router.post(
   '/signup',
   authController.postSignup
);


// LOGIN
router.get(
   '/login',
   authController.getLogin
);

router.post(
   '/login',
   authController.postLogin
);


// LOGOUT
router.post(
   '/logout',
   authController.postLogout
);


module.exports =
router;