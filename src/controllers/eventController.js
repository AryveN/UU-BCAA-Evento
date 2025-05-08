const Event = require('../models/event');
const Expense = require('../models/expense');

// Helper: validate unsupported keys
function findUnsupportedKeys(dtoIn, allowedKeys) {
  return Object.keys(dtoIn || {}).filter(k => !allowedKeys.includes(k));
}

exports.createEvent = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    const warnings = [];

    // 1) Unsupported keys
    const allowedCreate = ['name','date','location','description','budget','guests'];
    const unsupported = findUnsupportedKeys(dtoIn, allowedCreate);
    if (unsupported.length) {
      warnings.push({
        code: '<gateway>/event/create/unsupportedKeys',
        parameters: { unsupportedKeyList: unsupported }
      });
    }
    // 2) Missing keys
    const requiredCreate = ['name','date','location','budget'];
    const missing = requiredCreate.filter(k => dtoIn[k] == null);
    if (missing.length) {
      const err = new Error('Chybějící povinné klíče: ' + missing.join(', '));
      err.status = 400;
      err.code = '<gateway>/event/create/dtoInIsNotValid';
      err.parameters = { missingKeyList: missing };
      throw err;
    }
    // 3) Validate date
    const date = new Date(dtoIn.date);
    if (isNaN(date)) {
      const err = new Error('Neplatný formát date');
      err.status = 400;
      err.code = '<gateway>/event/create/dtoInIsNotValid';
      throw err;
    }
    if (date <= new Date()) {
      const err = new Error('Datum musí být v budoucnosti');
      err.status = 400;
      err.code = '<gateway>/event/create/dateInPast';
      throw err;
    }
    // 4) Validate budget
    if (typeof dtoIn.budget !== 'number' || dtoIn.budget < 0) {
      const err = new Error('Rozpočet musí být >= 0');
      err.status = 400;
      err.code = '<gateway>/event/create/budgetInvalid';
      throw err;
    }
    // 5) Create
    const evt = await Event.create({
      name: dtoIn.name,
      date,
      location: dtoIn.location,
      description: dtoIn.description || '',
      budget: dtoIn.budget,
      guests: []
    });
    const result = evt.toObject();
    if (warnings.length) result.warnings = warnings;
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    // 1) Validate input
    const required = ['id'];
    const missing = required.filter(k => dtoIn[k] == null);
    if (missing.length) {
      const err = new Error('Chybějící klíč id');
      err.status = 400;
      err.code = '<gateway>/event/get/dtoInIsNotValid';
      err.parameters = { missingKeyList: missing };
      throw err;
    }
    // 2) Fetch
    const evt = await Event.findById(dtoIn.id);
    if (!evt) {
      const err = new Error('Událost neexistuje');
      err.status = 404;
      err.code = '<gateway>/event/get/eventNotFound';
      throw err;
    }
    res.json(evt);
  } catch (err) {
    next(err);
  }
};

exports.listEvents = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    // 1) Unsupported keys
    const warnings = [];
    const allowed = ['dateFrom','dateTo'];
    const unsupported = findUnsupportedKeys(dtoIn, allowed);
    if (unsupported.length) {
      warnings.push({
        code: '<gateway>/event/list/unsupportedKeys',
        parameters: { unsupportedKeyList: unsupported }
      });
    }
    // 2) Input validation
    const filter = {};
    if (dtoIn.dateFrom) filter.date = { $gte: new Date(dtoIn.dateFrom) };
    if (dtoIn.dateTo) {
      filter.date = filter.date || {};
      filter.date.$lte = new Date(dtoIn.dateTo);
    }
    // 3) Fetch
    const list = await Event.find(filter);
    const dtoOut = { itemList: list };
    if (warnings.length) dtoOut.warnings = warnings;
    res.json(dtoOut);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    const warnings = [];
    const allowed = ['id','name','date','location','description','budget','guests'];
    const unsupported = findUnsupportedKeys(dtoIn, allowed);
    if (unsupported.length) {
      warnings.push({
        code: '<gateway>/event/update/unsupportedKeys',
        parameters: { unsupportedKeyList: unsupported }
      });
    }
    // Required
    const required = ['id'];
    const missing = required.filter(k => dtoIn[k] == null);
    if (missing.length) {
      const err = new Error('Chybějící klíč id');
      err.status = 400;
      err.code = '<gateway>/event/update/dtoInIsNotValid';
      err.parameters = { missingKeyList: missing };
      throw err;
    }
    // Fetch
    const evt = await Event.findById(dtoIn.id);
    if (!evt) {
      const err = new Error('Událost neexistuje');
      err.status = 404;
      err.code = '<gateway>/event/update/eventNotFound';
      throw err;
    }
    // Validate date & budget
    if (dtoIn.date) {
      const d = new Date(dtoIn.date);
      if (d <= new Date()) {
        const err = new Error('Datum nesmí být v minulosti');
        err.status = 400;
        err.code = '<gateway>/event/update/dateInPast';
        throw err;
      }
    }
    if (dtoIn.budget != null && dtoIn.budget < 0) {
      const err = new Error('Rozpočet musí být >= 0');
      err.status = 400;
      err.code = '<gateway>/event/update/budgetInvalid';
      throw err;
    }
    // Update
    Object.assign(evt, dtoIn);
    await evt.save();
    const result = evt.toObject();
    if (warnings.length) result.warnings = warnings;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.removeEvent = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    const required = ['id'];
    const missing = required.filter(k => dtoIn[k] == null);
    if (missing.length) {
      const err = new Error('Chybějící klíč id');
      err.status = 400;
      err.code = '<gateway>/event/remove/dtoInIsNotValid';
      err.parameters = { missingKeyList: missing };
      throw err;
    }
    const evt = await Event.findById(dtoIn.id);
    if (!evt) {
      const err = new Error('Událost neexistuje');
      err.status = 404;
      err.code = '<gateway>/event/remove/eventNotFound';
      throw err;
    }
    await Expense.deleteMany({ eventId: dtoIn.id });
    await Event.deleteOne({ _id: dtoIn.id });
    res.json({});
  } catch (err) {
    next(err);
  }
};

exports.addGuest = async (req, res, next) => {
  try {
    const { id, email } = req.body;
    // validace…
    const evt = await Event.findById(id);
    if (!evt) {
      const e = new Error('Událost neexistuje');
      e.status = 404; e.code = '<gateway>/event/addGuest/eventNotFound';
      throw e;
    }
    // kontrola duplicitního e-mailu
    if (evt.guests.some(g => g.email === email)) {
      const w = { code: '<gateway>/event/addGuest/alreadyExists', parameters: { email } };
      return res.status(200).json({ itemList: evt.guests, warnings: [w] });
    }
    evt.guests.push({ email, status: 'Nerozhodnuto' });
    await evt.save();
    res.json({ itemList: evt.guests });
  } catch (err) {
    next(err);
  }
};

exports.listGuests = async (req, res, next) => {
  try {
    const { id } = req.body;
    const evt = await Event.findById(id);
    if (!evt) {
      const e = new Error('Událost neexistuje');
      e.status = 404; e.code = '<gateway>/event/listGuests/eventNotFound';
      throw e;
    }
    res.json({ itemList: evt.guests });
  } catch (err) {
    next(err);
  }
};