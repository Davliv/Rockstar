class Validator {

  validateEmail (email) {
    let regex = /^[^@\/\\*,~!#^()]+@[a-z]+\.[a-z]+$/;
    return regex.test(email);
  }

  validatePassword (password) {
    if(!password) return false;
    return password.length >= 6 && password.length <= 24;
  }
  validateName (name) {
    let nameRegex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    return nameRegex.test(name);
  }
  validatePoints (points) {
    if (!points) return false;
    return points > 0 && points <= 10;
  }

}
module.exports = new Validator();
