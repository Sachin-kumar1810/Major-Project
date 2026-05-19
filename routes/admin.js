router.delete("/listing/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const userEmail = listing.owner.email;

        // Nodemailer Transporter
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            family: 4, // Force IPv4
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_EMAIL_PASS,
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });

        // Verify SMTP connection
        await transporter.verify();

        // Send Email
        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: userEmail,
            subject: "Listing Removed",
            text: `Hello,

Your uploaded listing "${listing.title}" has been removed by admin because the content was not appropriate.

Thank you.`,
        });

        // Delete Listing
        await Listing.findByIdAndDelete(req.params.id);

        req.flash("success", "Listing deleted and email sent");
        res.redirect("/listings");

    } catch (err) {
        console.log(err);

        req.flash("error", "Failed to delete listing or send email");
        res.redirect("/listings");
    }
});