const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

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

/* 
TODO
Ha id på rummet så man kan ha flera unika rum
*/
app.get('/room', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/room.html'));
});

app.get('/select', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/select.html'));
});

app.get('/testroom', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/test-room.html'));
});

const usersRouter = require('./routes/users')
app.use('/user', usersRouter)

app.get('/api/config', (req, res) => {
  res.json({ apiUrl, port });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
