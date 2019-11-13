const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoute = require("../auth/auth-route.js");
const usersRoute = require("../users/user-route.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/auth", authRoute);
server.use("/api/users", usersRoute);

server.get("/", (req, res) => {
  res.send("I exist!");
});

module.exports = server;