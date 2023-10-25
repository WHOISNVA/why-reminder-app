const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Post = require('./models/Post');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://nova-admin:NoVA2016@cluster0.fqsbkrs.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// ========== User Routes ==========
// Create a new user
app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// ========== Post Routes ==========

// Create a new post
app.post('/posts', async (req, res) => {
    try {
      const newPost = new Post(req.body);
      const savedPost = await newPost.save();
      res.json(savedPost);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Get all posts
  app.get('/posts', async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Get a single post by ID
  app.get('/posts/:id', async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.json(post);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Update a post by ID
  app.put('/posts/:id', async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Delete a post by ID
  app.delete('/posts/:id', async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (err) {
      res.status(400).json(err);
    }
  });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
