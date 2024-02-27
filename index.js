const express = require("express");

const app = express();
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Welcome to express");
})


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening to port ${port}`));





