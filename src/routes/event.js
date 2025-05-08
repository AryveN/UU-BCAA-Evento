const express      = require('express');
const router       = express.Router();
const validate     = require('../middleware/validate');
const eventSchema  = require('../schemas/event.schema');
// Partial update schema for event
const eventUpdateSchema = {
  type: 'object',
  properties: {
    id:          { type: 'string' },
    name:        { type: 'string', maxLength: 200 },
    date:        { type: 'string', format: 'date-time' },
    location:    { type: 'string' },
    description: { type: 'string' },
    budget:      { type: 'number', minimum: 0 }
  },
  required: ['id'],
  additionalProperties: false
};

const ctrl = require('../controllers/eventController');

// CREATE
router.post(
  '/create',
  validate(eventSchema),
  ctrl.createEvent
);

// GET
router.post(
  '/get',
  validate(
    { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false }
  ),
  ctrl.getEvent
);

// LIST
router.post(
  '/list',
  validate(
    { type: 'object', properties: { dateFrom: { type: 'string', format: 'date-time' }, dateTo: { type: 'string', format: 'date-time' } }, required: [], additionalProperties: false }
  ),
  ctrl.listEvents
);

// UPDATE
router.put(
  '/update',
  validate(eventUpdateSchema),
  ctrl.updateEvent
);

// REMOVE
router.delete(
  '/remove',
  validate(
    { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false }
  ),
  ctrl.removeEvent
);

// ADDGUEST
router.post(
  '/addGuest',
  validate(
    { type: 'object', properties: { id: { type: 'string' }, email: { type: 'string', format: 'email' } }, required: ['id','email'], additionalProperties: false },
    '<gateway>/event/addGuest'
  ),
  ctrl.addGuest
);

// LISTGUESTS
router.post(
  '/listGuests',
  validate(
    { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false },
    '<gateway>/event/listGuests'
  ),
  ctrl.listGuests
);

module.exports = router;
