const express = require("express");
const cors = require("cors");
//allow url for only front localhost and front firebase server
const corsOptions = {
  origin: ["http://localhost:3000", "https://diary30woo.web.app"],
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
};

const app = express();
const cookieParser = require("cookie-parser");

// Middleware
app.use(cors(corsOptions));
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const functions = require("firebase-functions");

const usersRoute = require("./routes/usersRoute");
const questionsRoute = require("./routes/questionsRoute");

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

app.use(function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept"
  // );
  next();
});

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//Set up mongoose connection
var mongoDB =
  "mongodb://eunewoo:mongoconquer98@ac-0vyijen-shard-00-00.kciyq16.mongodb.net:27017,ac-0vyijen-shard-00-01.kciyq16.mongodb.net:27017,ac-0vyijen-shard-00-02.kciyq16.mongodb.net:27017/?ssl=true&replicaSet=atlas-9pxc0l-shard-0&authSource=admin&retryWrites=true&w=majority"; // insert your database URL here
mongoose.set("strictQuery", false);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const sessionSecret = "make a secret string";

// Create Mongo DB Session Store
const store = MongoStore.create({
  mongoUrl: mongoDB,
  dbName: "test",
  collectionName: "sessions",
  // secret: sessionSecret,
  // touchAfter: 24 * 60 * 60,
});

//mongoose.set("useFindAndModify", false);

// Setup to use the express-session package
const sessionConfig = {
  store,
  name: "session2",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    // httpOnly: true,
    // expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60,
    // value: session._id,
    secure: true,
    // secure: false,
  },
};

app.use(session(sessionConfig));

// Routes
app.use("/api", usersRoute);
app.use("/api", questionsRoute);

// This is middleware that will run before every request
app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log("req method here", req.method, req.path);
  next();
});

exports.app = functions.https.onRequest(app);
