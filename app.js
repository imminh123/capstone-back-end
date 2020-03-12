/**
 * Module dependencies.
 */
const express = require('express');
const http = require('http');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
// const cors= require('cors');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const apiController = require('./controllers/api');
const contactController = require('./controllers/contact');
const adminController = require('./controllers/adminController');
const courseController = require('./controllers/courseController');
const teacherController = require('./controllers/teacherController');
const highlightController = require('./controllers/highlightController');
const noteController = require('./controllers/noteController');
const askController = require('./controllers/askController');
const studentController = require('./controllers/studentController');
const myUserController = require('./controllers/userController');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
// mongoose.connect('mongodb://localhost/test');
mongoose.connection.once('open', function () {
    console.log('Connection to mongo has been made')
    }).on('error', (err) => {
      console.error(err); 
      console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
      process.exit();
    });

//solution for cors error
// app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {
//   if (req.path === '/api/upload') {
//     // Multer multipart/form-data handling needs to occur before the Lusca CSRF check.
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//   }
// });
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});
app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/chart.js/dist'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account/verify', passportConfig.isAuthenticated, userController.getVerifyEmail);
app.get('/account/verify/:token', passportConfig.isAuthenticated, userController.getVerifyEmailToken);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/upload', lusca({ csrf: true }), apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), lusca({ csrf: true }), apiController.postFileUpload);

/**
 * OAuth authentication routes. (Sign in)
 */

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], accessType: 'offline', prompt: 'consent' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});
/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), (req, res) => {
  res.redirect('/api/foursquare');
});


/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Server Error');
  });
}

//SocketIO
const server = http.Server(app);
const io = require('socket.io')(server);
const socketIOController = require('./controllers/socketIOController');
socketIOController(io);


/**
 * Start Express server.
 */

 //to use with SocketIO
server.listen(app.get('port'), () => {
  console.log(`Server has start on port ${app.get('port')}`);
}); 

// app.listen(app.get('port'), () => {
//   console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
//   console.log('  Press CTRL-C to stop\n');
// });

/**
 * Admin statics page
 */
app.get('/getStatisticNumber', adminController.getAllNumber);

/**
 * Course
 */
app.get('/allcourses', courseController.getAllCourse);
app.get('/getcourse/:id', courseController.getCourseByID);
app.post('/createcourse/', courseController.createCourse);
app.put('/updatecourse/:id',courseController.updateCourse);
app.delete('/deletecourse/:id',courseController.deleteCourse);
app.get('/searchcourse', courseController.searchCourse);
app.get('/searchdepartment', courseController.searchDepartments);
app.get('/getCourseOfStudent/:id', courseController.getCourseOfStudent);

/**
 * Teacher
 */
app.get('/allteachers', teacherController.getAllTeacher);
app.get('/getteacher/:id', teacherController.getTeacherByID);
app.put('/updateteacher/:id', teacherController.updateTeacher);
app.get('/searchteacher', teacherController.searchTeacher);
app.put('/changeteacherisactive/:id', teacherController.changeteacherisactive);

/**
 * Student highlight
 */
app.post('/createhighlight', highlightController.createHighlight);
app.get('/gethighlightbyid/:id', highlightController.getHighlightByID);
app.get('/allhighlightbystudentid/:id', highlightController.allHighlightByStudentID);
app.delete('/deletehighlightbyid/:id', highlightController.deleteHighlightbyID);
app.put('/updatehighlight/:id', highlightController.updateHighlight);
app.get('/gethighlightofurl/', highlightController.getHighlightOfUrl);
app.get('/searchHighlightByText/', highlightController.searchHighLight);
app.get('/getHighlightByCourse', highlightController.getHighlightByCourse);

/**
 * Student Note
 */
app.post('/createnote', noteController.createNote);
app.put('/updatenotebyid/:id', noteController.updateNoteByID);
app.delete('/deletenotebyid/:id', noteController.deleteNoteByID);
app.get('/getnotebyid/:id', noteController.getNoteByID);
app.get('/allnotebystudentid/:id', noteController.allNoteOfStudent);
app.put('/changenoteispinned/:id', noteController.changeNoteIsPinned);
app.get('/searchNoteByNote', noteController.searchNote);
app.get('/getNoteByCourse', noteController.getNoteByCourse);

/**
 * Ask and comment
 */
app.post('/createask', askController.createAsk);
app.get('/allask', askController.allAsk);
app.get('/getaskbyid/:id', askController.getAskByID);
app.get('/allaskofstudent/:id', askController.allAskOfStudent);
app.get('/allaskofteacher/:id', askController.allAskOfTeacher);
app.delete('/deleteask/:id', askController.deleteAskByID);
app.post('/addcomment/:id', askController.addComment);

/**
 * Student
 */
app.get('/getstudentbyid/:id', studentController.getStudentByID);
app.put('/updatestudentcourse/:id', studentController.updateStudentCourse);

/**
 * User
 */
app.get('/getUserByID/:id', myUserController.getUserByID);
app.post('/createUser', myUserController.createUser);

module.exports = app;