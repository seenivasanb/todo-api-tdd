const request = require("supertest");
const app = require("../app");

describe("Todo API Unit tests", () => {
  beforeAll(() => {
    process.env.NODE_ENV = "test";
  });

  afterAll(() => {
    process.env.NODE_ENV = "";
    (async () => {
      await request(app).post("/resetTestTodo");
    })();
  });

  describe("GET routes", () => {
    // GET all todos
    it("should return all the todos", async () => {
      await request(app)
        .get("/todos")
        .expect(200)
        .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                task: expect.any(String),
                isCompleted: expect.any(Boolean),
              }),
            ])
          );
        });
    });

    //   GET specific todo by ID
    it("should return a specific todo by ID", async () => {
      const res = await request(app)
        .get("/todos/1")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              task: expect.any(String),
              isCompleted: expect.any(Boolean),
            })
          );
        });
    });

    //   GET error for invalid ID
    it("should return 404 error for invalid ID", async () => {
      await request(app).get("/todos/999").expect(404).expect("Todo not found");
    });
  });

  describe("POST routes", () => {
    //   POST add new todo
    it("should add the given task to the todo list", async () => {
      await request(app)
        .post("/todos")
        .send({ task: "New Todo" })
        .expect(201)
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(Number),
              task: "New Todo",
              isCompleted: false,
            })
          );
        });
    });

    it("should return 400 for invalid task", async () => {
      await request(app)
        .post("/todos")
        .send({ task: 12345 })
        .expect(400)
        .expect("Invalid Task");
    });
  });

  describe("PUT routes", () => {
    //   PUT - update todo
    it("should return updated todo", async () => {
      await request(app)
        .put("/todos/1")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: 1,
              task: "Learn Express JS",
              isCompleted: true,
            })
          );
        });
    });

    //   PUT - return 404 for invalid todo update
    it("should return 404 for invalid todo ID for update", async () => {
      await request(app)
        .put("/todos/999")
        .expect(404)
        .expect("Todo not exists");
    });
  });

  describe("DELETE routes", () => {
    // DELETE - todo by ID

    it("should delete the specific todo by ID", async () => {
      await request(app).delete("/todos/2").expect(200).expect("Todo Deleted");
    });

    // DELETE - return error 404 with invalid todo ID
    it("should return error 404 with invalid todo ID", async () => {
      await request(app)
        .delete("/todos/999")
        .expect(404)
        .expect("Todo not exists");
    });
  });

  describe("Reset Test Todos", () => {
    // RESET TEST TODOs
    it("should reset all the todos", async () => {
      await request(app).post("/todos/resetTestTodo").expect(200);
    });
  });
});
