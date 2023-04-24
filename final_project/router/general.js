const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios =  require('axios');

const getBooks = async () => {
  try {
    const resp = await axios.get(`http://localhost:5000`)
    return resp.data;
  } catch (error) {
    return {error: `Unable to fetch books`};
  }}

const getBookByIsbn = async (isbn) => {
  try {
    const resp = await axios.get(`http://localhost:5000/isbn/${isbn}`)
    return resp.data;

  } catch (error) {
    return { message: `Unable to fetch book details for ISBN: ${isbn}`}
  }
}

const getBookByAuthor = async (author) => {
  try {
    const resp = await axios.get(`http://localhost:5000/author/${author}`);
    return resp.data;
  } catch (error) {
    return {error: `Unable to fetch book details for author: ${author}`};
  }
}

const getBookByTitle= async (title) => {
  try {
    return (await axios.get(`http://localhost:5000/title/${title}`)).data;
  } catch (error) {
    return {error: `Unable to fetch book details for title: ${title}`};

  }
}

public_users.get('/books', async function(req, res) {
  const books = await getBooks();
  res.send(books);
});

public_users.get('/books/isbn/:isbn', async function(req, res) {
  const isbn = req.params.isbn
  const book = await getBookByIsbn(isbn);
  res.send(book);
});

public_users.get('/books/author/:author', async function(req, res) {
  const author = req.params.author
  const book = await getBookByAuthor(author);
  res.send(book);
});

public_users.get('/books/title/:title', async function(req, res) {
  const title = req.params.title
  const book = await getBookByTitle(title);
  res.send(book);
});

public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) {
    return res.status(400).json({message: 'Please provide both username and password'})
  }
  if (isValid(username)) {
    return res.status(400).json({message: 'Username already exists'})
  }
  (users).push({ username, password})
  return res.status(201).send({ message: 'User registered successfully'})
});

// Get the book list available in the shop

public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn]));
  } else {
    res.status(404).send("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const result = [];
  const author = req.params.author;
  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
     if(book.author == author )
        result.push(book)
  })

  
  if (result.length > 0) {
    res.status(200).send(JSON.stringify(result));
  } else {
    res.status(404).send("No books found for author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const result = [];
  const title = req.params.title;
  Object.keys(books).forEach(isbn => {
    const book = books[isbn];
     if(book.title == title )
        result.push(book)
  })
  if (result.length > 0) {
    res.status(200).send(JSON.stringify(result));
  } else {
    res.status(404).send("No books found for author");
  }
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    if (books[isbn].reviews) {
      res.send(JSON.stringify(books[isbn].reviews));
    } else {
      res.status(404).send("No reviews found for book");
    }
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
