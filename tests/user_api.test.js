const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./user_helper.test");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");

beforeEach(async () => {
  await User.deleteMany({});

  const userObjects = helper.testUser.map((user) => new User(user));
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
});

test("users are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all users are returned", async () => {
  const response = await api.get("/api/users");

  expect(response.body).toHaveLength(helper.testUser.length);
});

test("a valid user can be added", async () => {
  const newUser = {
    username: "abc",
    name: "sththt",
    password: "stthht",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/users");
  console.log(response);

  const username = response.body.map((r) => r.username);

  expect(response.body).toHaveLength(helper.testUser.length + 1);
  expect(username).toContain("abc");
});

test("username has fewer than 3 charachers", async () => {
  const newUser = {
    username: "ab",
    name: "sththt",
    password: "stthht",
  };
  await api.post("/api/users").send(newUser).expect(400);

  const response = await api.get("/api/users");

  expect(response.body).toHaveLength(helper.testUser.length);
});

test("password has fewer than 3 charachers", async () => {
  const newUser = {
    username: "abcde",
    name: "sththt",
    password: "st",
  };

  await api.post("/api/users").send(newUser).expect(400);

  const response = await api.get("/api/users");

  expect(response.body).toHaveLength(helper.testUser.length);
});

afterAll(() => {
  mongoose.connection.close();
});
