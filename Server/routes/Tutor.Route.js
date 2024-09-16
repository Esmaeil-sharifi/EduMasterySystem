const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const nodemailer = require("nodemailer");

// Model import
const { TutorModel } = require("../models/tutor.model");

// Middleware import
const { isTutorAuthenticated } = require("../middlewares/authenticate");

// Get all tutor data
router.get("/all", async (req, res) => {
    const { filter } = req.query;

    try {
        const tutors = filter 
            ? await TutorModel.find({ subject: filter }) 
            : await TutorModel.find();

        res.status(200).send({ message: "All tutor data", tutors });
    } catch (error) {
        res.status(400).send({ message: "Something went wrong", error: error.message });
    }
});

// Register new tutor
router.post("/register", isTutorAuthenticated, async (req, res) => {
    const { name, email, password, subject } = req.body.data;
    try {
        const existingUser = await TutorModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ message: "User already registered" });
        }

        const secure_password = await bcrypt.hash(password, +process.env.Salt_rounds);
        const tutor = new TutorModel({ name, email, subject, password: secure_password });
        await tutor.save();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.ADMIN_GMAIL,
                pass: process.env.ADMIN_PASSWORD,
            },
        });

        const mailOptions = {
            from: `👻 ${process.env.ADMIN_GMAIL}`,
            to: email,
            subject: "Account ID and Password",
            html: `<p>Welcome to LMS! Your account has been created successfully. This is your User type: Tutor and Password:</p><h1>${password}</h1>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({ message: "Error sending email", error: error.message });
            }
            res.status(201).send({ message: "Tutor Registered Successfully and Password sent", tutor });
        });
    } catch (error) {
        res.status(500).send({ message: "Tutor Registration failed", error: error.message });
    }
});

// Tutor login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const tutor = await TutorModel.findOne({ email });
        if (!tutor) {
            return res.status(401).send({ message: "Wrong credentials" });
        }

        if (tutor.access === "false") {
            return res.status(403).send({ message: "Access Denied" });
        }

        const isPasswordValid = await bcrypt.compare(password, tutor.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Wrong credentials" });
        }

        const token = jwt.sign({ email, name: tutor.name }, process.env.secret_key, { expiresIn: "7d" });
        res.status(200).send({ message: "Login Successful", user: tutor, token });
    } catch (error) {
        res.status(500).send({ message: "Error", error: error.message });
    }
});

// Edit tutor
router.patch("/:tutorId", isTutorAuthenticated, async (req, res) => {
    const { tutorId } = req.params;
    const payload = req.body.data;

    try {
        const tutor = await TutorModel.findByIdAndUpdate(tutorId, payload, { new: true });
        res.status(200).send({ message: "Updated Tutor", tutor });
    } catch (error) {
        res.status(500).send({ message: "Error updating tutor", error: error.message });
    }
});

// Delete tutor
router.delete("/:tutorId", isTutorAuthenticated, async (req, res) => {
    const { tutorId } = req.params;

    try {
        await TutorModel.findByIdAndDelete(tutorId);
        res.status(200).send({ message: "Deleted Tutor" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting tutor", error: error.message });
    }
});

module.exports = router;
