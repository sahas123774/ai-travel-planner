const bcrypt =
require('bcryptjs');

const User =
require('../models/user');


// SIGNUP PAGE
exports.getSignup =
(req, res) => {

   res.render(
      'signup',
      {
         pagetitle: 'Signup'
      }
   );

};


// LOGIN PAGE
exports.getLogin =
(req, res) => {

   res.render(
      'login',
      {
         pagetitle: 'Login'
      }
   );

};


// SIGNUP
exports.postSignup =
async (req, res) => {

   try {

      const username =
      req.body.username;

      const email =
      req.body.email;

      const password =
      req.body.password;

      // CHECK EXISTING USER
      const existingUser =
      await User.findByEmail(email);

      if (existingUser) {

         return res.send(
            'User already exists'
         );

      }

      // HASH PASSWORD
      const hashedPassword =
      await bcrypt.hash(
         password,
         12
      );

      // CREATE USER
      const user =
      new User(
         username,
         email,
         hashedPassword
      );

      await user.save();

      res.redirect('/login');

   }

   catch (err) {

      console.log(err);

   }

};


// LOGIN
exports.postLogin =
async (req, res) => {

   try {

      const email =
      req.body.email;

      const password =
      req.body.password;

      // FIND USER
      const user =
      await User.findByEmail(email);

      if (!user) {

         return res.send(
            'Invalid Email'
         );

      }

      // CHECK PASSWORD
      const isMatch =
      await bcrypt.compare(
         password,
         user.password
      );

      if (!isMatch) {

         return res.send(
            'Invalid Password'
         );

      }

      // SESSION
      req.session.isLoggedIn = true;

      req.session.user = user;

      res.redirect('/welcome');

   }

   catch (err) {

      console.log(err);

   }

};


// LOGOUT
exports.postLogout =
(req, res) => {

   req.session.destroy(() => {

      res.redirect('/');

   });

};