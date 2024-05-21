const express = require("express");
const Users = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      if (bcrypt.compareSync(password, existingUser.hashedPassword)) {
        const token = jwt.sign(
          { _id: existingUser._id },
          process.env.SECRET_KEY
        );
        res.cookie("accessToken", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          expires: new Date(Date.now() + 86400000),
        });
        return res.status(200).send({
          message: "User Logged-in Successfully",
        });
      }
      return res.status(400).send({
        message: "Incorrect Password!!",
        password: password,
      });
    }
    res.status(400).send({
      message: "Entered email is not a existing email id",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server error",
      error: error.message,
    });
  }
});

module.exports = router;
