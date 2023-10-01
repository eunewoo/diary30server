const cors = require("cors");
require("dotenv").config();

//allow url for only front localhost and front firebase server
const corsOptions = {
  origin: ["http://localhost:3000", "https://diary30woo.web.app"],
  // methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  // credentials: true,
};

const functions = require("firebase-functions");

const express = require("express");
const usersRoute = require("./routes/usersRoute");
const questionsRoute = require("./routes/questionsRoute");

const app = express();

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo"); // MongoDB session store
//const users = require("./models/users");

//const PORT = process.env.PORT || 3306;

//Set up mongoose connection
var mongoDB = process.env.MONGODB_URI;
mongoose.set("strictQuery", true);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const sessionSecret = "make a secret string";

// Create Mongo DB Session Store
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  secret: sessionSecret,
  touchAfter: 24 * 60 * 60,
});

// Setup to use the express-session package
const sessionConfig = {
  store,
  name: "session",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // later you would want to add: 'secure: true' once your website is hosted on HTTPS.
  },
};

app.use(session(sessionConfig));

// This is middleware that will run before every request
app.use((req, res, next) => {
  // We can set variables on the request, which we can then access in a future method
  req.requestTime = Date.now();
  console.log("req method here", req.method, req.path);
  // Calling next() makes it go to the next function that will handle the request
  next();
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", usersRoute);
app.use("/api", questionsRoute);

exports.app = functions.https.onRequest(app);
