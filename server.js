// run server typing "node server.js" in your terminal when in this directory 
// open the website by typing localhost:3000 on browser
// every time you change code you need to relaunch the server 
// to get around it you can type in "sudo npm install -g nodemon"
// than to run the server you can say nodemon server.js instead of node server.js

//database methods 






const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER, 
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getUsers(){
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}
 async function getUser(username){
    const [rows]= await pool.query('SELECT * FROM users WHERE username = ? ', [username])
    return rows;
}
async function createUser(username, password, fullName, add1, add2, city, state, zip, info_complete){
    const result = await pool.query('INSERT INTO users (username, password, fullName, address1, address2, city, state, zip, info_complete )VALUES (?,?,?,?,?,?,?,?,?)', [username, password, fullName, add1, add2, city, state, zip, info_complete])
    return result;
}

// to use for the middle page where user is mandatory completing profile
async function updateUser(username,fullName, add1, add2, city, state, zip, info_complete){
  const result = await pool.query('UPDATE users SET fullName= ?, address1 = ? , address2 = ?, city = ? , state = ?, zip = ?, info_complete = ? WHERE username = ? ', [fullName, add1, add2, city, state, zip, info_complete, username])
  return result;
}

// get all user quotes for a username
async function getUserQuotes(username){
  const [rows] = await pool.query('SELECT * FROM quotes WHERE user_id=?', [username])
  return rows;
}

// add a new quote for a username
async function addQuote(user_id, gallons, address, date, suggested_price, total_amount_due){
  const result = await pool.query('INSERT INTO quotes (user_id, gallons, address, date, suggested_price, total_amount_due ) VALUES (?,?,?,?,?,?)', [user_id, gallons, address, date, suggested_price, total_amount_due])
  return result;
}
async function getUserQuotesDate(username){
  const [rows] = await pool.query('SELECT DATE(date) FROM quotes WHERE user_id=?', [username])
  return rows;
}


// testing methods made - ojas
// const user1 = await getUser('fakeuser');
// console.log(user1);
// const result = await createUser('newuser2','pass', '123 ln', 'apt12', 'houston','TX', '75025', '1');
// console.log(result);
// const users = await getUsers()
// console.log(users);
// const quote = getUserQuotes('fakeuser')
// console.log(quote);





// how to use methods 
// app.get('/testdb', async (req, res) => {
//   const users = await getUsers()
//   res.send(users);
// });



// end database 

const express = require('express');
var bodyParser = require('body-parser')
let alert = require('alert'); 
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// so that the css file is sent to the front end aswell
app.use(express.static(__dirname + '/public/'));
// port we are using 
const port = 8080;
// global variables
let logged_in = false; // tracks if user is logged in or not 
let curr_user = { // get from data base and store in here for easy access
    fname:'',
    username:'',
    add: '',
    add2: '',
    zip: '',
    city:'',
    state: '',
    info_completed: false,
    user_history:[]
  };




// dummy database (fake data base)
var db_username = "john.doe";
var db_add1 = "3100 university dr";
var db_add2 = "apt 1234";
var db_city= "houston";
var db_state = "Texas";
var db_zip = 75078;
var db_quote_arr= [512,432,234,654,677];
var db_password = "1234";
var db_info_completed = false;
// end of fake database 

// '/' is the default route when someone opens the website on local port 3000
app.get('/', (req, res) => {
  res.sendFile(__dirname+ "/index.html");
});

// THIS IS HOW YOU USE DATABASE METHODS FROM DATABASE.JS MAKE SURE TO ADD THEM TO THE IMPORT STATEMENT UP TOP FIRST
app.get('/testdb', async (req, res) => {
  // const user1 = await getUser('fakeuser');
// console.log(user1);
// const result = await createUser('newuser2','pass', '123 ln', 'apt12', 'houston','TX', '75025', '1');
// console.log(result);
// const users = await getUsers()
// console.log(users);
// const quote = getUserQuotes('fakeuser')
// console.log(quote);
  // const quote = await getUserQuotes('fakeuser')
  // console.log(quote);
  const quote = await addQuote('fakeuser', '60', '1232423 ln', '2008-11-11', '25','30000');
  console.log(quote);
  const quotes = await getUserQuotes('fakeuser')
  console.log(quotes);
});

// registration form 
app.post('/reg', async (req, res) => {
    
	const username = req.body.username;
    const password = req.body.pass;

  console.log(username);
  console.log(password);
    
  const userExists = await getUser(username);
  if (userExists[0]) {
      // User already exists
      alert('Username already exists');
      res.redirect('/');
  } else {
      // Create new user and log in
      curr_user.username = username;
      // Add user to the database
       await createUser(username, password, '', '', '', '', '', '', '0');
      
      res.redirect('/profile');
  }
    
});


// profile management page 
app.get('/profile', (req, res) => {
    // check if user info is complete from database
    if (db_info_completed){
        res.redirect('/user');
    }
    else{
        res.sendFile(__dirname+ "/profile_manage.html");
        
    }
    
  });

  app.post('/profile', async (req, res) => {
    const fname = req.body.fullname;
    const taddress1 = req.body.address1;
    const taddress2 = req.body.address2;
    const zip = req.body.zipcode;
    const city = req.body.city;
    const state = req.body.state;

    // set current cliant infotmation 
    curr_user.fname = fname;
    curr_user.add = taddress1;
        curr_user.add2 = taddress2;
        curr_user.city = city;
        curr_user.state = state;
        curr_user.zip = zip;
        //curr_user.info_completed = true;
        curr_user.user_history = [];
    


    if (fname && taddress1 && zip && city && state) { // Check if all required fields are present
    curr_user.info_completed = true;

    //console.log(curr_user);
    await updateUser(curr_user.username, curr_user.fname, curr_user.add, curr_user.add2, curr_user.city, curr_user.state, curr_user.zip, curr_user.info_completed, curr_user.username);
    allusers = await getUsers();
    console.log(allusers);
    logged_in = true;
    res.redirect('/user');
  } else {
    // Inform user that all required fields are not present
    res.send('Please fill in all required fields');
  }
});


let tclientProfile = {
  deliveryAddress: 'Address placeholder',
  gallonsRequested: 0,
  deliveryDate: '',
  suggestedPrice: 0,
  totalAmountDue: 0
};

//fuel quote
app.post('/fuelQuote', async (req, res) => {
  console.log('app.post route called'); // debugging statement
  const { gallonsRequested, deliveryDate } = req.body;
  //let gallonsRequested = req.body.gallonsRequested;
  //let deliveryDate = req.body.deliveryDate;

  //const gallonsRequested = 10;
  //const deliveryDate = '2023-01-01';
  // Validate gallonsRequested and deliveryDate
  if (!gallonsRequested || isNaN(gallonsRequested)) {
    return res.status(400).send('Gallons Requested must be a number');
  }
  
  if (!deliveryDate || !/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
    return res.status(400).send('Delivery Date must be in YYYY-MM-DD format');
  }
  
  
  const deliveryAddress = curr_user.add;
  const suggestedPrice = 2.50;
  const totalAmountDue = gallonsRequested * suggestedPrice;

  //   const dateParts = deliveryDate.split('-');
  // const year = parseInt(dateParts[0]);
  // const month = parseInt(dateParts[1]) - 1; // JS months are zero-based
  // const day = parseInt(dateParts[2]);
  // const dateObj = new Date(year+"-"+ month+"-"+ day);
  console.log(deliveryDate);
  tclientProfile = {
    gallonsRequested,
    deliveryAddress,
    deliveryDate,
    suggestedPrice,
    totalAmountDue
  };
  console.log(deliveryDate); // debugging statement

try {
    await addQuote(curr_user.username, gallonsRequested, deliveryAddress, deliveryDate, suggestedPrice, totalAmountDue);
    dbhistory = await getUserQuotes(curr_user.username);
    console.log(dbhistory);
    curr_user.user_history = dbhistory;
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }

});


// REMOVE THIS WHEN IMPLEMENTING SECOND PAGE| THIS IS ONLY FOR TESTING
// USERS SHOULD NOT HAVE DIRECT ACCESS TO SECOND PAGE
app.get('/user', (req, res) => {
    if (logged_in) {
        MyObject.load_second_page(res);
    } else {
        res.redirect('/');
    }
  });
// END OF REMOVE 


// methods 
MyObject = {
    // display second page with edited information 
    load_second_page: function(res) { 
        // get values from database for history
        app.set('view engine', 'ejs');
        // console.log(curr_user.user_history.length);
        // var lann = curr_user.user_history.length;
        
        // for(var i=0; i<lann; i++){
        //   curr_user.user_history[i].date = curr_user.user_history[i].date[1];
        //   console.log("got herer");
        // }
        res.render('index2', {
            // for display user info
            curr_user: curr_user,
            // for diaplay quote history 
            history: curr_user.user_history,
            tclientProfile: tclientProfile
        })
        
    },
    
    // other functions...
}

const statesList = [
'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

// Client form fields validation

const validateClientForm = (req, res, next) => {
const { fullName, address1, city, state, zipcode } = req.body;
let { address2 } = req.body;

// Check required fields
if (!fullName || !address1 || !city || !state || !zipcode) {
return res.status(400).json({ msg: 'Please fill in all required fields' });
}

// Check field lengths
if (fullName.length > 50) {
return res.status(400).json({ msg: 'Full name must be less than 50 characters' });
}
if (address1.length > 100) {
return res.status(400).json({ msg: 'Address 1 must be less than 100 characters' });
}
if (address2 && address2.length > 100) {
return res.status(400).json({ msg: 'Address 2 must be less than 100 characters' });
}
if (city.length > 100) {
return res.status(400).json({ msg: 'City must be less than 100 characters' });
}
if (!state.match(/^[a-zA-Z]{2}$/)) {
return res.status(400).json({ msg: 'State must be a 2 character code' });
}
if (!zipcode.match(/^\d{5}(-\d{4})?$/)) {
return res.status(400).json({ msg: 'Zipcode must be a 5 or 9 digit code' });
}

// Pass validation
next();
};

// Client form route
app.post('/client-form', validateClientForm, (req, res) => {

// Handle form submission
const { fullName, address1, address2, city, state, zipcode } = req.body;
  
// Store client information in database or do further processing
res.send('Form submitted successfully!');

});

//login route
//login route
const bcrypt = require('bcrypt');
app.post('/login', async (req, res) => {
  const username = req.body.usernameInput;
  const password = req.body.passwordInput;

  try {
    // Get the user from the database based on the entered username
    const user = await getUser(username);
    // If no user is found, return an error message
    if (!user[0]) {
      alert('Username not found please navigate back to website');
      return res.status(400).send('Invalid username');
    }

    // Compare the entered password with the hashed password stored in the database
    //const passwordMatches = await bcrypt.compare(password, user.password);
    // If the passwords match, set the current user and redirect to the profile page
    if (password === user[0].password) {
      logged_in = true;
      curr_user.username = user[0].username;
      curr_user.fname = user[0].fullName;
      curr_user.add = user[0].address1;
      curr_user.add2 = user[0].address2;;
      curr_user.city = user[0].city;
      curr_user.state = user[0].state;
      curr_user.zip = user[0].zip;
      curr_user.info_completed = user[0].info_complete;
      dbhistory = await getUserQuotes(curr_user.username);
      curr_user.user_history = dbhistory;
      
      if(user[0].info_complete == true){
        console.log("current user info is complete");
        res.redirect('/user');
      }
      else{
        console.log("current user info is not complete");
        res.sendFile(__dirname+ "/profile_manage.html");
      }
      
    } else {
      return res.status(400).send('Invalid password please navigate back to home');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
  //check if username exists in databasem if true, check if pw matches
  //if both conditions are met, set curr_user and logged_in to true and redirect to second page
});



/*
app.get('/client/:id',(req, res) => {
  const clientId = req.params.id;
  //link to database to look up client info

  const tempClientData = {
    name: db_username,
    address: db_add1,
    address2: db_add2,
    city: db_city,
    state: db_state,
    zipcode: db_zip
  };
  res.json(tempClientData);
});
*/

app.post('/logout', (req, res) => {
// clear the user session data and set the logged_in flag to false
curr_user = {};
logged_in = false;
// redirect the user to the home page
res.redirect('/');
});





// console log that you started the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});