const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email")
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render("account/register", {
      title: "Registration",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Please enter your password."),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const { account_email = "" } = req.body

    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: errors.array(),
      account_email,
    })
  }
  next()
}

validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = parseInt(req.body.account_id)
        const current = await accountModel.getAccountById(account_id)

        if (current && current.account_email !== account_email) {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists) {
            throw new Error("Email exists. Please use a different email.")
          }
        }
      }),

    body("account_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Account id is required."),
  ]
}

validate.checkUpdateAccountData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()

  const account_id = parseInt(req.body.account_id)
  const account_firstname = req.body.account_firstname || ""
  const account_lastname = req.body.account_lastname || ""
  const account_email = req.body.account_email || ""

  if (!errors.isEmpty()) {
    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
  next()
}

validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),

    body("account_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Account id is required."),
  ]
}

validate.checkUpdatePasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const account_id = parseInt(req.body.account_id)

  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(account_id)

    return res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account_id,
      account_firstname: accountData?.account_firstname || "",
      account_lastname: accountData?.account_lastname || "",
      account_email: accountData?.account_email || "",
    })
  }
  next()
}

module.exports = validate