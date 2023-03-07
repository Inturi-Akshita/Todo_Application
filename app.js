/* eslint-disable no-unused-vars */
const { request, response } = require("express");
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser"); // to read data from request.body (to look for todo title and duedate)
const path = require("path");

app.use(bodyParser.json());

// rendering engine
app.set("view engine", "ejs");

// Parent page
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
    });
  } else {
    response.json({
      allTodos,
    });
  }
});

app.use(express.static(path.join(__dirname, "public")));

// To print the list of todos
app.get("/todos", async (request, response) => {
  console.log("Todo list");
  // response.send("todoList");
  // const todoList = await Todo.findAll();

  // console.log(todoList.every((user) => user instanceof Todo));
  // console.log(todoList);
  // console.log("All users:", JSON.stringify(todoList, null, 2));
  // console.log(todoList.length);

  // return response.json(todoList);

  // return response.json(todoList.map(user => user = user + "\n"));

  // check to print then in separate line
  try {
    const todoList = await Todo.findAll();
    return response.send(todoList);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// route for creating a new todo
app.post("/todos", async (request, response) => {
  console.log("Creating a todo", request.body);
  // Todo

  try {
    // Creating a new method from sequelize
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });

    // to send the todo object back as a response
    return response.json(todo);
  } catch (error) {
    console.log(error);
    // 422 - unprocessable entity
    return response.status(422).json(error);
  }
});

// To mark as completed
app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log(request.params.id);
  console.log("We have to update a todo with ID:", request.params.id);

  // update a todo as markAsCompleted
  const todo = await Todo.findByPk(request.params.id);

  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// To delete a todo by its id
app.delete("/todos/:id/delete", async (request, response) => {
  console.log(request.params.id);
  const todo = await Todo.findByPk(request.params.id);

  // console.log("Delete a todo by ID: ", request.params.id);
  await Todo.destroy({
    where: {
      id: request.params.id,
    },
  });
  response.send("done");
});

module.exports = app;
