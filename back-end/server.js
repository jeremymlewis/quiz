const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/museum', {
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
});

// Create a model for items in the museum.
const Item = mongoose.model('Item', itemSchema);

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
    text: req.body.text
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

app.listen(3000, () => console.log('Server listening on port 3000!'));
