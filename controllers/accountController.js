const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const accountModel = require("../models/accountModel");

const accountController = {};

/* ***************************
 *  Render Login Page
 * ************************** */
accountController.renderLogin = (req, res) => {
  res.render("account/login", {
    title: "Login",
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Handle Login Submission
 * ************************** */
accountController.processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash("message", "Please enter email and password.");
      return res.redirect("/account/login");
    }

    // ✅ Check credentials in the database
    const user = await accountModel.getAccountByEmail(email);
    if (!user) {
      req.flash("message", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    // ✅ Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.flash("message", "Invalid email or password.");
      return res.redirect("/account/login");
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        account_id: user.account_id,
        account_firstname: user.account_firstname,
        account_type: user.account_type,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, { httpOnly: true });
    req.flash("message", "Login successful!");
    return res.redirect("/account/manage");
  } catch (error) {
    console.error("Error in processLogin:", error);
    req.flash("message", "Error processing login.");
    return res.redirect("/account/login");
  }
};

/* ***************************
 *  Render Register Page
 * ************************** */
accountController.renderRegister = (req, res) => {
  res.render("account/register", {
    title: "Register",
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Handle User Registration
 * ************************** */
accountController.processRegister = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
      req.flash("message", "All fields are required.");
      return res.redirect("/account/register");
    }

    // ✅ Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user in database
    const success = await accountModel.createAccount(
      firstname,
      lastname,
      email,
      hashedPassword
    );
    if (success) {
      req.flash("message", "Registration successful! Please log in.");
      return res.redirect("/account/login");
    } else {
      req.flash("message", "Error creating account.");
      return res.redirect("/account/register");
    }
  } catch (error) {
    console.error("Error in processRegister:", error);
    req.flash("message", "Error processing registration.");
    return res.redirect("/account/register");
  }
};

/* ***************************
 *  Render Account Management Page
 * ************************** */
accountController.renderAccountManagement = async (req, res) => {
  res.render("account/manage", {
    title: "Account Management",
    user: req.user,
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Handle Logout
 * ************************** */
accountController.logout = (req, res) => {
  res.clearCookie("jwt");
  req.flash("message", "Logged out successfully.");
  res.redirect("/");
};

/* ***************************
 *  Render Update Account Page
 * ************************** */
accountController.renderUpdateAccount = (req, res) => {
  res.render("account/update", {
    title: "Update Account",
    user: req.session.user,
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Handle Account Update
 * ************************** */
accountController.updateAccount = async (req, res) => {
  const { account_id, firstname, lastname, email } = req.body;
  const success = await accountModel.updateAccount(
    account_id,
    firstname,
    lastname,
    email
  );

  if (success) {
    req.flash("message", "Account updated successfully!");
    return res.redirect("/account/manage");
  }

  req.flash("message", "Error updating account.");
  res.redirect("/account/update");
};

/* ***************************
 *  Render Change Password Page
 * ************************** */
accountController.renderChangePassword = (req, res) => {
  res.render("account/change-password", {
    title: "Change Password",
    message: req.flash("message"),
    layout: "layouts/layout",
  });
};

/* ***************************
 *  Handle Password Change
 * ************************** */
accountController.changePassword = async (req, res) => {
  const { account_id, new_password } = req.body;
  const hashedPassword = await bcrypt.hash(new_password, 10);
  const success = await accountModel.updatePassword(account_id, hashedPassword);

  if (success) {
    req.flash("message", "Password updated successfully!");
    return res.redirect("/account/manage");
  }

  req.flash("message", "Error changing password.");
  res.redirect("/account/change-password");
};

/* ***************************
 *  Handle Logout
 * ************************** */
accountController.logout = (req, res) => {
  res.clearCookie("jwt");
  req.flash("message", "Logged out successfully.");
  res.redirect("/");
};

module.exports = accountController;

module.exports = accountController;
