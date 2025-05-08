module.exports = {
    type: "object",
    properties: {
      name:        { type: "string", maxLength: 200 },
      date:        { type: "string", format: "date-time" },
      location:    { type: "string" },
      description: { type: "string" },
      budget:      { type: "number", minimum: 0 }
    },
    required: ["name","date","location","budget"],
    additionalProperties: false
  };
  