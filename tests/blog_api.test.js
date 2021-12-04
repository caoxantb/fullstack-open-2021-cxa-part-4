const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const helper = require("./blog_helper.test");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const token = jwt.sign(
  { username: "caoxantb", id: "61aae622438776f3c3689387" },
  process.env.SECRET,
  {
    expiresIn: 60 * 60 * 24 * 7,
  }
);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.testBlog.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  expect(response.body).toHaveLength(helper.testBlog.length);
});

test("the unique identifier is named 'id', not '_id'", async () => {
  const response = await api.get("/api/blogs");
  response.body.map((r) => expect(r.id).toBeDefined());
});

test("blog without authorization cannot be added", async () => {
  const newBlog = {
    title: "hi",
    author: "whatever",
    url: "bruh",
    likes: 104,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "hi",
    author: "whatever",
    url: "bruh",
    likes: 104,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .set("Authorization", "Bearer " + token)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const titles = response.body.map((r) => r.title);

  expect(response.body).toHaveLength(helper.testBlog.length + 1);
  expect(titles).toContain("hi");
});

// test("default value of likes is 0 if the property is missing", async () => {
//   const newBlog = {
//     title: "hi",
//     author: "whatever",
//     url: "bruh",
//   };

//   await api
//     .post("/api/blogs")
//     .send(newBlog)
//     .expect(201)
//     .expect("Content-Type", /application\/json/);

//   const response = await api.get("/api/blogs");

//   expect(response.body).toHaveLength(helper.testBlog.length + 1);
//   expect(response.body[response.body.length - 1].likes).toEqual(0);
// });

// test("missing title and url", async () => {
//   const newBlog = {
//     author: "whatever",
//   };

//   await api.post("/api/blogs").send(newBlog).expect(400);

//   const response = await api.get("/api/blogs");

//   expect(response.body).toHaveLength(helper.testBlog.length);
// });

afterAll(() => {
  mongoose.connection.close();
});
