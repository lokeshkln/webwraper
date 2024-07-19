const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

// In-memory data store
const users = {
    'user1': 'password1',
    'user2': 'password2',
    'developer1': 'devpassword1',
    'admin': 'adminpassword'
};

let posts = [];
let nextPostId = 1;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    const { userId, password } = req.body;
    if (users[userId] && users[userId] === password) {
        if (userId === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/home');
        }
    } else {
        res.send('<h1>Invalid ID or Password</h1><p><a href="/">Try Again</a></p>');
    }
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/main.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// CRUD operations for posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const { title, content, tags } = req.body;
    const newPost = { id: nextPostId++, title, content, tags };
    posts.push(newPost);
    res.status(201).json(newPost);
});

app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    posts = posts.filter(post => post.id !== parseInt(id));
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});