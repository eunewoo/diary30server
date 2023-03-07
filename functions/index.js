// const cors = require("cors");
// //allow url for only front localhost and front firebase server
// const corsOptions = {
//   origin: ["http://localhost:3000", "https://diary30woo.web.app"],
// };
const cookieParser = require("cookie-parser");

const functions = require("firebase-functions");

const express = require("express");
const usersRoute = require("./routes/usersRoute");
const questionsRoute = require("./routes/questionsRoute");

const app = express();

// Middleware
// app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//Set up mongoose connection
var mongoDB =
  "mongodb://eunewoo:mongoconquer98@ac-0vyijen-shard-00-00.kciyq16.mongodb.net:27017,ac-0vyijen-shard-00-01.kciyq16.mongodb.net:27017,ac-0vyijen-shard-00-02.kciyq16.mongodb.net:27017/?ssl=true&replicaSet=atlas-9pxc0l-shard-0&authSource=admin&retryWrites=true&w=majority"; // insert your database URL here
mongoose.set("strictQuery", true);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const sessionSecret = "make a secret string";

// Create Mongo DB Session Store
const store = MongoStore.create({
  mongoUrl: mongoDB,
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
    expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60,
    value: session,
    secure: false,
  },
};

app.use(session(sessionConfig));

// This is middleware that will run before every request
app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log("req method here", req.method, req.path);
  next();
});

// Routes
app.use("/api", usersRoute);
app.use("/api", questionsRoute);

exports.app = functions.https.onRequest(app);
