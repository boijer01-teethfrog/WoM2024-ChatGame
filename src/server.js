const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//man hamnar på loginpage som första
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/user/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.get('/user/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

const usersRouter = require('./routes/users')
app.use('/user', usersRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
