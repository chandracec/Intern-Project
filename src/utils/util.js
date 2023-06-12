isValidData = function (a) {
    if (a === null || a === undefined) return false;
    if (typeof a !== 'string' || a.trim().length === 0) return false;
    if (!(/^[A-Za-z\s]+$/.test(a))) return false;
    return true;
  };
  
  validEmail = function (email) {
    return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };
  
  validMobile = function (mob) {
    const trimmedMobile = mob.replace(/\s/g, '');
    return /^[0-9]{10}$/.test(trimmedMobile);
  };
  
  module.exports = { isValidData, validEmail, validMobile };
  