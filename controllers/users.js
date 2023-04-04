//imports
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const wrapAsync = require("../factory/wrapAsync");
const passport = require("passport");
const { session } = require("passport");
const { checkReturnTo } = require("../factory/middleware");

//render register page
module.exports.renderRegisterPage = (req, res) => {
  res.render("auth/register", { pageName: "User Registration" });
};

//register user
module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registered successfully !");
      res.redirect("/locations");
    });
  } catch (e) {
    req.flash("error", `${e.message}.`, "Please try again!");
    res.redirect("/register");
  }
};

//render login page
module.exports.renderLoginPage = (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("auth/login", { pageName: "User login" });
  } else {
    req.flash("success", "Welcome back !");
    return res.redirect("/locations");
  }
};

module.exports.renderLogic = (req, res) => {
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo;
  }
};

//login
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back !");
  const returnToUrl = res.locals.returnTo || "/locations";
  res.redirect(returnToUrl);
};

//logout
module.exports.logout = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in !");
    return res.redirect("/login");
  }
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully !");
    res.redirect("/locations");
  });
};

//renderDashboardPage
module.exports.renderDashboardPage = async (req, res) => {
  await res.render("user/dashboard", { pageName: "Dashboard" });
};
