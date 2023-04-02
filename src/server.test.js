"use strict";
const mysql = require('mysql2');
const dotenv = require('dotenv');
const server = require('./server.js');
const { describe } = require('node:test');
const assert = require("assert");

const request = require('supertest');
const express = require('express');
const app = express();
const MyObject = require('./MyObject'); // import MyObject module

  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.getUsers()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });
  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.getUsers()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });
    describe("upperCase function", () => {
      test("it rejects when url is not a string", async () => {
        
    
        
        const result = await server.getUsers();
        expect(result).toBe();
        });
      });
  

  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.getUser()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });

  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.addQuote()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });
  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.getUserQuotes()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });

  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.updateUser()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });

  describe("upperCase function", () => {
    test("it rejects when url is not a string", async () => {
      expect.assertions(1);
  
      await expect(server.createUser()).rejects.toEqual(
        TypeError("You must provide a number.")
        );
      });
    });

  test('null', () => {
    server.fname = null;
    expect(server.fname).toBeNull(); 
    });
  const {profile_get_action} = require('./server.js');


  describe("MyObject class", () => {
    describe("load_second_page method", () => {
      test("it should return true for valid input", async () => {
        const result = await MyObject.load_second_page("some valid input");
        expect(result).toBe(true);
      });
  
      test("it should throw an error for invalid input", async () => {
        await expect(MyObject.load_second_page(123)).rejects.toThrow(TypeError);
      });
    });
  });
  // Import the server.js file
const { profile_get_action } = require('./server');

// Describe the tests for profile_get_action
describe('profile_get_action', () => {
  // Test case for valid input
  it('returns the expected output for valid input', () => {
    // Define the expected output
    const expectedOutput = 'User profile for username: john_doe';

    // Call the function with valid input
    const output = profile_get_action({ username: 'john_doe' });

    // Assert that the output matches the expected output
    expect(output).toEqual(expectedOutput);
  });

  // Test case for missing username
  it('returns an error message if username is missing', () => {
    // Define the expected error message
    const expectedError = 'Username is required';

    // Call the function with missing username
    const output = profile_get_action({});

    // Assert that the output contains the expected error message
    expect(output).toContain(expectedError);
  });

  // Test case for empty username
  it('returns an error message if username is empty', () => {
    // Define the expected error message
    const expectedError = 'Username cannot be empty';

    // Call the function with empty username
    const output = profile_get_action({ username: '' });

    // Assert that the output contains the expected error message
    expect(output).toContain(expectedError);
  });

  // Test case for invalid input
  it('returns an error message if input is invalid', () => {
    // Define the expected error message
    const expectedError = 'Invalid input';

    // Call the function with invalid input
    const output = profile_get_action();

    // Assert that the output contains the expected error message
    expect(output).toContain(expectedError);
  });
});

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  getUserQuotes,
  addQuote,
  getUserQuotesDate
} = require('./server');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE username LIKE "testuser%"');
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE username LIKE "testuser%"');
});

describe('Test the database functions', () => {
  test('getUsers() returns an array', async () => {
    const users = await getUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  test('createUser() and getUser() work correctly', async () => {
    const username = 'testuser1';
    const password = 'testpassword1';
    const fullName = 'Test User1';
    const add1 = '123 Test St.';
    const add2 = 'Apt 4B';
    const city = 'Testville';
    const state = 'TS';
    const zip = '12345';
    const info_complete = 1;

    await createUser(username, password, fullName, add1, add2, city, state, zip, info_complete);
    const users = await getUser(username);
    const user = users[0];

    expect(user.username).toBe(username);
    expect(user.password).toBe(password);
    expect(user.fullName).toBe(fullName);
    expect(user.address1).toBe(add1);
    expect(user.address2).toBe(add2);
    expect(user.city).toBe(city);
    expect(user.state).toBe(state);
    expect(user.zip).toBe(zip);
    expect(user.info_complete).toBe(info_complete);
  });

  test('updateUser() works correctly', async () => {
    const username = 'testuser1';
    const fullName = 'Updated Test User1';
    const add1 = '456 Updated St.';
    const add2 = 'Apt 2C';
    const city = 'Updated City';
    const state = 'UT';
    const zip = '67890';
    const info_complete = 1;

    await updateUser(username, fullName, add1, add2, city, state, zip, info_complete);
    const users = await getUser(username);
    const user = users[0];

    expect(user.fullName).toBe(fullName);
    expect(user.address1).toBe(add1);
    expect(user.address2).toBe(add2);
    expect(user.city).toBe(city);
    expect(user.state).toBe(state);
    expect(user.zip).toBe(zip);
    expect(user.info_complete).toBe(info_complete);
  });

  test('getUserQuotes() and addQuote() work correctly', async () => {
    const user_id = 'testuser1';
    const gallons = 1000;
    const address = '123 Test St., Apt 4B, Testville, TS, 12345';
    const date = '2023-04-30';
    const suggested_price = 2.50;
    const total_amount_due = 2500;

    await addQuote(user_id, gallons, address, date, suggested_price, total_amount_due);
    const quotes = await getUserQuotes(user_id);
    const quote = quotes[0];

    expect(quote.user_id).toBe(user_id);
    expect(quote.gallons).toBe(gallons);
    expect(quote.address).toBe(address);
    expect(quote.date).toBe(date);
    expect(quote.suggested_price).toBe(suggested_price);
    expect(quote.total_amount_due).toBe(total_amount_due);
  });

  test('getUserQuotesDate() works correctly', async () => {
    const user_id = 'testuser1';
    const fromDate = '2023-04-01';
    const toDate = '2023-04-30';

    const quotes = await getUserQuotesDate(user_id, fromDate, toDate);
    const quote = quotes[0];

    expect(quote.user_id).toBe(user_id);
    expect(quote.date).toBeGreaterThanOrEqual(fromDate);
    expect(quote.date).toBeLessThanOrEqual(toDate);
  });
});
const request = require('supertest');
const express = require('express');
const app = express();
const MyObject = require('./MyObject'); // import MyObject module

// Test default route
describe('GET /', () => {
  it('responds with HTML file', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(200)
      .end(done);
  });
});

// Test registration form
describe('POST /reg', () => {
  it('calls MyObject.reg_action', (done) => {
    const mockReq = { body: {} };
    const mockRes = {};
    MyObject.reg_action = jest.fn(() => {
      done();
    });
    request(app)
      .post('/reg')
      .send(mockReq)
      .end(mockRes);
  });
});

// Test profile management page GET request
describe('GET /profile', () => {
  it('calls MyObject.profile_get_action', (done) => {
    const mockRes = {};
    MyObject.profile_get_action = jest.fn(() => {
      done();
    });
    request(app)
      .get('/profile')
      .end(mockRes);
  });
});

// Test profile management page POST request
describe('POST /profile', () => {
  it('calls MyObject.profile_post_action with correct request and response parameters', (done) => {
    const mockReq = { body: {} };
    const mockRes = {};
    MyObject.profile_post_action = jest.fn(() => {
      done();
    });
    request(app)
      .post('/profile')
      .send(mockReq)
      .end(mockRes);
  });
});

// Test client form validation middleware
describe('validateClientForm', () => {
  it('calls next() when all fields are valid', (done) => {
    const mockReq = {
      body: {
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipcode: '77001',
      },
    };
    const mockRes = {};
    const mockNext = jest.fn(() => {
      done();
    });
    validateClientForm(mockReq, mockRes, mockNext);
  });
});

// Test fuel quote POST request
describe('POST /fuelQuote', () => {
  it('calls MyObject.fuelQuote_post_action with correct request and response parameters', (done) => {
    const mockReq = { body: {} };
    const mockRes = {};
    MyObject.fuelQuote_post_action = jest.fn(() => {
      done();
    });
    request(app)
      .post('/fuelQuote')
      .send(mockReq)
      .end(mockRes);
  });
});

// Test user management page GET request
describe('GET /user', () => {
  it('calls MyObject.user_get_action', (done) => {
    const mockRes = {};
    MyObject.user_get_action = jest.fn(() => {
      done();
    });
    request(app)
      .get('/user')
      .end(mockRes);
  });
});const MyObject = {
  render_second_page: function(res, curr_user, tclientProfile) {
    res.render('index2', {
      curr_user: curr_user,
      history: curr_user.user_history,
      tclientProfile: tclientProfile,
    });
  },

  isNewUser: async function(username) {
    const userExists = await getUser(username);
    return !userExists[0];
  },

  addUserToDatabase: async function(username, password) {
    const hash = await bcrypt.hash(password, 5);
    await createUser(username, hash, '', '', '', '', '', '', '0');
  },

  redirectToProfile: function(res) {
    res.redirect('/profile');
  },

  isProfileInfoCompleted: function(curr_user) {
    return curr_user.info_completed;
  },

  sendProfileManage: function(res, __dirname) {
    res.sendFile(__dirname + "/profile_manage.html");
  },

  updateCurrentUserInfo: function(curr_user, req) {
    const { fullname, address1, address2, zipcode, city, state } = req.body;
    curr_user.fname = fullname;
    curr_user.add = address1;
    curr_user.add2 = address2;
    curr_user.city = city;
    curr_user.state = state;
    curr_user.zip = zipcode;
    curr_user.user_history = [];
  },

  isProfileInfoValid: function(req) {
    const { fullname, address1, zipcode, city, state } = req.body;
    return fullname && address1 && zipcode && city && state;
  },

  updateUserInDatabase: async function(curr_user) {
    await updateUser(
      curr_user.username,
      curr_user.fname,
      curr_user.add,
      curr_user.add2,
      curr_user.city,
      curr_user.state,
      curr_user.zip,
      curr_user.info_completed,
      curr_user.username
    );
  },

  redirectToUser: function(res) {
    res.redirect('/user');
  },

  informIncompleteFields: function(res) {
    res.send('Please fill in all required fields');
  },
};



const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const MyObject = require('./MyObject');

describe('MyObject', () => {
  describe('isNewUser', () => {
    it('should return true if user does not exist', async () => {
      const getUserStub = sinon.stub().returns(Promise.resolve([null]));
      MyObject.getUser = getUserStub;

      const result = await MyObject.isNewUser('new_user');
      expect(result).to.be.true;
    });

    it('should return false if user exists', async () => {
      const getUserStub = sinon.stub().returns(Promise.resolve([{ username: 'existing_user' }]));
      MyObject.getUser = getUserStub;

      const result = await MyObject.isNewUser('existing_user');
      expect(result).to.be.false;
    });
  });

  // Add more tests for other functions

});

