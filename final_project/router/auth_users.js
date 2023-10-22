const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username?.length || !password?.length) {
    res
      .status(400)
      .send({ message: "Both username and password are required" });
    return;
  }

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (!user) {
    res.status(401).send({ message: "Invalid username and/or password" });
    return;
  }

  req.session.authorization = jwt.sign({ user: user }, "access");

  return res.status(200).send({
    message: "User has successfully logged in",
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.session.authorization;

  const verified = jwt.verify(token, "access");

  if (!verified?.user) {
    res.status(400).send({ message: "Forbidden" });
    return;
  }

  const isbn = req.params.isbn;
  if (!isbn?.length) {
    res.status(400).send({ message: "ISBN is required" });
    return;
  }

  const book = books[isbn];
  if (!book) {
    res.status(404).send({ message: "Book not found" });
    return;
  }

  const text = req.body.text;
  if (!text?.length) {
    res.status(400).send({ message: "Text is required" });
    return;
  }

  for (const review of Object.values(book.reviews)) {
    if (review.username === verified.user.username) {
      review.text = text;
      res.status(200).send({
        message: `Review for book with ISBN ${isbn} has been updated`,
      });
      return;
    }
  }

  const newId = (Object.keys(book.reviews).length || 0) + 1;

  book.reviews[newId] = {
    text,
    username: verified.user.username,
  };

  return res.status(200).send({
    message: `Review for book with ISBN ${isbn} has been created`,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.session.authorization;

  const verified = jwt.verify(token, "access");

  if (!verified?.user) {
    res.status(400).send({ message: "Forbidden" });
    return;
  }

  const isbn = req.params.isbn;
  if (!isbn?.length) {
    res.status(400).send({ message: "ISBN is required" });
    return;
  }

  const book = books[isbn];
  if (!book) {
    res.status(404).send({ message: "Book not found" });
    return;
  }

  const filtered_reviews = {};
  let currId = 1;
  for (const review of Object.values(book.reviews)) {
    if (review.username !== verified.user.username) {
      filtered_reviews[currId] = review;
    }
  }

  book.reviews = filtered_reviews;

  return res.status(200).send({
    message: `Reviews made by user for book with ISBN ${isbn} have been successfully deleted`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
