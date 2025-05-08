const request = require("supertest");
const app     = require("../index"); // exportuj express app v index.js

describe("Event API", () => {
  test("POST /api/event/create – valid data", async () => {
    const resp = await request(app)
      .post("/api/event/create")
      .send({
        name: "Test E",
        date: "2025-07-01T12:00:00Z",
        location: "Praha",
        budget: 1000
      })
      .expect(201);
    expect(resp.body).toHaveProperty("_id");
    expect(resp.body.name).toBe("Test E");
  });

  test("POST /api/event/create – missing budget", async () => {
    const resp = await request(app)
      .post("/api/event/create")
      .send({
        name: "No budget",
        date: "2025-07-01T12:00:00Z",
        location: "Praha"
      })
      .expect(400);
    expect(resp.body.code).toMatch(/dtoInIsNotValid$/);
  });
});
