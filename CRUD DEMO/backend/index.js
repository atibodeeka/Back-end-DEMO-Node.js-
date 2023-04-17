const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'book'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected');
});

app.post('/admin', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required.' });
    return;
  }
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ message: 'Login successful.' });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' });
    }
  });
});


app.post('/login', (req, res) => {
  const {username} = req.body;
  if (!username) {
    res.status(400).json({ message: 'Phone number are required.' });
    return;
  }
  const sql = 'SELECT * FROM customers WHERE Phone = ?';
  db.query(sql, [username], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ message: 'Login successful.' });
    } else {
      res.status(401).json({ message: 'Invalid Phone number' });
    }
  });
});

app.get('/search_cate', (req, res) => {
  const {category} = req.body;
  const sql = 'SELECT * FROM books WHERE Category = ?';
  db.query(sql, [category], (err, result) => {
    if (err) throw err;
    
    if (result.length === 0) {
      res.status(404).send('No books found in this category...');
    } else {
      res.send(result);
    }
  });
});

app.get('/update', (req, res) => {
  db.query('UPDATE `books` SET `Title`="English Every Month",`Author`="Kenov Vadowfski" WHERE BookID = "0"', (err, result, fields) => {
    if (err) throw err;
    
    if (result.length === 0) {
      res.status(404).send('Can not update book...');
    } else {
      res.json({ message: 'Update successful.' });

    }
    });
});

app.get('/book_info', (req, res) => {
  const {title} = req.body;
  const sql = 'SELECT * FROM books WHERE Title = ?';
  db.query(sql, [title], (err, result) => {
    if (err) throw err;
    
    if (result.length === 0) {
      res.status(404).send('No books found...');
    } else {
      res.send(result);
    }
  });
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })