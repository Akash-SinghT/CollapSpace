export const validateRegister = ({ username, email, password, role }) => {
  const errors = [];
  if (!username || username.length < 3)
    errors.push("Username must be at least 3 characters");
  if (!email || !/\S+@\S+\.\S+/.test(email))
    errors.push("Valid email is required");
  if (!password || password.length < 6)
    errors.push("Password must be at least 6 characters");

  return errors;
};
export const validateLogin = ({ email, password }) => {
  const errors = [];
  if (!email || !/\S+@\S+\.\S+/.test(email))
    errors.push("Valid email is required");
  if (!password) errors.push("Password is required");
  return errors;
};
