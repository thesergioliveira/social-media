module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  // username.trim() ||=
  if (username.trim() === "") errors.username = "username must not be empty";
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  } else if (password.trim() === "") {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) errors.email = "not a valid email";
  }
  if (password.trim() === "") {
    errors.password = "confirm password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassord = "Passwords must match";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() == "") errors.username = "Username can not be empty!";
  if (password.trim() == "") errors.passsword = "Password can not be empty!";
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
