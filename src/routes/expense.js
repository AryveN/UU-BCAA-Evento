// src/routes/expense.js
const express       = require("express");
const router        = express.Router();
const validate      = require("../middleware/validate");
const expenseSchema = require("../schemas/expense.schema");
// Partial update schema:
const expenseUpdateSchema = {
  type: "object",
  properties: {
    id:     { type: "string" },
    title:  { type: "string", maxLength: 200 },
    amount: { type: "number", minimum: 0.01 },
    date:   { type: "string", format: "date-time" }
  },
  required: ["id"],
  additionalProperties: false
};

const ctrl = require("../controllers/expenseController");

router.post(  
  "/create",
  validate(expenseSchema),
  ctrl.createExpense
);

router.post(
  "/get",
  validate({ type:"object", properties:{ id:{type:"string"} }, required:["id"], additionalProperties:false }),
  ctrl.getExpense
);

router.post(
  "/list",
  validate({ type:"object", properties:{ eventId:{type:"string"} }, required:["eventId"], additionalProperties:false }),
  ctrl.listExpenses
);

router.put(
  "/update",
  validate(expenseUpdateSchema),
  ctrl.updateExpense
);

router.delete(
  "/remove",
  validate({ type:"object", properties:{ id:{type:"string"} }, required:["id"], additionalProperties:false }),
  ctrl.removeExpense
);

module.exports = router;
