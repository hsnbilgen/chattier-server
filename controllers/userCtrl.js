const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var qs = require("qs");

exports.register = async (req, res) => {
  const { name, lastName, email, password, rePassword, lang, country } = req.body;

  const emailRegex = /^[a-zA-Z0-9.+\/-_]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,10}[a-zA-Z0-9])?)*$/;

  console.log(emailRegex.test(email));
  if (!emailRegex.test(email)) throw 'Email contains un-supported characters.';
  if (password.length < 8) throw 'Password must be atleast 8 characters long.';
  if (password != rePassword) throw 'Password does not match!';

  const userExists = await User.findOne({
    email,
  });

  if (userExists) throw 'This email already registered!';

  const user = new User({
    name,
    lastName,
    email,
    password: bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS)).toString(),
    lang,
    country
  });
console.log(JSON.stringify(user));
  await user.save();

  res.json({
    status: 200,
    message: 'OK',
    data: {
      userInfo: 'User [' + name + '] registered successfully!',
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });

  const validPass = bcrypt.compareSync( password, user.password);
  console.log(JSON.stringify(user));
  if (!user) throw 'Email and password did not match.';
  if (!validPass) throw 'Incorrect password!';

  const token = await jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);

  res.json({
    status: 200,
    message: 'OK',
    data: {
      message: 'Successfull Login!',
      token,
    }
  });
};

exports.userInfo = async (req, res) => {
  const userId = req.params.id
  const user = await User.findOne({
    _id: userId
  });
  console.log(JSON.stringify(user));
  if (!user) throw 'User cannot be found!';

  res.json({
    status: 200,
    message: 'OK',
    data: {
      name: user.name,
      lastNAme: user.lastName,
      email: user.email,
      lang: user.lang,
      country: user.country
    }
  });
};
