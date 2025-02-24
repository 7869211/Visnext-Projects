class Validators {

  static isValidStr (str) {

    if (!str) {

      return false;

    }

    return (str && typeof (str) === 'string' && str.trim() && str !== '');

  }

  static isValidDate (date) {

    const valid = (new Date(date)).getTime() > 0;

    return valid;

  }

  static isValidSSN (ssn) {

    const re = /^\d{3}-?\d{2}-?\d{4}$/;

    return re.test(ssn);

  }

  static isValidFloat (number) {

    const valid = /^-?\d*(\.\d+)?$/;

    return valid.test(number);

  }

  static isValidateEmail (email) {

    const re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/im;

    return re.test(String(email).toLowerCase());

  }

  static isValidJSON (str) {

    if (!str) {

      return false;

    }

    if (typeof str === 'string') {

      try {

        str = JSON.parse(str);

      } catch (e) {

        return false;

      }

    }

    return (!!Object.keys(str).length);

  }

  // static isValidPassword (pPassword) {
  //
  //   if (config.activatePasswordStrength) {
  //
  //     if (/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pPassword)) {
  //
  //       return true
  //
  //     }
  //
  //     return false
  //
  //   }
  //
  //   return Validators.isValidStr(pPassword)
  //
  // }

  static isValidPassword (password) {

    if (Validators.isValidStr(password) && password.length >= 8) {

      return true;

    }

    return false;

  }

  static getParsedJson (data) {

    if (!data) {

      return null;

    }

    if (typeof data === 'string') {

      try {

        return JSON.parse(data);

      } catch (e) {

        console.log(e.message);

        return null;

      }

    } else if (Object.keys(data).length) {

      return data;

    }

  }

  static propExists (key, obj) {

    return (Object.prototype.hasOwnProperty.call(obj, key) && (key in obj));

  }

  static isArray (variable) {

    return (variable && (Object.prototype.toString.call(variable) === '[object Array]') && Array.isArray(variable));

  }

  static parseInteger (value, defaultValue) {

    try {

      value = parseInt(value, 10);

      return Number.isNaN(value) ? defaultValue : value;

    } catch (ex) {

      return defaultValue;

    }

  }

  static validateCode (code, defaultCode) {

    if (code >= 400 && code < 500) {

      return code;

    }

    return defaultCode;
  
  }

  static isPNG (fileName) {

    if (!fileName || !fileName.length || fileName.lastIndexOf('.') === -1) {

      return false;

    }

    return fileName.substring(fileName.lastIndexOf('.') + 1) === 'png';

  }

  static isObject (value) {

    return value && typeof value === 'object' && value.constructor === Object;

  }

  static isString (value) {

    if (!value) {

      return false;

    }

    return (value && typeof (value) === 'string' && value.trim());

  }

  static isBoolean (value) {

    try {

      return typeof JSON.parse(value) === 'boolean';

    } catch (err) {

      return false;

    }

  }

  static isValidDomain (email, domain) {

    if (this.isValidStr(email) && this.isValidStr(domain)) {

      const pattern = new RegExp(`@?(${domain})$`, 'i');

      return pattern.test(email);

    }

    return false;

  }

  static isFunction (fn) {

    return fn && typeof fn === 'function';

  }

  static isUndefined (obj) {

    return typeof obj === 'undefined';

  }

  static isNumber (value) {

    return typeof value === 'number';

  }

  static isNaN (value) {

    return !/^\d+$/.test(value);

  }

  static isValidNumber (value) {

    return this.isNumber(value) && !this.isNaN(value);

  }

  static getParsedValue (value) {

    try {

      if (!value || value.trim() === '') {

        return value;

      }

      const boolValue = value.toLowerCase();

      if (boolValue === 'true') {

        return true;

      }

      if (boolValue === 'false') {

        return false;

      }

      const num = Number(value);

      if (!Number.isNaN(num)) {

        const numberRegEx = new RegExp(/^\d+(\.\d+)?$/);

        if (numberRegEx.test(value)) {

          return num;

        }

      }

    } catch (err) {

      console.log(`getParsedValue:: Error occurred while parsing value: ${value} error: `, err);

    }

    return value;

  }

}

module.exports = Validators;
