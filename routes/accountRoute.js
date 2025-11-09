// Needed Resources
const express = require("express");
const router = new express.Router();
const { handleErrors } = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require('../utilities/account-validation')

// Route for "My Account" Page
router.get("/login", handleErrors(accountController.buildLogin));


// POST login credentials
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  handleErrors(accountController.accountLogin)
)

// Route to build registration view
router.get("/register", handleErrors(accountController.buildRegister));

// Route to register a new account
// Process the registration data
router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)



module.exports = router;