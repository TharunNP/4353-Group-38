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
const bcrypt = require ('bcrypt');
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

// '/' is the default route when someone opens the website on local port 3000
app.get('/', (req, res) => {
  res.sendFile(__dirname+ "/index.html");
});

// registration form 
app.post('/reg', async (req, res) => {
  MyObject.reg_action(req,res);
});


// profile management page 
app.get('/profile', (req, res) => {
    // check if user info is complete from database
    MyObject.profile_get_action(res);
    
});

app.post('/profile', async (req, res) => {
    MyObject.profile_post_action(req, res);
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
  margin = 1.1;
  if(curr_user.state === 'TX'){
    margin += 0.02;
    console.log("Texas user, adding 0.02 to margin");
  }
  else{
    margin += 0.04;
    console.log("Non-Texas user, adding 0.04 to margin");
  }

  if(gallonsRequested > 1000){
    margin += 0.02;
    console.log("Gallons requested > 1000, adding 0.02 to margin");
  }
  else{
    margin += 0.03;
    console.log("Gallons requested <= 1000, adding 0.03 to margin");
  }

  
  if(curr_user.newClient === false){
    margin -= 0.01;
    console.log("User has history, subtracting 0.01 from margin");
  }
  else{
    console.log("User has no history, no change to margin");
  }
  
  const suggestedPrice = parseFloat((1.50 * margin).toFixed(2));
  const totalAmountDue = parseFloat((gallonsRequested * suggestedPrice).toFixed(2));

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

try {
    await addQuote(curr_user.username, gallonsRequested, deliveryAddress, deliveryDate, suggestedPrice, totalAmountDue);
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
  // Add the new quote to the user's history
  curr_user.user_history.push({
    gallons: gallonsRequested,
    address: deliveryAddress,
    date: deliveryDate,
    suggested_price: suggestedPrice,
    total_amount_due: totalAmountDue
 });
 curr_user.newClient = false;
});



app.get('/user', (req, res) => {
    MyObject.user_get_action(res);
  });
// END OF REMOVE 




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

app.post('/login', async (req, res) => {
  MyObject.login_post_action(req, res);
  //check if username exists in databasem if true, check if pw matches
  //if both conditions are met, set curr_user and logged_in to true and redirect to second page
});



app.post('/logout', (req, res) => {
// clear the user session data and set the logged_in flag to false
  MyObject.logout_post_action(res);
});




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
  reg_action: async function(req, res){
    const username = req.body.username;
    const password = req.body.pass;
      
    const userExists = await getUser(username);
    if (userExists[0]) {
        // User already exists
        alert('Username already exists');
        res.redirect('/');
    } else {
        // Create new user and log in
        curr_user.username = username;
        // Add user to the database
        const hash = await bcrypt.hash(password,5)
        await createUser(username, hash, '', '', '', '', '', '', '0');
        
        res.redirect('/profile');
        return true;
    }

  },
  profile_get_action: async function(res){
    if (curr_user.info_completed){
      res.redirect('/user');
    }
    else{
        res.sendFile(__dirname+ "/profile_manage.html");
        
    }
    return true;
  },
  profile_post_action: async function(req, res){
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
    
    logged_in = true;
    res.redirect('/user');
    return true;
  } else {
    // Inform user that all required fields are not present
    res.send('Please fill in all required fields');
    return false;
  }
  },
  fuelQuote_post_action: async function(req, res){
    //console.log('app.post route called'); // debugging statement
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
    //console.log(deliveryDate);
    tclientProfile = {
      gallonsRequested,
      deliveryAddress,
      deliveryDate,
      suggestedPrice,
      totalAmountDue
    };
    //console.log(deliveryDate); // debugging statement

  try {
      await addQuote(curr_user.username, gallonsRequested, deliveryAddress, deliveryDate, suggestedPrice, totalAmountDue);
      dbhistory = await getUserQuotes(curr_user.username);
      //console.log(dbhistory);
      curr_user.user_history = dbhistory;
      res.redirect('/user');
      return true;
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
      return false;
    }
  },
  user_get_action: async function(res){
    if (logged_in) {
      MyObject.load_second_page(res);
      return true;
    } else {
        res.redirect('/');
        return false;
    }

  },
  login_post_action: async function(req, res){
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
      const isValid = await bcrypt.compare(password, user[0].password)
      if (isValid) {
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
          //console.log("current user info is complete");
          res.redirect('/user');
          return true;
        }
        else{
        // console.log("current user info is not complete");
          res.sendFile(__dirname+ "/profile_manage.html");
          return true;
        }
        
      } else {
        return res.status(400).send('Invalid password please navigate back to home');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
    }
  },
  logout_post_action: async function(res){
    curr_user = {};
    logged_in = false;
    // redirect the user to the home page
    res.redirect('/');
    return true;
  },
  
  // other functions...
}





// console log that you started the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});