const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/quizzes', {
  useNewUrlParser: true
});


// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer')
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

const itemSchema = new mongoose.Schema({
  title: String,
  path: String,
  text: String,
  link: String
});

const questionSchema = new mongoose.Schema({
  tile: String,
  answer: String,
  text: String
});

const accountSchema = new mongoose.Schema({
  username: String,
  quizzesTaken: Number,
  pointsEarned: Number,
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);
const Account = mongoose.model('Account', accountSchema);
const Question = mongoose.model('Question', questionSchema);


app.post('/api/photos', upload.single('photo'), async (req, res) => {
  // Just a safety check
  if (!req.file) {
    return res.sendStatus(400);
  }
  res.send({
    path: "/images/" + req.file.filename
  });
});


// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/items', async (req, res) => {
  const item = new Item({
    title: req.body.title,
    path: req.body.path,
    text: req.body.text,
    link: req.body.link
  });
  try {
    console.log(item);
    await item.save();
    res.send(item);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/items', async (req, res) => {
  try {
    let items = await Item.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/questions/:tile', async (req, res) => {
  try {
    let items = await Question.find({tile: req.params.tile});
    console.log(req.params)
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/account/:username', async (req, res) => {
  Account.findOne({username: req.params.username}, (err, item) => {
    res.send(item);
  })
});

app.post('/api/account', async (req, res) => {
  console.log(req.body);
  const account = new Account({
    username: req.body.username,
    quizzesTaken: 1,
    pointsEarned: 1,
  });
  try {
    console.log(account);
    await account.save();
    res.send(account);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/account', async (req, res) => {
  Account.findOne({username: req.body.username}).then((result)=> {
    console.log(req.body.quizzesTaken)
    console.log(req.body.username)
    result.quizzesTaken = req.body.quizzesTaken
    result.pointsEarned = req.body.pointsEarned
    const account = new Account({
      username: req.body.username,
      quizzesTaken: req.body.quizzesTaken,
      pointsEarned: req.body.pointsEarned,
    });
    // let item: Item
    Account.deleteOne({username: req.body.username}).then(()=> {
      }).catch(error => {
        console.log(error);
      });
    account.save();
  })
})

app.post('/api/question', async (req, res) => {
  console.log(req.body.tile);
  const account = new Question({
    tile: req.body.tile,
    answer: req.body.answer,
    text: req.body.text,
  });
  try {
    console.log(account);
    await account.save();
    res.send(account);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});






app.delete('/api/items/:_id', async (req, res) => {
  console.log(req.params._id)
    await Item.deleteOne({_id: req.params._id}).then(()=> {
      res.sendStatus(200);
    }).catch(error => {
      console.log(error);
      res.sendStatus(500);
    });
});

app.put('/api/items/:_id', async (req, res) => {
  Item.findOne({_id: req.params._id}).then((result)=> {
    const item = new Item({
      title: req.body.title,
      path: result.path,
      text: req.body.text,
      link: req.body.link
    });
    Item.deleteOne({_id: req.params._id}).then(()=> {
    }).catch(error => {
      console.log(error);
    });
    item.save();
  })
})





//User.deleteOne({ age: { $gte: 10 } }).then(function(){
//   console.log("Data deleted"); // Success
// }).catch(function(error){
//     console.log(error); // Failure
// });

app.listen(3001, () => console.log('Server listening on port 3001'));
