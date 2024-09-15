const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello");
});
const PORT = process.env.PORT || 3000;
//Connecting DB to the APP
connectDB();
app.listen(PORT, () => {
  console.log(`App is listening on PORT http://localhost:${PORT}`);
});
