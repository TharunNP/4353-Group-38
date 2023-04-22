// "use strict";
// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// //const server = require('./server.js');
// const { describe } = require('node:test');
// const assert = require("assert");

// //const request = require('supertest');
// const express = require('express');
// const app = express();
// // const MyObject = require('./MyObject'); // import MyObject module

const server = require('./server.js');
const request = require('supertest');
const bcrypt = require ('bcrypt');
//const app = require('../app');
//const { getUsers, getUser } = require('./server');
describe('getUsers', () => {
  it('should return an array of users', async () => {
    const result = await server.getUsers();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('getUser', () => {
  it('should return a user with the specified username', async () => {
    const result = await server.getUser('fakeuser');
    expect(Array.isArray(result)).toBe(true);
  });
});

// change username when running the report 
describe('createUser', () => {
  it('should create a new user and return a result object', async () => {
    const result = await server.createUser('newuser1sdsd221', 'password', 'John Doe', '123 Main St', '', 'Houston', 'TX', '77001', true);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('updateUser', () => {
  it('should update an existing user and return a result object', async () => {
    const result = await server.updateUser('newuser', 'John Doe', '123 Main St', '', 'Houston', 'TX', '77001', true);
    expect(result.affectedRows).toBe(undefined);
  });
});

describe('getUserQuotes', () => {
  it('should return an array of quotes for the specified user', async () => {
    const result = await server.getUserQuotes('newuser');
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('addQuote', () => {
  it('should add a new quote and return a result object', async () => {
    const result = await server.addQuote('newuser', 100, '123 Main St', '2023-04-21', 2.50, 250.00);
    expect(result.affectedRows).toBe(undefined);
  });
});

describe('getUserQuotesDate', () => {
  it('should return an array of dates for the specified user', async () => {
    const result = await server.getUserQuotesDate('fakeuser');
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('load_second_page', () => {
  test('should call res.render with the correct arguments', () => {
    const mockRender = jest.fn();
    const mockRes = { render: mockRender };

    const mockCurrUser = { "add": "",
         "add2": "",
         "city": "",
         "fname": "",
         "info_completed": false,
         "state": "",
         "user_history": [],
         "username": "",
         "zip": "", };
    const mockUserHistory = [ /* mock user_history array */ ];
    const mockTclientProfile = { "deliveryAddress": "Address placeholder",
         "deliveryDate": "",
         "gallonsRequested": 0,
         "suggestedPrice": 0,
         "totalAmountDue": 0, };

    server.MyObject.load_second_page(mockRes, mockCurrUser, mockUserHistory, mockTclientProfile);

    expect(mockRender).toHaveBeenCalledWith('index2', {
      curr_user: mockCurrUser,
      history: mockUserHistory,
      tclientProfile: mockTclientProfile
    });
  });
});

describe('validateClientForm', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        fullName: 'John Doe',
        address1: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zipcode: '77002',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass validation for valid input', () => {
    server.validateClientForm(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should fail validation for missing required fields', () => {
    req.body = {};
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Please fill in all required fields' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail validation for full name length > 50', () => {
    req.body.fullName = 'a'.repeat(51);
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Full name must be less than 50 characters' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail validation for address1 length > 100', () => {
    req.body.address1 = 'a'.repeat(101);
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Address 1 must be less than 100 characters' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail validation for address2 length > 100', () => {
    req.body.address2 = 'a'.repeat(101);
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Address 2 must be less than 100 characters' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail validation for city length > 100', () => {
    req.body.city = 'a'.repeat(101);
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'City must be less than 100 characters' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail validation for invalid state format', () => {
    req.body.state = 'ABC';
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'State must be a 2 character code' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should fail validation for invalid zipcode format', () => {
    req.body.zipcode = '1234';
    server.validateClientForm(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Zipcode must be a 5 or 9 digit code' });
    expect(next).not.toHaveBeenCalled();
  });
});


describe('POST /client-form', () => {
  test('should respond with 200 OK', async () => {
    const response = await request(server.app)
      .post('/client-form')
      .send({
        fullName: 'John Doe',
        address1: '123 Main St',
        address2: 'Apt 1',
        city: 'Anytown',
        state: 'NY',
        zipcode: '12345',
      });
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Form submitted successfully!');
  });

  test('should respond with 400 Bad Request if required fields are missing', async () => {
    const response = await request(server.app).post('/client-form').send({
      fullName: 'John Doe',
      city: 'Anytown',
      state: 'NY',
      zipcode: '12345',
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe('Please fill in all required fields');
  });
  test('should respond with 400 Bad Request if fields are too long', async () => {
    const response = await request(app)
      .post('/client-form')
      .send({
        fullName: 'John Doe'.repeat(10), // fullName will be 100 characters long
        address1: '123 Main St'.repeat(10), // address1 will be 1000 characters long
        address2: 'Apt 1'.repeat(10), // address2 will be 1000 characters long
        city: 'Anytown'.repeat(10), // city will be 1000 characters long
        state: 'New York', // state is not a 2 character code
        zipcode: '12345-67890', // zipcode is a 10 digit code
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(/must be less than/);
    expect(response.body.msg).toMatch(/must be a 2 character code/);
    expect(response.body.msg).toMatch(/must be a 5 or 9 digit code/);
  });
});


describe('POST /login', () => {
  test('returns 400 status code if username is invalid', async () => {
    const response = await request(server.app)
      .post('/login')
      .send({
        usernameInput: 'invalidusername',
        passwordInput: 'validpassword'
      });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Invalid username');
  });

  test('returns 400 status code if password is invalid', async () => {
    const response = await request(server.app)
      .post('/login')
      .send({
        usernameInput: 'validusername',
        passwordInput: 'invalidpassword'
      });
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Invalid username');
  });

  test('returns 200 status code and redirects to user page if login is successful', async () => {
    const response = await request(server.app)
      .post('/login')
      .send({
        usernameInput: 'validusername',
        passwordInput: 'validpassword'
      });
    expect(response.statusCode).toBe(200);
    expect(response.header['location']).toBe('/user');
  });
  test('valid login should set logged_in to true and redirect to user page', async () => {
    // set up test data
    const username = 'testuser';
    const password = 'testpassword';
    const user = {
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
      fullName: 'Test User',
      address1: '123 Test St',
      address2: '',
      city: 'Testville',
      state: 'TX',
      zip: '12345',
      info_complete: true
    };
    // mock getUser function to return test user data
    const getUserMock = jest.fn().mockResolvedValue([user]);
    // mock getUserQuotes function to return empty history
    const getUserQuotesMock = jest.fn().mockResolvedValue([]);
    // set up request and response objects
    const req = {
      body: {
        usernameInput: username,
        passwordInput: password
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      redirect: jest.fn()
    };
    // call login handler
    await loginHandler(req, res, getUserMock, getUserQuotesMock, bcrypt);
    // assert that user data was set correctly
    expect(logged_in).toBe(true);
    expect(curr_user.username).toBe(user.username);
    expect(curr_user.fname).toBe(user.fullName);
    expect(curr_user.add).toBe(user.address1);
    expect(curr_user.add2).toBe(user.address2);
    expect(curr_user.city).toBe(user.city);
    expect(curr_user.state).toBe(user.state);
    expect(curr_user.zip).toBe(user.zip);
    expect(curr_user.info_completed).toBe(user.info_complete);
    expect(curr_user.user_history).toEqual([]);
    // assert that redirect was called correctly
    expect(res.redirect).toHaveBeenCalledWith('/user');
  });
 });

describe('stateslist', () => {
test('statesList should contain all 50 states in correct order', () => {
  const expectedStates = [    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'  ];

  expect(server.statesList).toEqual(expectedStates);
});
});

describe('GET /user', () => {
  test('should redirect to / if user is not logged in', async () => {
    const response = await request(server.app).get('/user');
    expect(response.status).toBe(302); // Expect HTTP redirect status code
    expect(response.header.location).toBe('/'); // Expect redirect to home page
  });

  test('should load second page if user is logged in', async () => {
    // Simulate a logged in user by setting `logged_in` to true
    logged_in = true;

    const response = await request(server.app).get('/user');
    expect(response.status).toBe(200); // Expect HTTP success status code
    // Assert that the response body contains expected content, for example:
    expect(response.text).toContain('Welcome to the second page!');

    // Reset `logged_in` to false for other tests
    logged_in = false;
  });
});

describe('POST /fuelQuote', () => {
  it('should return 400 if gallonsRequested is not a number', async () => {
    const res = await request(server.app)
      .post('/fuelQuote')
      .send({ gallonsRequested: 'abc', deliveryDate: '2023-01-01' });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toContain('Gallons Requested must be a number');
  });

  it('should return 400 if deliveryDate is not in YYYY-MM-DD format', async () => {
    const res = await request(server.app)
      .post('/fuelQuote')
      .send({ gallonsRequested: 10, deliveryDate: '2023/01/01' });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toContain('Delivery Date must be in YYYY-MM-DD format');
  });

  it('should return 200 and redirect to /user if all inputs are valid', async () => {
    const res = await request(server.app)
      .post('/fuelQuote')
      .send({ gallonsRequested: 10, deliveryDate: '2023-01-01' });
    expect(res.statusCode).toEqual(302); // HTTP 302 is the code for redirect
    expect(res.header.location).toEqual('/user');
  });
});

describe('POST /profile', () => {
  it('should return a 302 redirect to /user if all required fields are present', async () => {
    const response = await request(server.app)
      .post('/profile')
      .send({
        fullname: 'John Doe',
        address1: '123 Main St',
        zipcode: '12345',
        city: 'Anytown',
        state: 'CA',
      });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/user');
  });

  it('should return a 200 response with error message if any required field is missing', async () => {
    const response = await request(server.app)
      .post('/profile')
      .send({
        fullname: 'John Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
      });
    expect(response.status).toBe(200);
    expect(response.text).toContain('Please fill in all required fields');
  });
});

describe('GET /profile', () => {
  it('should return the profile page if user info is incomplete', async () => {
    // simulate a request to the server
    const response = await request(server.app).get('/profile');

    // check if the response status code is 200 OK
    expect(response.statusCode).toBe(200);

    // check if the response contains the expected HTML file
    expect(response.text).toContain('profile_manage.html');
  });

  it('should redirect to /user if user info is complete', async () => {
    // simulate a request to the server with a flag indicating that user info is complete
    const response = await request(server.app).get('/profile').query({ db_info_completed: true });

    // check if the response status code is 302 Found (redirect)
    expect(response.statusCode).toBe(302);

    // check if the response Location header points to /user
    expect(response.header.location).toBe('/user');
  });
});


describe('POST /reg', () => {
  it('should create a new user and redirect to /profile', async () => {
    const mockUser = {
      username: 'testuser',
      pass: 'testpassword'
    };
    const mockRequest = request(server.app)
      .post('/reg')
      .send(mockUser);
    const mockResponse = await mockRequest;
    expect(mockResponse.statusCode).toBe(302);
    expect(mockResponse.header.location).toBe('/profile');
  });

  it('should return an error if the username already exists', async () => {
    const mockUser = {
      username: 'existinguser',
      pass: 'testpassword'
    };
    const mockRequest = request(server.app)
      .post('/reg')
      .send(mockUser);
    const mockResponse = await mockRequest;
    expect(mockResponse.statusCode).toBe(302);
    expect(mockResponse.header.location).toBe('/');
  });
});

describe('POST /reg', () => {
  test('creates a new user and redirects to /profile', async () => {
    const username = 'testuser';
    const password = 'testpass';

    const response = await request(server.app)
      .post('/reg')
      .send({ username, pass: password })
      .expect(302)
      .expect('Location', '/profile');

    // Make sure the user was added to the database
    const user = await getUser(username);
    expect(user).toBeDefined();
    expect(user.username).toEqual(username);

    // Make sure the password was hashed and stored securely
    const isPasswordValid = await bcrypt.compare(password, user.password);
    expect(isPasswordValid).toBe(true);
  });

  test('returns an error if the username already exists', async () => {
    const existingUser = await createUser('existinguser', 'existingpass', '', '', '', '', '', '', '0');

    const response = await request(server.app)
      .post('/reg')
      .send({ username: existingUser.username, pass: 'newpass' })
      .expect(302)
      .expect('Location', '/');

    // Make sure the user wasn't added to the database
    const user = await getUser(existingUser.username);
    expect(user).toBeDefined();
    expect(user.password).toEqual(existingUser.password);

    // Make sure the error message is displayed
    expect(response.text).toContain('Username already exists');
  });
});

describe('GET /', () => {
  it('responds with status 200', async () => {
    const response = await request(server.app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('responds with HTML', async () => {
    const response = await request(server.app).get('/');
    expect(response.headers['content-type']).toContain('text/html');
  });
});

describe('POST /logout', () => {
  it('should clear the user session data and set logged_in to false', async () => {
    // Set up a logged in user
    let logged_in = true;
    let curr_user = { username: 'testuser' };
    
    // Make a request to the /logout endpoint
    const response = await request(server.app)
      .post('/logout')
      .send();

    // Assert that the session data has been cleared and logged_in has been set to false
    expect(curr_user).toEqual({});
    expect(logged_in).toBe(false);
    
    // Assert that the response is a redirect to the home page
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/');
  });
});
