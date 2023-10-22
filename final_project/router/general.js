const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (_req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (!book) {
    res.status(404).send({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  if (!author.length) {
    res.status(400).send({ message: "Author not specified" });
  }

  const filtered_books = [];
  for (const isbn of Object.keys(books)) {
    if (books[isbn].author === author) {
      filtered_books.push(books[isbn]);
    }
  }

  res.status(200).send(filtered_books);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  if (!title.length) {
    res.status(400).send({ message: "Title not specified" });
  }

  const filtered_books = [];
  for (const isbn of Object.keys(books)) {
    if (books[isbn].title === title) {
      filtered_books.push(books[isbn]);
    }
  }

  res.status(200).send(filtered_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
