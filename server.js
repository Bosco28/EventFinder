const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

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

function buildWheres(params) {
  var conditions = [];
  var values = [];

  if (params.location !== null) {
    conditions.push("e.LocationAddress LIKE ?");
    values.push("%" + params.location + "%");
  }

  if (params.title !== null) {
    conditions.push("e.Title LIKE ?");
    values.push("%" + params.title + "%");
  }

  if (params.organizerName !== null) {
    conditions.push("CONCAT(u.FirstName, \" \", u.LastName) LIKE ?");
    values.push("%" + params.organizerName + "%");
  }

  if (params.startDate !== null && params.endDate !== null) {
    conditions.push("e.StartDate BETWEEN ? AND ? AND e.EndDate BETWEEN ? AND ?");
    values.push(params.startDate);
    values.push(params.endDate);
    values.push(params.startDate);
    values.push(params.endDate);
  }

  if (params.types !== null && params.types.length) {
    query = 
      "e.EventID IN \
        (SELECT e1.EventID FROM Event e1 \
          WHERE NOT EXISTS \
            (SELECT * FROM EventType et \
              WHERE et.TypeName IN (" + params.types.map((type,i,_) => "\""+type+"\"").toString() + ") AND \
                NOT EXISTS \
                (SELECT * FROM EventHasType eht \
		              WHERE eht.EventID = e1.EventID AND \
                    eht.EventType = et.TypeName)))"
    conditions.push(query);
  }

  return {
    where: conditions.length ?
             'WHERE ' + conditions.join(' AND ') : '',
    values: values
  };
}

// Find events with the given filters on location, title,
// organizerName, types, startDate, endDate
app.post('/api/events', (req, res) => {
  console.log(req.body);
  whereXvalues = buildWheres(req.body);
  whereClauses = whereXvalues.where;
  whereValues = whereXvalues.values;

  queryString = 
    "SELECT e.*, \
            CONCAT(u.FirstName, \" \", u.LastName) AS OrganizerName, \
            (SELECT GROUP_CONCAT(eht.EventType) \
              FROM EventHasType eht \
              WHERE eht.EventID = e.EventID) AS Types, \
            (SELECT GROUP_CONCAT(DISTINCT CONCAT(u1.FirstName, \" \", u1.LastName)) \
              FROM Participate p JOIN User u1 ON p.UserID = u1.UserID \
              WHERE p.EventID = e.EventID) AS Attendees \
            FROM Event e \
            JOIN User u ON e.OrganizerUserID=u.UserID " + whereClauses;

  getConnection().query(queryString, whereValues, (err, results, fields) => {
    if (err) {
      console.log("Failed to update attendee list: " + err);
    }
    res.send(results)
  });
})

// Find gender ratio on an event
app.get('/api/event/:eventID', (req, res) => {
  queryString = 
    "SELECT COUNT(*) AS Count, u.gender AS Gender \
      FROM Participate p JOIN User u ON p.UserID = u.UserID \
      WHERE p.EventID = ? \
      GROUP BY u.gender";

  getConnection().query(queryString, [req.params.eventID], (err, results, fields) => {
    if (err) {
      console.log("Failed to update attendee list: " + err);
    }
    res.send(results);
  });
})

// Create an event given its organizerID, title, location,
// types (as an array of type), startDate, endDate, description
app.post('/api/event', (req, res) => {
  console.log("Trying to create a new event...");
  const organizerID = req.body.organizerID;
  const organizerContactInfo = organizerID + "@" + "eventfinder.com";
  const title = req.body.title;
  const location = req.body.location;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const queryStringEvent = "INSERT INTO Event (Title, StartDate, EndDate, Description, LocationAddress, OrganizerUserID, OrganizerContactInfo) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const queryStringEventType = "INSERT INTO EventType (TypeName, AgeLimit) VALUES (?, ?)";

  const typeNames = ["Family Event", "Overnight Party", "Job Fair", "Auto Show", "National Day Fireworks", "Outdoor Movie", "Debate"];
  const randomNumber = Math.floor(Math.random() * typeNames.length);

  const ageLimits = [100, 18, 21, 19, 65];
  const randomAge = Math.floor(Math.random() * ageLimits.length);

  getConnection().query(queryStringEventType, [typeNames[randomNumber], ageLimits[randomAge]], (err, results, fields) => {
    if (err) {
      console.log("Failed to create new entry in EventType");
      res.sendStatus(500);
      return;
    }
    console.log("New entry created in EventType");

    getConnection().query(queryStringEvent, [title, startDate, endDate, description, location, organizerID, organizerContactInfo], (err, val, fields) => {
      if (err) {
        console.log("Failed to create new event: " + err);
        res.sendStatus(500);
        return;
      }
      console.log("Inserted a new event");
      res.sendStatus(200);
      return;
    });
  });
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
  const status = "Registered";
  const queryString = "INSERT INTO Participate (UserID, EventID, Status) VALUES (?, ?, ?)";

  getConnection().query(queryString, [userId, eventId, status], (err, results, fields) => {
    if (err) {
      console.log("Failed to update attendee list: " + err);
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
  const queryStringUser = "INSERT INTO User (FirstName, LastName, DateOfBirth, Gender) VALUES (?, ?, ?, ?)";
  const queryStringCard = "INSERT INTO CreditCard (CardNumber, ExpiryDate, HolderName, CVC) VALUES (?, ?, ?, ?)";


  getConnection().query(queryStringUser, [firstName, lastName, dateOfBirth, gender], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err);
      res.sendStatus(500);
      return;
    }
    console.log("Inserted a new user with id: " + results.insertId);

    getConnection().query(queryStringCard, [cardNumber, expiryDate, holderName, cvc], (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new credit card record: " + err);
        res.sendStatus(500);
        return;
      }
      console.log("Inserted a new credit card entry");

      res.sendStatus(200);
      return;
    });
  });
});

// Send status code 200 if a user with the given userID exists,
// 404 otherwise.
app.get('/api/user/:userID', (req, res) => {
  console.log("Fetching user with ID: " + req.params.userID);
  const userId = req.params.userID;
  const queryString = "SELECT COUNT(*) AS doesUserExist FROM User WHERE UserID = ?";

  getConnection().query(queryString, [userId], (err, result, fields) => {
    if (err) {
      console.log("Unable to query user: " + err);
      res.sendStatus(500);
      return;
    }
    if (result[0].doesUserExist === 0) {
      console.log("User not found");
      res.sendStatus(404);
      return;
    } else if (result[0].doesUserExist === 1) {
      console.log("User exists");
      res.sendStatus(200);
      return;
    }
  });

});

app.put('/api/event/:eventID', (req, res) => {
  eventTitle = req.body.title;
  eventID = req.params.eventID;
  queryString = "UPDATE Event SET Title = ? where eventID = ?"
  getConnection().query(queryString, [eventTitle, eventID], (err, result, fields) => {
    if (err) {
      console.log("Unable to update title: " + err);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
    return;
  });
})

app.listen(port, () => console.log(`Listening on port ${port}`));