const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const Auth = require("./routes/authRoutes");
const Todo = require("./routes/todoRoutes");
const app = express();
app.use(express.json());
app.use("/", Auth);
app.use("/todo/", Todo);
const PORT = process.env.PORT || 3000;
//Connecting DB to the APP
connectDB();
app.listen(PORT, () => {
  console.log(`App is listening on PORT http://localhost:${PORT}`);
});
