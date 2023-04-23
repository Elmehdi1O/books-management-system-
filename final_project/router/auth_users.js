const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 return !!users.filter(user => user.username == username).length
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return !!users.filter(user => user.username === username  && user.password === password).length
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) {
    return res.status(400).json({message: 'Please provide both username and password'})
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({message: "Invalid credentials"});
  }
  
  let accessToken = jwt.sign(
      { username, password}
    , 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken
  }
  return res.status(200).json({message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.user.username;
  
  if (!review || review.trim() === '') {
    return res.status(400).json({ message: 'Review cannot be empty'});
  }
  
  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found'});
  }
  
  
  books[isbn].reviews[username] = review;
  res.status(200).json( books);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Find the book with the provided ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Find the index of the review with the provided username
  const reviewIndex = book.reviews[username];

  if (!reviewIndex) {
    return res.status(404).json({ error: "Review not found" });
  }

  // Remove the review with the provided username
  book.reviews[username] = {}
  books[isbn] = book;

  // Save the updated books data to the file
  return res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
