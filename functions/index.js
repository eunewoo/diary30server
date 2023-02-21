const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:3000", "https://diary30woo.web.app"],
};

const functions = require("firebase-functions");

const express = require("express");
const usersRoute = require("./routes/usersRoute");
const questionsRoute = require("./routes/questionsRoute");

const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const mongoose = require("mongoose");
//const users = require("./models/users");
const questions = require("./models/questions");

//const PORT = process.env.PORT || 3306;

//Set up mongoose connection
var mongoDB =
  "mongodb://eunewoo:mongoconquer98@ac-0vyijen-shard-00-00.kciyq16.mongodb.net:27017,ac-0vyijen-shard-00-01.kciyq16.mongodb.net:27017,ac-0vyijen-shard-00-02.kciyq16.mongodb.net:27017/?ssl=true&replicaSet=atlas-9pxc0l-shard-0&authSource=admin&retryWrites=true&w=majority"; // insert your database URL here
mongoose.set("strictQuery", true);
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// app.set("port", process.env.PORT || 3305);
// app.use(cors(corsOptions));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(urlencodedParser);

app.use("/api", usersRoute);
app.use("/api", questionsRoute);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//   console.log("Server started on port " + port);
// });

exports.app = functions.https.onRequest(app);
