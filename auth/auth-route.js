const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/user-model.js");
const { validateUser } = require("../users/user-help.js");

router.post("/register", (req, res) => {
  let user = req.body;
  
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log(error.toString())
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = getJwtToken({username});
        res.status(200).json({
          message: `Welcome ${user.username}! have a token...`
          ,token
        });
      } else {
        
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      console.log(error.toString())
      res.status(500).json(error);
    });
});

function getJwtToken(username) {
  const payload = {
    username: username,
    role: "student"
  };

  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";

  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;