// run server typing "node server.js" in your terminal when in this directory 
// open the website by typing localhost:3000 on browser
// every time you change code you need to relaunch the server 
// to get around it you can type in "sudo npm install -g nodemon"
// than to run the server you can say nodemon server.js instead of node server.js
const express = require('express')
const app = express()
// so that the css file is sent to the front end aswell
app.use(express.static(__dirname + '/public/'));
// port we are using 
const port = 3000
// global variables
let logged_in = false; // tracks if user is logged in or not 
let curr_user = { // get from data base and store in here for easy access
    username:'',
    add: '',
    add2: '',
    zip: '',
    city:'',
    state: '',
    user_history:[],
  };




// dummy database (fake data base)
var db_username = "john.doe";
var db_add1 = "3100 university dr";
var db_add2 = "apt 1234";
var db_city= "houston";
var db_state = "Texas";
var db_zip = 75078;
var db_quote_arr= [512,432,234,654,677];
// end of fake database 

// '/' is the default route when someone opens the website on local port 3000
app.get('/', (req, res) => {
  res.sendFile(__dirname+ "/index.html")
})


// REMOVE THIS WHEN IMPLEMENTING SECOND PAGE| THIS IS ONLY FOR TESTING
// USERS SHOULD NOT HAVE DIRECT ACCESS TO SECOND PAGE
app.get('/user', (req, res) => {
    res.sendFile(__dirname+ "/index2.html")
  })
// END OF REMOVE 


// console log that you started the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})