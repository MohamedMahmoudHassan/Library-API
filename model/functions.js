function validationErr(msg) {
  return { details: [{ message: msg }] };
}

module.exports.validationErr = validationErr;
