const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

let userIdCount = 0;
let eventIDCount = 0;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'jiankang27480928',
    database: 'EventFinder'
  });
}

// Find events with the given filters on location, title,
// organizerName, types, startDate, endDate
app.post('/api/events', (req, res) => {
  console.log(req.body);
  res.send(
    [
      {
        EventID: 0,
        Title: 'CPSC 304 Final Exam',
        StartDate: new Date(2020, 1, 2, 10, 0, 0, 0),
        EndDate: new Date(2020, 1, 2, 12, 0, 0, 0),
        Description: 'In person final exam. All students must attend',
        LocationAddress: '6245 Agronomy Rd, Vancouver, BC V6T 1Z4',
        OrganizerUserID: 0,
        OrganizerName: 'Bob Smith',
        Attendees: ["Jack Ding", "Bob Smith", "Alex Doe"],
        Types: ["study"]
      },
      {
        EventID: 1,
        Title: 'CPSC 304 Review Session',
        StartDate: new Date(2020, 1, 1, 10, 0, 0, 0),
        EndDate: new Date(2020, 1, 1, 12, 0, 0, 0),
        Description: 'Optional review session',
        LocationAddress: '6245 Agronomy Rd, Vancouver, BC V6T 1Z4',
        OrganizerUserID: 1,
        OrganizerName: 'Jacky Ding',
        Attendees: ["Jack Ding", "Bob Smith", "Alex Doe", "Chris Burton"],
        Types: ["study", "group event"]
      }
    ]
  )
})

// Create an event given its organizerID, title, location,
// types (as an array of type), startDate, endDate, description
app.post('/api/event', (req, res) => {
  console.log("Trying to create a new event...");
  const organizerID = req.body.organizerID;
  const organizerContactInfo = req.body.organizerContactInfo;
  const title = req.body.title;
  const location = req.body.location;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const queryStringEvent = "INSERT INTO Event (EventID, Title, StartDate, EndDate, Description, LocationAddress, OrganizerUserID) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const queryStringOrganizer = "INSERT INTO Organizer (OrganizerUserID, OrganizerContactInfo) VALUES (?, ?)";
  const queryStringEventType = "INSERT INTO EventType (TypeName, AgeLimit) VALUES (?, ?)";

  const typeNames = ["Family Event", "Overnight Party", "Job Fair", "Auto Show", "National Day Fireworks", "Outdoor Movie", "Debate"];
  const randomNumber = Math.floor(Math.random() * typeNames.length);

  const ageLimits = [100, 18, 21, 19, 65];
  const randomAge = Math.floor(Math.random() * ageLimits.length);

  getConnection().query(queryStringEvent, [eventIDCount, title, startDate, endDate, description, location, organizerID], (err, results, fields) => {
    if (err) {
      console.log("Failed to create new event: " + err);
      res.sendStatus(500);
      return;
    }
    userIdCount++;
    console.log("Inserted a new event with id: " + results.insertId);
  });

  getConnection().query(queryStringOrganizer, [organizerID, organizerContactInfo], (err, results, fields) => {
    if (err) {
      console.log("Failed to create new entry in Organizer: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("New entry created in Organizer");
  });

  getConnection().query(queryStringEventType, [typeNames[randomNumber], ageLimits[randomAge]], (err, results, fields) => {
    if (err) {
      console.log("Failed to create new entry in EventType");
      res.sendStatus(500);
      return;
    }
    console.log("New entry created in EventType");
  })

  res.sendStatus(200);
  return;
})

// Delete the event with given eventID
app.delete('/api/event/:eventID', (req, res) => {
  console.log("Deleting event with ID = " + req.params.eventID);
  const eventId = req.params.eventID;
  const queryString = "DELETE FROM Event WHERE EventID = ?";

  getConnection().query(queryString, [eventId], (err, results, fields) => {
    if (err) {
      console.log("Failed to delete event " + eventId);
      res.sendStatus(500);
      return;
    }
    console.log("Event deleted!");
    res.sendStatus(200);
    return;
  });

})

// User with userID joins event with eventID. Create such
// entry in Participate table
app.put('/api/event/:eventID/user/:userID', (req, res) => {
  console.log("Updating attendee list for event: " + req.params.eventID);
  const userId = req.params.userID;
  const eventId = req.params.eventID;
  const statusArray = ['Interested', 'Registered', 'Paid'];
  const randomNumber = Math.floor(Math.random() * statusArray.length);
  const queryString = "INSERT INTO Participate (UserID, EventID, Status) VALUES (?, ?, ?)";

  getConnection().query(queryString, [userId, eventId, statusArray[randomNumber]], (err, results, fields) => {
    if (err) {
      console.log("Failed to update attendee list");
      res.sendStatus(500);
      return;
    }
    console.log("Participation for event " + eventId + " has been updated!");
    res.sendStatus(200);
    return;
  });

})

// Create a user with the given firstName, lastName, dateOfBirth,
// gender, cardNumber, expiryDate, holderName and CVC
app.post('/api/user', (req, res) => {
  console.log("Trying to create a new user...");
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dateOfBirth = req.body.dateOfBirth;
  const gender = req.body.gender;
  const cardNumber = req.body.cardNumber;
  const expiryDate = req.body.expiryDate;
  const holderName = req.body.holderName;
  const cvc = req.body.CVC;
  const queryStringUser = "INSERT INTO User (UserID, FirstName, LastName, DateOfBirth, Gender) VALUES (?, ?, ?, ?, ?)";
  const queryStringDateOfBirth = "INSERT INTO DoB (DateOfBirth, Age) VALUES (?, ?)";
  const queryStringCard = "INSERT INTO CreditCard (CardNumber, ExpiryDate, HolderName, CVC) VALUES (?, ?, ?, ?)";

  getConnection().query(queryStringUser, [userIdCount, firstName, lastName, dateOfBirth, gender], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err);
      res.sendStatus(500);
      return;
    }
    userIdCount++;
    console.log("Inserted a new user with id: " + results.insertId);
  });

  // TODO: properly insert age instead of using Math.random()
  getConnection().query(queryStringDateOfBirth, [dateOfBirth, (Math.floor(Math.random() * 10) * 3)], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new birthday entry: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("Inserted a new birthday entry");
  });
  
  getConnection().query(queryStringCard, [cardNumber, expiryDate, holderName, cvc], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new credit card record: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("Inserted a new credit card entry");
  });
  
  res.sendStatus(200);
  return;

});

// Send status code 200 if a user with the given userID exists,
// 404 otherwise.
app.get('/api/user/:userID', (req, res) => {
  console.log("Fetching user with ID: " + req.params.userID);
  const userId = req.params.userID;
  const queryString = "SELECT * FROM User WHERE UserID = ?";

  getConnection().query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Unable to fetch user: " + err);
      res.sendStatus(404);
      return;
    }
    console.log("User exists");
    res.sendStatus(200);
    return;  
  });

});

app.listen(port, () => console.log(`Listening on port ${port}`));