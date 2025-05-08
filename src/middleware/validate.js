const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv);

module.exports = (schema) => {
  const validateFn = ajv.compile(schema);
  return (req, res, next) => {
    const valid = validateFn(req.body);
    if (!valid) {
      const errors = validateFn.errors.map(e => ({ path: e.instancePath, message: e.message }));
      // prefix podle skutečné cesty
      const prefix = `${req.baseUrl}${req.route.path}`; 
      const err = new Error("DtoIn neodpovídá schématu");
      err.status = 400;
      err.code = `${prefix}/dtoInIsNotValid`;
      err.parameters = { errors };
      return next(err);
    }
    next();
  };
};
