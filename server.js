// run server typing "node server.js" in your terminal when in this directory 
// open the website by typing localhost:3000 on browser
// every time you change code you need to relaunch the server 
// to get around it you can type in "sudo npm install -g nodemon"
// than to run the server you can say nodemon server.js instead of node server.js
//import * as cheerio from 'cheerio';
const express = require('express')
var bodyParser = require('body-parser')
let alert = require('alert'); 
var app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
// so that the css file is sent to the front end aswell
app.use(express.static(__dirname + '/public/'));
// port we are using 
const port = 3000;
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
    user_history:[{ 
        gallons:0,
        add:"nothing st",
        date: "0/3/32",
        s_price: 43,
        total: 149
    },
    { 
        gallons:1,
        add:"nothing st",
        date: "0/3/32",
        s_price: 43,
        total: 149
    },
    { 
        gallons:2,
        add:"nothing st",
        date: "0/3/32",
        s_price: 43,
        total: 149
    }]
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

// registration form 
app.post('/reg', (req, res) => {
    
	const username = req.body.username;
    const password = req.body.pass;

  console.log(username);
  console.log(password);
    
    // check if username exists in database
        // todo
    //create new user and log in 
        // todo
    // temp sol
    if(username == db_username){
        alert("Username already exists");
        
    }
    else{
        curr_user.username = username;
        // add to database later 

        // redirect to profile management page 
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

// profile management form submit 
app.post('/profile', (req, res) => {
    const fname = req.body.fullname;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const zip = req.body.zipcode;
    const city = req.body.city;
    const state = req.body.state;

    // set current cliant infotmation 
    curr_user.fname = fname;
    curr_user.add = address1;
        curr_user.add2 = address2;
        curr_user.city = city;
        curr_user.state = state;
        curr_user.zip = zip;
        curr_user.info_completed = true;
        curr_user.user_history = [{ 
            gallons:0,
            add:"nothing st",
            date: "0/3/32",
            s_price: 43,
            total: 149
        },
        { 
            gallons:1,
            add:"nothing st",
            date: "0/3/32",
            s_price: 43,
            total: 149
        },
        { 
            gallons:2,
            add:"nothing st",
            date: "0/3/32",
            s_price: 43,
            total: 149
        }];
    console.log(curr_user);
    // save data into data base later
    //  db_username = "john.doe";
    //  db_add1 = "3100 university dr";
    // var db_add2 = "apt 1234";
    // var db_city= "houston";
    // var db_state = "Texas";
    // var db_zip = 75078;
   
    logged_in = true;
    res.redirect('/user');
});

let tclientProfile = {
  deliveryAddress: 'Address placeholder',
  gallonsRequested: 0,
  deliveryDate: '',
  suggestedPrice: 0,
  totalAmountDue: 0
};

//fuel quote
app.post('/fuelQuote', (req, res) => {
  console.log('app.post route called'); // debugging statement
  //const { gallonsRequested, deliveryDate } = req.body;
  //let gallonsRequested = req.body.gallonsRequested;
  //let deliveryDate = req.body.deliveryDate;

  const gallonsRequested = 10;
  const deliveryDate = '2023-01-01';
  // Validate gallonsRequested and deliveryDate
  if (!gallonsRequested || isNaN(gallonsRequested)) {
    return res.status(400).send('Gallons Requested must be a number');
  }
  
  if (!deliveryDate || !/^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)) {
    return res.status(400).send('Delivery Date must be in YYYY-MM-DD format');
  }
  
  
  const deliveryAddress = 'Address placeholder';
  const suggestedPrice = 2.50;
  const totalAmountDue = gallonsRequested * suggestedPrice;

    const dateParts = deliveryDate.split('-');
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // JS months are zero-based
  const day = parseInt(dateParts[2]);
  const dateObj = new Date(year, month, day);
  
  tclientProfile = {
    gallonsRequested,
    deliveryAddress,
    deliveryDate,
    suggestedPrice,
    totalAmountDue
  };

  console.log(tclientProfile); // debugging statement

  res.redirect('/user');
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
app.post('/login', (req, res) => {
  const username = req.body.usernameInput;
  const password = req.body.passwordInput;


  //check if username exists in databasem if true, check if pw matches
  //if both conditions are met, set curr_user and logged_in to true and redirect to second page
  if(username === db_username && password === db_password){
    curr_user.username = username;
    logged_in = true;
    
    res.redirect('/user');
  } else {
    console.log('Invalid login credentials.');
    res.send('Invalid login credentials.');
  }
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