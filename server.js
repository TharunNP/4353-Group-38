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
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// so that the css file is sent to the front end aswell
app.use(express.static(__dirname + '/public/'));
// port we are using 
const port = 3000
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
var db_password = "1234"
var db_info_completed = false;
// end of fake database 

// '/' is the default route when someone opens the website on local port 3000
app.get('/', (req, res) => {
  res.sendFile(__dirname+ "/index.html");
})
// registration form 
app.post('/reg', (req, res) => {
    
	const username = req.body.username;
    const password = req.body.pass;
    
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
    
})
// profile management page 
app.get('/profile', (req, res) => {
    // check if user info is complete from database
    if (db_info_completed){
        res.redirect('/user');
    }
    else{
        res.sendFile(__dirname+ "/profile_manage.html");
        
    }
    
  })

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
})
  


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
        let history = curr_user.user_history;
        app.set('view engine', 'ejs');
        res.render('index2', {
            // for display user info
            curr_user: curr_user,
            // for diaplay quote history 
            history: history
        })
        
    },
    
    // other functions...
}
// console log that you started the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})