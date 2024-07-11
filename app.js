const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/license.js'); // Assuming the schema is defined in userSchema.js

const app = express();

// Middleware to parse JSON bodies and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// To use public folder for all static resources
app.use(express.static('public'));

// Set the view engine as ejs for using ejs files
app.set('view engine', 'ejs');

// MongoDB connection string
const url = "mongodb+srv://ashnep93:admin@license.kxxauiw.mongodb.net/?retryWrites=true&w=majority&appName=License";
mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch(err => console.log(`Connection failed due to error below.\n${err}`));

const port = 4086; // Port number
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Route for rendering home.ejs file
app.get('/home', (req, res) => {
  res.render('home.ejs');
});

// Route for rendering g_page.ejs file
app.get('/g_page', (req, res) => {
  res.render('g_page.ejs', { user: null, message: null });
});

// Route for rendering g2.ejs file
app.get('/g2', (req, res) => {
  res.render('g2.ejs', { message: null }); // Ensure message is defined
});

// Route for rendering login.ejs file
app.get('/login', (req, res) => {
  res.render('login.ejs');
});

// POST request handler for /gpage
app.post('/gpage', async (req, res) => {
  const license_number = req.body.license_number;

  try {
    const user = await User.findOne({ 'car_details.licenseNo': license_number });

    if (user) {
      res.render('g_page', { user: user, message: null });
    } else {
      res.render('g_page', { user: null, message: 'No User Found' });
    }
  } catch (error) {
    console.log(`Error fetching user from MongoDB: ${error}`);
    res.render('g_page', { user: null, message: 'Internal Server Error' });
  }
});

// GET request handler for /gpage
app.get('/gpage', (req, res) => {
  res.render('g_page', { user: null, message: null });
});

// POST request handler for /g2 to save user data
app.post('/g2', async (req, res) => {
  const { firstname, lastname, license_number, age, make, model, year, plate_number } = req.body;

  const newCar = {
    licenseNo: license_number,
    make: make,
    model: model,
    year: year,
    platno: plate_number
  };

  try {
    let user = await User.findOne({ firstname, lastname });

    if (user) {
      user.car_details.push(newCar);
    } else {
      user = new User({
        firstname: firstname,
        lastname: lastname,
        age: age,
        car_details: [newCar]
      });
    }

    await user.save();
    res.render('g2', { message: 'User data saved successfully!' });
  } catch (error) {
    console.log(`Error saving user to MongoDB: ${error}`);
    res.render('g2', { message: 'Failed to save user data. Please try again.' });
  }
});

// POST request handler for updating car details
app.post('/update-car/:licenseNo', async (req, res) => {
  const licenseNo = req.params.licenseNo;
  const { make, model, year, plate_number } = req.body;

  try {
    const user = await User.findOne({ 'car_details.licenseNo': licenseNo });

    if (user) {
      const car = user.car_details.find(car => car.licenseNo === licenseNo);
      if (car) {
        car.make = make;
        car.model = model;
        car.year = year;
        car.platno = plate_number;
        await user.save();
        res.render('g_page', { user: user, message: 'Car details updated successfully!' });
      } else {
        res.render('g_page', { user: user, message: 'Car not found!' });
      }
    } else {
      res.render('g_page', { user: null, message: 'User not found!' });
    }
  } catch (error) {
    console.log(`Error updating car details in MongoDB: ${error}`);
    res.render('g_page', { user: null, message: 'Internal Server Error' });
  }
});
