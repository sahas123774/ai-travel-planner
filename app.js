require('dotenv').config();

const express =
require('express');

const path =
require('path');

const session =
require('express-session');

const mongoConnect =
require('./utils/database')
.mongoConnect;


// ROUTES
const tripRoutes =
require('./routes/tripRoutes');

const authRoutes =
require('./routes/authRoutes');


const app =
express();


// VIEW ENGINE
app.set(
   'view engine',
   'ejs'
);

app.set(
   'views',
   'views'
);


// MIDDLEWARE
app.use(
   express.urlencoded({
      extended: true
   })
);

app.use(
   express.static(
      path.join(
         __dirname,
         'public'
      )
   )
);


// SESSION
app.use(
   session({

      secret:
      'mysecretkey',

      resave: false,

      saveUninitialized: false

   })
);


// GLOBAL VARIABLES
app.use(
   (req, res, next) => {

      res.locals.isLoggedIn =
      req.session.isLoggedIn;

      res.locals.user =
      req.session.user;

      next();

   }
);


// ROUTES
app.use(authRoutes);

app.use(tripRoutes);


// 404
app.use(
   (req, res) => {

      res.status(404).render(
         '404',
         {
         pagetitle:'Page Not Found'
         }
      );

   }
);


// PORT
const PORT =
3050;


// DATABASE + SERVER
mongoConnect()
.then(() => {

   app.listen(
      PORT,
      () => {

         console.log(
            `Server running on http://localhost:${PORT}`
         );

      }
   );

})
.catch(err => {

   console.log(err);

});