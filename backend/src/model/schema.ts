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
  landId INTEGER,
  landName TEXT,
  clientName TEXT,
  lotIds TEXT,                 
  clientId INTEGER,
  agentDealerId TEXT,              
  otherAgentIds TEXT,               
  appointmentDate DATETIME,
  status TEXT NOT NULL, 
  rejectionNote TEXT,                     
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES Client(_id),
  FOREIGN KEY (landId) REFERENCES Land(_id)
);
CREATE INDEX IF NOT EXISTS idx_application_landName ON Application(landName);
CREATE INDEX IF NOT EXISTS idx_application_landId ON Application(landId);
CREATE INDEX IF NOT EXISTS idx_application_appointmentDate ON Application(appointmentDate);
CREATE INDEX IF NOT EXISTS idx_application_status ON Application(status);

CREATE TABLE IF NOT EXISTS Reservation (
  _id INTEGER PRIMARY KEY AUTOINCREMENT,
  applicationId INTEGER,
  clientName TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  appointmentDate DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicationId) REFERENCES Application(_id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_reservation_applicationId ON Reservation(applicationId);
CREATE INDEX IF NOT EXISTS idx_reservation_status ON Reservation(status);

CREATE TABLE IF NOT EXISTS Contract (
  _id INTEGER PRIMARY KEY AUTOINCREMENT,
  clientId INTEGER,                       
  agentsIds TEXT,           
  applicationId INTEGER,       
  reservationId TEXT,
  clientName TEXT,           
  contractPDF TEXT,                        
  term TEXT,                           
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,


  FOREIGN KEY (reservationId) REFERENCES Reservation(_id), 
  FOREIGN KEY (clientId) REFERENCES Client(_id),
  FOREIGN KEY (applicationId) REFERENCES Application(_id) 
);
CREATE INDEX IF NOT EXISTS idx_contract_clientId ON Contract(clientId);
CREATE INDEX IF NOT EXISTS idx_contract_applicationId ON Contract(applicationId);
CREATE INDEX IF NOT EXISTS idx_contract_createdAt ON Contract(createdAt);
`;
