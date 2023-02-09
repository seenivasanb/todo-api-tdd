var express = require("express");
var router = express.Router();
var path = require("path");
var fs = require("fs");

const filePath =
  process.env.NODE_ENV === "test" ? "./mock-todos.json" : "./todos.json";

const todosFilePath = path.join(__dirname, filePath);

const getTodos = () => {
  const data = fs.readFileSync(todosFilePath);
  return JSON.parse(data);
};

const setTodos = (todos) => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 0));
};

/* GET todos listing. */
router.get("/", function (req, res, next) {
  const todos = getTodos();
  res.status(200).json(todos);
});

// Get specific todo by ID
router.get("/:id", function (req, res, next) {
  const todos = getTodos();
  const fetchTodo = todos.find((todo) => todo.id === Number(req.params.id));
  if (fetchTodo) {
    res.status(200).json(fetchTodo);
  }
  res.status(404).send("Todo not found");
});

// Add new todo to the list
router.post("/", function (req, res, next) {
  try {
    const todos = getTodos();
    if (req.body.task && typeof req.body.task === "string") {
      const newTodo = {
        id: todos.length + 1,
        task: req.body.task,
        isCompleted: false,
      };

      todos.push(newTodo);
      setTodos(todos);
      return res.status(201).json(newTodo);
    }

    res.status(400).send("Invalid Task");
  } catch (error) {
    next(error);
  }
});

// Toggle todo status
router.put("/:id", function (req, res, next) {
  const todos = getTodos();
  const fetchTodo = todos.find((todo) => todo.id === Number(req?.params?.id));

  if (fetchTodo) {
    const updatedTodo = { ...fetchTodo, isCompleted: !fetchTodo.isCompleted };
    const updatedTodos = todos.map((todo) => {
      if (todo.id === updatedTodo.id) return updatedTodo;
      return todo;
    });
    setTodos(updatedTodos);
    return res.status(200).json(updatedTodo);
  }

  res.status(404).send("Todo not exists");
});

// Delete todo by id
router.delete("/:id", function (req, res, next) {
  const todos = getTodos();
  const fetchTodo = todos.find((todo) => todo.id === Number(req.params.id));
  if (fetchTodo) {
    const updatedTodos = todos.filter((todo) => todo.id !== fetchTodo.id);
    setTodos(updatedTodos);
    return res.status(200).send("Todo Deleted");
  }

  res.status(404).send("Todo not exists");
});

/* Reset test todos. */
router.post("/resetTestTodo", function (req, res, next) {
  if (process.env.NODE_ENV === "test") {
    setTodos([
      { id: 1, task: "Learn Express JS", isCompleted: false },
      { id: 2, task: "Learn Node JS", isCompleted: false },
    ]);
    return res.status(200).send("Reset Done");
  }
  res.status(404).send();
});

module.exports = router;
