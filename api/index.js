const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Place = require("./models/Place");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const Booking = require("./models/Booking");

require("dotenv").config();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asasadasdasdasdasd'
app.use(express.json());
app.use('/uploads', express.static(__dirname+'/uploads'))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log(1)
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  try{
    const userDoc = await User.findOne({email})
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password)
      if (passOk) {
        jwt.sign({email: userDoc.email, id: userDoc._id, name: userDoc.name}, jwtSecret, {}, (err, token)=> {
          if(err) throw err;
          res.cookie('token',token).json(userDoc)
        })
        
      } else {
        res.status(422).json('not ok password')
      }
    } else {
      res.json('not found')
    }
  }catch(err){

  }
})

app.get('/profile', (req, res) => {
  const {token} = req.cookies;
  if(token){
    jwt.verify(token, jwtSecret, {}, (err, user) => {
      if(err) throw err;
      res.json(user)
    })
  } else{
    res.json(null)
  }
})

app.post('/logout', (req, res) => {
  res.cookie('token','').json(true)
})

app.post('/upload-by-link', async(req, res) => {
  const {link} = req.body
  const newName = 'photo' + Date.now() + '.jpg'
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName
  })
  res.json(newName)
})

const photosMiddleware = multer({dest:'uploads'})
app.post('/upload', photosMiddleware.array('photos',100),(req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const {path, originalname} = req.files[i]
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace('uploads/',''))
  }
  res.json(uploadedFiles)
})

app.post('/places', (req, res) => {
  const {token} = req.cookies;
  const {title, address, addedPhotos, description, perks, checkIn, checkOut, maxGuests, extraInfo, price} = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if(err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,title, address, photos:addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.json(placeDoc)
  })
  
})

app.get('/user-places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json(await Place.find({owner:id}))
  })
})

app.get('/places/:id', async(req, res) => {
  const {id} = req.params
  res.json(await Place.findById(id))
})

app.put('/places', async(req, res) => {
  const {token} = req.cookies;
  const {id, title, address, addedPhotos, description, perks, checkIn, checkOut, maxGuests, extraInfo, price} = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if(err) throw err;
    const placeDoc = await Place.findById(id)
    if(userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos:addedPhotos, description, perks, checkIn, checkOut, maxGuests, extraInfo, price
      })
      await placeDoc.save();
      res.json('ok')
    }
  })
})

app.get('/places', async(req, res) => {
  res.json(await Place.find())
})

app.post('/bookings', async(req, res) => {
  const {checkIn, checkOut, place, numberOfGuests, name, phone} = req.body
  try{
    const bookingDocument = await Booking.create({
      checkIn, checkOut, place, numberOfGuests, name, phone
    })
    res.json(bookingDocument)
  }catch(error){
    res.json(error)
  }
})
//GgRUf9Mm87RZ88KN

app.listen(8000);
