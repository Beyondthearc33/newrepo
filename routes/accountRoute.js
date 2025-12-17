const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const validate = require("../utilities/account-validation")

router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdate)
)

router.post(
  "/update",
  utilities.checkLogin,
  validate.updateAccountRules(),
  validate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

router.post(
  "/update-password",
  utilities.checkLogin,
  validate.updatePasswordRules(),
  validate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

module.exports = router