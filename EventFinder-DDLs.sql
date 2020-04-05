CREATE TABLE DoB (
    DateOfBirth DATE PRIMARY KEY,
    Age INT NOT NULL
);

CREATE TABLE User (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender VARCHAR(50) NOT NULL,
    FOREIGN KEY (DateOfBirth) REFERENCES DoB(DateOfBirth) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE CreditCard (
    CardNumber VARCHAR(16) PRIMARY KEY,
    ExpiryDate DATE NOT NULL,
    HolderName VARCHAR(100) NOT NULL,
    CVC INT NOT NULL
);

CREATE TABLE Organizer (
    OrganizerUserID INT PRIMARY KEY AUTO_INCREMENT,
    OrganizerContactInfo VARCHAR(200) NOT NULL
);

CREATE TABLE Event (
    EventID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    Description VARCHAR(200),
    LocationAddress VARCHAR(200),
    OrganizerUserID INT,
    FOREIGN KEY (LocationAddress) REFERENCES Location(Address) ON DELETE NO ACTION,
    FOREIGN KEY (OrganizerUserID) REFERENCES User(UserID) ON DELETE SET NULL,
    FOREIGN KEY (OrganizerUserID) REFERENCES Organizer(OrganizerUserID) ON DELETE CASCADE
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

CREATE TABLE Location (
    Address VARCHAR(200) PRIMARY KEY,
    Name VARCHAR(200) NOT NULL
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
