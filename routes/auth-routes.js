const express = require("express");
const Users = require("../model/user.model");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const payload = req.body;

    const user = await Users.findOne({ email: payload.email });

    if (user) {
      return res.status(409).send({
        message: "An account is already registered with your email",
      });
    }

    const hashedvalue = await bcrypt.hash(payload.password, 10);

    payload.hashedPassword = hashedvalue;
    delete payload.password;

    const newUser = new Users(payload);

    newUser
      .save()
      .then((data) => {
        return res
          .status(201)
          .send({ message: `New user created successfully`, data: data });
      })
      .catch((error) => {
        res.status(400).send({
          message: "Error occured while creating the user",
          error: error.message,
        });
      });

    //
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
});

module.exports = router;
