const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const LogInCollection = require("./mongo")
app.set('view engine', 'ejs');
app.set('views', './view'); // Corrected path to your views directory
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
// Define routes
app.get('/', (req, res) => {
  res.render('home'); // Renders views/home.ejs
});
app.get('/signin', (req, res) => {
  res.render('sign_in'); // Renders views/signin.ejs
});

app.get('/forget', (req, res) => {
  res.render('forgotpass'); // Renders views/forgotpass.ejs
});
app.get('/main', (req, res) => {
  res.render('main'); // Renders views/main.ejs
});
app.get('/signup', (req, res) => {
  res.render('sign_up'); // Renders views/signup.ejs
});
app.post('/signup', async (req, res) => {
    
  const data = {
      fullname: req.body.fullname,
      username: req.body.username,
      password: req.body.password
  }

  try {
    const checking = await LogInCollection.findOne({ username: req.body.username });

    if (checking) {
      // User already exists
      res.send("User details already exist");
    } else {
      // User doesn't exist, insert new user data
      await LogInCollection.create(req.body);
      res.status(201).render("main", { naming: req.body.username });
    }
  } catch (error) {
    console.error(error);
    res.send("An error occurred");
  }
});

app.post('/signin', async (req, res) => {

  try {
      const check = await LogInCollection.findOne({ username: req.body.username })

      if (check.password === req.body.password) {
          res.status(201).render("main", { naming: `${req.body.password}+${req.body.username}` })
      }

      else {
          res.send("incorrect password")
      }


  } 
  
  catch (e) {

      res.send("wrong details")
      

  }


})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
