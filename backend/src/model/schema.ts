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
  validIdPicc TEXT,
  firstName TEXT NOT NULL,
  middleName TEXT,
  lastName TEXT NOT NULL,
  email TEXT UNIQUE,
  contact TEXT,
  Marital TEXT,
  balance REAL DEFAULT 0,
  address TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_client_firstName ON Client(firstName);

`;
