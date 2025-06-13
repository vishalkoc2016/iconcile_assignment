const express = require("express");
const app  = express();
const cors = require('cors');
const roomsRoute = require("./routes/roomsRoute");
const usersRoute = require("./routes/usersRoute");
const bookingsRoute = require("./routes/bookingsRoute");
const dbConfig = require('./db');

app.use(cors());
app.options('*', cors());
app.use(express.json());

// Add this 👇
app.get("/", (req, res) => {
  res.send("SheyRooms Backend is Running ✅");
});

app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const port = 5000;
app.listen(port, () => console.log(`The server is running ${port}`));
