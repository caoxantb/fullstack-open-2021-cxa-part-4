require("dotenv").config();

const PORT = process.env.PORT || 3003;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://caoxantb:caoxuanan4869@blog-list.slnwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

module.exports = {
  MONGODB_URI,
  PORT,
};
