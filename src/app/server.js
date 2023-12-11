
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Post = require('./models/Posts');
const Cors = require('cors');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const auth = require("./middleware/auth");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(Cors());

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
app.post('/posts', auth, async (req, res) => {
    console.log('post data header:', req.header);
    console.log('post data body:', req.body);

    try {
      const newPost = new Post(req.body);
      const savedPost = await newPost.save();
      res.json(savedPost);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Get all posts
  app.get('/posts', auth, async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Get a single post by ID
  app.get('/posts/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.json(post);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Update a post by ID
  app.put('/posts/:id', auth, async (req, res) => {
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedPost);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  
  // Delete a post by ID
  app.delete('/posts/:id', auth, async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post deleted' });
    } catch (err) {
      res.status(400).json(err);
    }
  });

// ========== Login Actions ==========
  app.post('/login', async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
      
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      
      // Validate if user exist in our database
      const user = await User.findOne({ email });
      console.log('login email:'+email);
      console.log('login password:'+password);
      console.log(JSON.stringify(user));
      //if (user && (await bcrypt.compare(password, user.password))) {
      if (user && (password === user.password)) {
        
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        console.log('generated token:', token);
        
        // save user token
        let returnUserData = {
          _id: user.id,
          email: user.email,
          username: user.username,
          whiteboardname: user.whiteboardname,
          token
        };
        user.token = token;
        console.log('logined user:', JSON.stringify(returnUserData));
        // user
        res.status(200).json(returnUserData);
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
  });

  app.post('/logout', auth, async (req, res) => {
    res.status(200).send({status:'ok'});
  });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
