export const schema = `

 CREATE TABLE IF NOT EXISTS Land (
 _id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  location TEXT,
  totalArea REAL,
  totalLots INTEGER,
  available INTEGER,
  lotsSold INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_land_name ON Land(name);



CREATE TABLE IF NOT EXISTS Lot ( 
  _id INTEGER PRIMARY KEY AUTOINCREMENT,
  landId INTEGER NOT NULL,
  blockNumber TEXT NOT NULL,
  lotNumber TEXT NOT NULL,
  lotSize REAL NOT NULL,
  pricePerSqm REAL NOT NULL,
  totalAmount REAL NOT NULL,
  lotType TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (landId) REFERENCES Land(_id) ON DELETE CASCADE
);



CREATE INDEX IF NOT EXISTS idx_lot_landId ON Lot(landId);
CREATE INDEX IF NOT EXISTS idx_lot_createdAt ON Lot(createdAt);


CREATE TABLE IF NOT EXISTS Client (
  _id INTEGER PRIMARY KEY AUTOINCREMENT,
  profilePicc TEXT DEFAULT NULL,
  firstName TEXT NOT NULL,
  middleName TEXT,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE,
  contact TEXT,
  Marital TEXT,
  address TEXT,
  status TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_client_firstName ON Client(firstName);
CREATE INDEX IF NOT EXISTS idx_client_middleName ON Client(middleName);
CREATE INDEX IF NOT EXISTS idx_client_lastName ON Client(lastName);
CREATE INDEX IF NOT EXISTS idx_client_email ON Client(email);



CREATE TABLE IF NOT EXISTS Application (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,               
    landId TEXT,
    landName TEXT,
    clientName TEXT,
    lotIds TEXT,                 
    clientId TEXT,
    agentDealerId TEXT,              
    otherAgentIds TEXT,               
    appointmentDate DATETIME,
    status TEXT NOT NULL,                      
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_application_landName ON Application(landName);
CREATE INDEX IF NOT EXISTS idx_application_clientName ON Application(clientName);
CREATE INDEX IF NOT EXISTS idx_application_status ON Application(status);


`;
