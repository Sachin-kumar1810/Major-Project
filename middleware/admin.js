module.exports.isAdmin = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }

    req.flash("error", "Admin access required!");
    res.redirect("/admin/login");
};