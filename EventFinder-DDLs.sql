DROP TABLE User;
DROP TABLE CreditCard;
DROP TABLE Organizer;
DROP TABLE Event;
DROP TABLE PaidEvent;
DROP TABLE Staff;
DROP TABLE Company;
DROP TABLE Sponsor;
DROP TABLE EventType;
DROP TABLE WorkOn;
DROP TABLE EventHasType;
DROP TABLE InterestedIn;
DROP TABLE Friend;
DROP TABLE PayWith;
DROP TABLE Participate;

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender VARCHAR(50) NOT NULL,
);

CREATE TABLE CreditCard (
    CardNumber VARCHAR(16) PRIMARY KEY,
    ExpiryDate DATE NOT NULL,
    HolderName VARCHAR(100) NOT NULL,
    CVC INT NOT NULL
);

CREATE TABLE Organizer (
    OrganizerUserID INT PRIMARY KEY,
    OrganizerContactInfo VARCHAR(200) NOT NULL,
	FOREIGN KEY (OrganizerUserID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE Event (
    EventID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    Description VARCHAR(200),
    OrganizerUserID INT,
    FOREIGN KEY (OrganizerUserID) REFERENCES User(UserID) ON DELETE SET NULL,
    FOREIGN KEY (OrganizerUserID) REFERENCES Organizer(OrganizerUserID) ON DELETE NO ACTION
);

CREATE TABLE PaidEvent (
    EventID INT PRIMARY KEY,
    Price INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE
);

CREATE TABLE Staff (
    StaffID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    PayRate INTEGER NOT NULL
);

CREATE TABLE Company (
    CompanyID INT PRIMARY KEY AUTO_INCREMENT,
    CompanyName VARCHAR(200) NOT NULL
);

CREATE TABLE Sponsor (
    EventID INT,
    CompanyID INT,
    RepresentativeName VARCHAR(100) NOT NULL,
    Budget INT NOT NULL,
    PRIMARY KEY (EventID, CompanyID),
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE,
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID) ON DELETE CASCADE
);

CREATE TABLE EventType (
    TypeName VARCHAR(50) PRIMARY KEY,
    AgeLimit INT NOT NULL
);

CREATE TABLE WorkOn (
    StaffID INT,
    EventID INT,
    PRIMARY KEY (StaffID, EventID),
    FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE
);

CREATE TABLE EventHasType (
    EventID INT,
    EventType VARCHAR(50),
    PRIMARY KEY (EventID, EventType),
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE,
    FOREIGN KEY (EventType) REFERENCES EventType(TypeName) ON DELETE CASCADE
);

CREATE TABLE InterestedIn (
    UserID INT,
    EventType VARCHAR(50),
    PRIMARY KEY (UserID, EventType),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (EventType) REFERENCES EventType(TypeName) ON DELETE CASCADE
);

CREATE TABLE Friend (
    Friend1UserID INT,
    Friend2UserID INT,
    PRIMARY KEY (Friend1UserID, Friend2UserID),
    FOREIGN KEY (Friend1UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (Friend2UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

CREATE TABLE PayWith (
    UserID INT,
    CardNumber VARCHAR(16),
    primaryCard BIT NOT NULL,
    PRIMARY KEY (UserID, CardNumber),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (CardNumber) REFERENCES CreditCard(CardNumber) ON DELETE CASCADE
);

CREATE TABLE Participate (
    UserID INT,
    EventID INT,
    Status VARCHAR(50) NOT NULL,
    PRIMARY KEY (UserID, EventID),
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (EventID) REFERENCES Event(EventID) ON DELETE CASCADE
);

INSERT INTO User VALUES (51, 'JOHN', 'SMITH', '1991-05-23', 'Male');
INSERT INTO User VALUES (52, 'PETER', 'PARKER', '1991-06-02','Male');
INSERT INTO User VALUES (53, 'Tony', 'Stark', '1972-12-10','Male');
INSERT INTO User VALUES (54, 'Black', 'Widow', '1982-10-06','Female');
INSERT INTO User VALUES (55, 'Steve', 'Rogers', '1933-04-25','Male');
INSERT INTO Organizer VALUES(53, "organizer3@organizer.com");
INSERT INTO Organizer VALUES(55, "organizer5@organizer.com");
INSERT INTO Event VALUES(0, 'Comedy Club', '2020-04-15', '2020-04-17','Full of laughs', NULL);
INSERT INTO Event VALUES(1, 'UFC Fight','2020-05-03','2020-05-03', 'McGreggor Vs Khalid', 55 );
INSERT INTO Event VALUES(2, 'Circus', '2020-04-23','2020-05-03','Cirque de Solil', 53 );
INSERT INTO Event VALUES(3, 'Play', '2020-05-24','2020-06-07','Theatrical Play', Null );
INSERT INTO Event VALUES(4, 'Drinking Challenge', '2020-06-07','2020-06-09', 'Beer Drinking Competition', NULL );
insert into EventType values ('sports', 18);
insert into EventType values ('study', 0);
insert into EventType values ('group event', 14);
insert into EventType values('dining', 21);
insert into EventType values ('charity', 21);
insert into CreditCard values(1234567891233,'September 22', 'Clarke Kent', '123');
insert into CreditCard values (9876543211234, 'September 22', 'Bruce Wayne','000');
insert into CreditCard values(4632850327091, 'May 24', 'Lex Luther', '233');
insert into CreditCard values(12343528357318,'May 22', 'Martha Kent', '123');
insert into CreditCard values(3258238571048, 'Oct 21', 'Louis Layne', '455');                   
insert into PaidEvent values(0, 100);
insert into PaidEvent values(1,49);
insert into PaidEvent values(2,27);
insert into PaidEvent values(3, 39);
insert into PaidEvent values(4,0);                        
insert into  Company values(542154,'Coke');
insert into  Company values(985462,'Dell');
insert into  Company values(387568, 'RBC');
insert into  Company values(2345235, 'Samsung');
insert into  Company values(2143132, 'Apple'); 
insert into  Staff values(901, 'Shasha', 11);
insert into  Staff values(902, 'Loretta', 12);
insert into  Staff values(903, 'Tony', 20);
insert into  Staff values(904, 'Arvin', 33);
insert into  Staff values(905, 'David', 35); 
insert into Participate values (52, 103, 'Registered');
insert into PayWith values (51,1234567891233, 1);
insert into PayWith values (52,9876543211234, 1);
insert into PayWith values (53,4632850327091, 1);
insert into PayWith values (54, 12343528357318, 1);
insert into PayWith values (55,3258238571048, 1);
insert into workon values (901,4);
insert into workon values (902,3);
insert into workon values (903,1);
insert into workon values (904,0);
insert into workon values (905,1);
insert into sponsor values (0, 542154, 'Jimmy', 2500);
insert into sponsor values (1, 985462,'Paul', 1200);
insert into sponsor values (2, 387568,'Howard', 3500);
insert into sponsor values (3, 2345235,'Roger',  6500);
insert into sponsor values (4, 2143132,'Wallie',  10000);