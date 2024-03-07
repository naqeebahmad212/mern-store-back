const jwt = require("jsonwebtoken");
const sendToken = (user, res, statusCode) => {
  const maxAge = Date.now() + 24 * 3 * 60 * 60 * 1000;
  const token = jwt.sign({ id: user._id }, "ksdjfskdur", { expiresIn: maxAge });
  res
    .cookie("jwtToken", token, {
      httpOnly: true,
      expiresIn: maxAge,
      path: "/",
      secure: true,
      sameSite: "Lax",
    })
    .status(statusCode)
    .json({ message: "login", user });
};

module.exports = sendToken;
