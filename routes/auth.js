// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// var stormpath = require('express-stormpath');
// var StormpathStrategy = require('passport-stormpath');
// var session = require('express-session');
// var flash = require('connect-flash');


// // Render the login page.
// router.get('/login', function(req, res) {
//   res.render('login', { title: 'Login', error: req.flash('error')[0] });
// });

// // Authenticate a user.
// router.post('/login', passport.authenticate('stormpath', {
//   successRedirect: '/dashboard',
//   failureRedirect: '/login',
//   failureFlash: 'Invalid email or password.'
// }));

// // Logout the user, then redirect to the home page.
// router.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/home');
// });

// module.exports = router;


// // Render the registration page.
// router.get('/register', function(req, res) {
//   res.render('login', { title: 'Register', error: req.flash('error')[0] });
// });

// // Register a new user to Stormpath.
// router.post('/register', function(req, res) {
//   console.log("Did /register submit work?");
//   console.log("This is the req: \n"+req)
//   var username = req.body.username;
//   var email = req.body.email;
//   var password = req.body.password;

//   // Grab user fields.
//   if (!username || !email || !password) {
//     return res.render('login', { title: 'Register', error: 'User Name, Email and password required.' });
//   }

//   // Initialize our Stormpath client.
//   var apiKey = new stormpath.ApiKey(
//     process.env['STORMPATH_API_KEY_ID'],
//     process.env['STORMPATH_API_KEY_SECRET']
//   );
//   var spClient = new stormpath.Client({ apiKey: apiKey });

//   // Grab our app, then attempt to create this user's account.
//   spClient.getApplication(process.env['STORMPATH_APP_HREF'], function(err, app) {
//     console.log("is there an err after firstspClient? : "+err);
//     if (err) throw err;

//     app.createAccount({
//       username: username,
//       email: email,
//       password: password,
//     }, function (err, createdAccount) {
//       if (err) {
//         console.log("is there and in post callback? : "+err);
//         return res.render('login', { title: 'Register', error: err.userMessage });
//       }
//       console.log(createdAccount);

//       passport.authenticate('stormpath')(req, res, function () {
//         return res.redirect('/dashboard');
//       });
//     });
//   });
// });
