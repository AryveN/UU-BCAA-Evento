module.exports = {
    type: "object",
    properties: {
      eventId: { type: "string" },
      title:   { type: "string", maxLength: 200 },
      amount:  { type: "number", minimum: 0.01 },
      date:    { type: "string", format: "date-time" }
    },
    required: ["eventId","title","amount","date"],
    additionalProperties: false
  };
  