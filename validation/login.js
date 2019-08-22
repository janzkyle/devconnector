const Validator = require("validator");
const isEmpty = require("./is_empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "password field is required";
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "password must be at least 6 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
