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
const Review = require("./models/Review");

require("dotenv").config();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET_TOKEN
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use(cookieParser())
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN_URL,
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("ok");
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData)
    })
  })

}

app.post("/register", async (req, res) => {
  const { name, email, photo, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      photo,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (err) {
    res.status(422).json(err);
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email })
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password)
      if (passOk) {
        jwt.sign({ email: userDoc.email, id: userDoc._id, name: userDoc.name, photo: userDoc.photo }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc)
        })

      } else {
        res.status(422).json('not ok password')
      }
    } else {
      res.status(404).json('not found')
    }
  } catch (err) {
    res.status(500).json('there was a server error')
  }
})

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, user) => {
      if (err) throw err;
      res.json(user)
    })
  } else {
    res.json(null)
  }
})

app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
  const { link } = req.body
  const newName = 'photo' + Date.now() + '.jpg'
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName
  })
  res.json(newName)
})

const photosMiddleware = multer({ dest: 'uploads' })
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = []
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i]
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace('uploads/', ''))
  }
  res.json(uploadedFiles)
})

app.post('/places', (req, res) => {
  const { token } = req.cookies;
  const { title, address, addedPhotos, description, placeType, perks, checkIn, checkOut, maxGuests, extraInfo, price } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) {
      console.log(err)
      throw err
    };
    const placeDoc = await Place.create({
      owner: userData.id, title, address, photos: addedPhotos, description, placeType, perks, extraInfo, checkIn, checkOut, maxGuests, price
    });
    res.status(200).json(placeDoc)
  })

})

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) console.log(err)
    const { id } = userData;
    res.json(await Place.find({ owner: id }))
  })
})

app.get('/places/:id', async (req, res) => {
  const { id } = req.params
  const placeById = await Place.findById(id)
  if (placeById) {
    let bookingsDate = []
    let reviewsByPlace = await Review.find({ place: id }).populate('user')
    let dateBookingsByPlace = await Booking.find({ place: id })
    if (dateBookingsByPlace && dateBookingsByPlace.length > 0) {
      dateBookingsByPlace.forEach(date => {
        const element = { start: date.checkIn.toDateString(), end: date.checkOut.toDateString() }
        bookingsDate.push(element)
      })
    }
    reviewsByPlace = reviewsByPlace && reviewsByPlace.length > 0 ? reviewsByPlace : []
    res.status(200).json({ placeById, reviews: reviewsByPlace, disabledDates: bookingsDate })
  } else {
    res.status(404).json('not found')
  }

})

app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const { id, title, address, addedPhotos, description, perks, checkIn, checkOut, maxGuests, extraInfo, price } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id)
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description, perks, checkIn, checkOut, maxGuests, extraInfo, price
      })
      await placeDoc.save();
      res.status(200).json('ok')
    }
  })
})

app.get('/places', async (req, res) => {
  res.json(await Place.find())
})

app.get('/placesByFilter/:id', async (req, res) => {
  const { id } = req.params
  res.json(await Place.find({ placeType: id === 'Hospedajes' ? 'H' : id === 'Atracciones' ? 'A' : 'S' }))
})

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req)
  let { checkIn, checkOut, place, numberOfGuests, name, phone, price, owner } = req.body
  try {
    const bookingDocument = await Booking.create({
      checkIn, checkOut, place, numberOfGuests, name, phone, user: userData.id, price, ownerUser: owner
    })
    res.json(bookingDocument)
  } catch (error) {
    res.json(error)
  }
})



app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req)
  res.json(await Booking.find({ user: userData.id }).populate('place'))
})

app.get('/bookingsByOwnUser', async (req, res) => {
  const userData = await getUserDataFromReq(req)
  const bookingData = await Booking.find({ ownerUser: userData.id }).populate('place')
  res.status(200).json(bookingData)
})

app.post('/review/:id', async (req, res) => {
  const userData = await getUserDataFromReq(req)
  const { id } = req.params
  const { title, content } = req.body
  const date = new Date()
  try {
    const reviewDocument = await Review.create({
      place: id, user: userData.id, title, content, datePost: date, score: 1
    })
    res.status(200).json(reviewDocument)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.delete('/bookings/:id', async (req, res) => {
  const userData = await getUserDataFromReq(req)
  const { id } = req.params
  try {
    await Booking.deleteOne({ _id: id, user: userData.id })
    res.status(200).json('Booking deleted')
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})
//GgRUf9Mm87RZ88KN

app.listen(8000);
