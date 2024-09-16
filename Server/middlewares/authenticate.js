// middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const { AdminModel } = require("../models/admin.model");
const { TutorModel } = require("../models/tutor.model");

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY); // اعتبارسنجی توکن
  } catch (error) {
    return null; // اگر توکن نامعتبر باشد
  }
};

const isAdminAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // توکن از هدر Authorization خوانده می‌شود
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }

  const decodedData = verifyToken(token);
  if (!decodedData) {
    return res.status(401).send({ message: "Invalid Token. Access Denied" });
  }

  const admin = await AdminModel.findOne({ email: decodedData.email });
  if (admin) {
    next();
  } else {
    return res.status(401).send({ message: "Invalid Token. Access Denied" });
  }
};

const isTutorAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // توکن از هدر Authorization خوانده می‌شود
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }

  const decodedData = verifyToken(token);
  if (!decodedData) {
    return res.status(401).send({ message: "Invalid Token. Access Denied" });
  }

  const tutor = await TutorModel.findOne({ email: decodedData.email });
  if (tutor) {
    next();
  } else {
    return res.status(401).send({ message: "Invalid Token. Access Denied" });
  }
};

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // توکن از هدر Authorization خوانده می‌شود
  if (!token) {
    return res.status(401).send({ message: "Missing Token. Access Denied" });
  }

  const decodedData = verifyToken(token);
  if (!decodedData) {
    return res.status(401).send({ message: "Invalid Token. Access Denied" });
  }

  const admin = await AdminModel.findOne({ email: decodedData.email });
  const tutor = await TutorModel.findOne({ email: decodedData.email });
  if (admin || tutor) {
    next();
  } else {
    return res.status(401).send({ message: "Invalid Token. Access Denied" });
  }
};

module.exports = {
  isAdminAuthenticated,
  isTutorAuthenticated,
  isAuthenticated,
};