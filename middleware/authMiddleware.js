import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

// auth middleware to protect routes

const authMiddleware = (req, res, next) => {
  console.log("auth middleware reached");
  // check for token in headers
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "unauthorized, no token" });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "unauthorized, invalid token" });
  }
};

export default authMiddleware;

// create jwt token
export const createToken = (user, is_password_reset_token = 0) => {
  if (is_password_reset_token) {
    console.log("create token for pswd reset called");
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: `${is_password_reset_token}m` }
    );
  }
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET
  );
};
