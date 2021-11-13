var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  return blogs.reduce((prev, curr) => prev + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
  return blogs.find((blog) => blog.likes === maxLikes);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};

  const countBlogsByAuthor = _.countBy(blogs, "author");
  return {
    author: _.maxBy(
      Object.keys(countBlogsByAuthor),
      (key) => countBlogsByAuthor[key]
    ),
    blogs: _.max(Object.values(countBlogsByAuthor)),
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};

  const groupByAuthors = _.groupBy(blogs, "author");
  const sumAuthorByLikes = Object.keys(groupByAuthors).map((key) => {
    return {
      author: key,
      likes: _.sumBy(groupByAuthors[key], "likes"),
    };
  });

  return _.maxBy(sumAuthorByLikes, "likes");
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
