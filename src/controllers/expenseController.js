const Expense = require('../models/expense');
const Event   = require('../models/event');

function findUnsupportedKeys(dtoIn, allowedKeys) {
    return Object.keys(dtoIn || {}).filter(k => !allowedKeys.includes(k));
  }

exports.createExpense = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    const warnings = [];
    const allowed = ['eventId','title','amount','date'];
    const unsupported = findUnsupportedKeys(dtoIn, allowed);
    if (unsupported.length) {
      warnings.push({
        code: '<gateway>/expense/create/unsupportedKeys',
        parameters: { unsupportedKeyList: unsupported }
      });
    }
    const required = ['eventId','title','amount','date'];
    const missing = required.filter(k => dtoIn[k] == null);
    if (missing.length) {
      const err = new Error('Chybějící povinné klíče: ' + missing.join(', '));
      err.status = 400;
      err.code = '<gateway>/expense/create/dtoInIsNotValid';
      err.parameters = { missingKeyList: missing };
      throw err;
    }
    const evt = await Event.findById(dtoIn.eventId);
    if (!evt) {
      const err = new Error('Událost neexistuje');
      err.status = 404;
      err.code = '<gateway>/expense/create/eventNotFound';
      throw err;
    }
    const date = new Date(dtoIn.date);
    if (date > new Date()) {
      const err = new Error('Datum výdaje nesmí být v budoucnosti');
      err.status = 400;
      err.code = '<gateway>/expense/create/dateInFuture';
      throw err;
    }
    const existing = await Expense.find({ eventId: dtoIn.eventId });
    const used = existing.reduce((s, e) => s + e.amount, 0);
    const remaining = evt.budget - used;
    if (dtoIn.amount > remaining) {
      warnings.push({
        code: '<gateway>/expense/create/budgetExceeded',
        parameters: { budgetRemaining: remaining, requestedAmount: dtoIn.amount }
      });
    }
    const exp = await Expense.create({
      eventId: dtoIn.eventId,
      title: dtoIn.title,
      amount: dtoIn.amount,
      date
    });
    const result = exp.toObject();
    if (warnings.length) result.warnings = warnings;
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    if (!dtoIn.id) {
      const err = new Error('Chybějící klíč id');
      err.status = 400;
      err.code = '<gateway>/expense/get/dtoInIsNotValid';
      err.parameters = { missingKeyList: ['id'] };
      throw err;
    }
    const exp = await Expense.findById(dtoIn.id);
    if (!exp) {
      const err = new Error('Výdaj neexistuje');
      err.status = 404;
      err.code = '<gateway>/expense/get/expenseNotFound';
      throw err;
    }
    res.json(exp);
  } catch (err) {
    next(err);
  }
};

exports.listExpenses = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    if (!dtoIn.eventId) {
      const err = new Error('Chybějící klíč eventId');
      err.status = 400;
      err.code = '<gateway>/expense/list/dtoInIsNotValid';
      err.parameters = { missingKeyList: ['eventId'] };
      throw err;
    }
    const list = await Expense.find({ eventId: dtoIn.eventId });
    res.json({ itemList: list });
  } catch (err) {
    next(err);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    const allowed = ['id','title','amount','date'];
    const unsupported = findUnsupportedKeys(dtoIn, allowed);
    const warnings = [];
    if (unsupported.length) warnings.push({ code: '<gateway>/expense/update/unsupportedKeys', parameters: { unsupportedKeyList: unsupported } });
    if (!dtoIn.id) {
      const err = new Error('Chybějící klíč id'); err.status = 400; err.code = '<gateway>/expense/update/dtoInIsNotValid'; err.parameters = { missingKeyList: ['id'] }; throw err;
    }
    const exp = await Expense.findById(dtoIn.id);
    if (!exp) { const err = new Error('Výdaj neexistuje'); err.status = 404; err.code = '<gateway>/expense/update/expenseNotFound'; throw err; }
    if (dtoIn.date) {
      const d = new Date(dtoIn.date);
      if (d > new Date()) { const err = new Error('Datum nesmí být v budoucnosti'); err.status = 400; err.code = '<gateway>/expense/update/dateInFuture'; throw err; }
      exp.date = d;
    }
    if (dtoIn.title) exp.title = dtoIn.title;
    if (dtoIn.amount != null) exp.amount = dtoIn.amount;
    await exp.save();
    const result = exp.toObject(); if (warnings.length) result.warnings = warnings;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.removeExpense = async (req, res, next) => {
  try {
    const dtoIn = req.body;
    if (!dtoIn.id) {
      const err = new Error('Chybějící klíč id');
      err.status = 400;
      err.code = '<gateway>/expense/remove/dtoInIsNotValid';
      err.parameters = { missingKeyList: ['id'] };
      throw err;
    }
    const exp = await Expense.findById(dtoIn.id);
    if (!exp) {
      const err = new Error('Výdaj neexistuje');
      err.status = 404;
      err.code = '<gateway>/expense/remove/expenseNotFound';
      throw err;
    }
    await Expense.deleteOne({ _id: dtoIn.id });
    res.json({});
  } catch (err) {
    next(err);
  }
};
