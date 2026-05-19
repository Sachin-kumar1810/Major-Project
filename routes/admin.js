const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const User = require("../models/user");
const nodemailer = require("nodemailer");

router.get("/login", (req, res) => {
    res.render("admin/login");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        req.session.admin = true;
        req.flash("success", "Welcome Admin!");
        return res.redirect("/listings");
    }

    req.flash("error", "Invalid Admin Credentials");
    res.redirect("/admin/login");
});

router.get("/logout", (req, res) => {
    req.session.admin = null;
    req.flash("success", "Admin Logged Out");
    res.redirect("/listings");
});

router.delete("/listing/:id", async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const userEmail = listing.owner.email;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: userEmail,
        subject: "Listing Removed",
        text: `Hello,

Your uploaded listing "${listing.title}" has been removed by admin because the content was not appropriate.

Thank you.`,
    });

    await Listing.findByIdAndDelete(req.params.id);

    req.flash("success", "Listing deleted and email sent");
    res.redirect("/listings");
});

module.exports = router;