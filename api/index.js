const express = require("express");
const app = express();
const path = require("path");
const cloudinary = require("cloudinary");
const { connectDB } = require("../config/db");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("../middlewares/error");
const userRoutes = require("../routes/UserRoutes");
const productRoutes = require("../routes/productRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const orderRoutes = require("../routes/orderRoutes");
app.use(
  cors({
    origin: "https://mern-store-front.vercel.app",
    credentials: true,
    methods: ["POST", "GET"],
  })
);

dotenv.config({
  path: "../config/.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shuntting down the server due to uncaugth");

  process.exit(1);
});

var path = require("path");

var logger = require("morgan");

const whitelist = ["*"];

app.use((req, res, next) => {
  const origin = req.get("referer");
  const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
  if (isWhitelisted) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,Content-Type,Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
  }
  // Pass to next layer of middleware
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

const setContext = (req, res, next) => {
  if (!req.context) req.context = {};
  next();
};
app.use(setContext);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`listening to port : ${process.env.PORT} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(userRoutes);
app.use(productRoutes);
app.use(paymentRoutes);
app.use(orderRoutes);

// app.use(express.static(path.join(__dirname, '../frontend/build')))
// app.get('*',(req,res)=>{
//     res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
// })

app.use(errorMiddleware);

module.exports = app;
