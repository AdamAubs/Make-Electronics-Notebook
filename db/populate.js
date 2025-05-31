require("dotenv").config();
const { Client } = require("pg")


const SQL = `
-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS observation CASCADE;
DROP TABLE IF EXISTS experiment_component CASCADE;
DROP TABLE IF EXISTS instruction CASCADE;
DROP TABLE IF EXISTS experiment CASCADE;
DROP TABLE IF EXISTS component CASCADE;
DROP TABLE IF EXISTS section CASCADE;
DROP TABLE IF EXISTS app_user CASCADE;

-- User table: Stores user accounts
CREATE TABLE IF NOT EXISTS app_user (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing user ID (SQL-compliant)
  username VARCHAR(255) NOT NULL,                        -- Required username
  email VARCHAR(255) UNIQUE NOT NULL,                    -- Unique and required email
  password_hash TEXT NOT NULL,                           -- Hashed password
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP         -- Creation timestamp
);

-- Section table: Groups experiments by topic, created by users
CREATE TABLE IF NOT EXISTS section (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing section ID
  title VARCHAR(255) NOT NULL,                           -- Required section title
  description TEXT,                                      -- Optional description
  created_by_user_id INTEGER REFERENCES app_user(id) ON DELETE SET NULL, -- Creator reference
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Creation timestamp
  is_public BOOLEAN DEFAULT false
);

-- Experiment table: Individual experiments within a section
CREATE TABLE IF NOT EXISTS experiment (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing experiment ID
  title VARCHAR(255) NOT NULL,                           -- Required experiment title
  description TEXT,                                      -- Optional description
  section_id INTEGER NOT NULL REFERENCES section(id) ON DELETE CASCADE, -- Required section reference
  created_by_user_id INTEGER REFERENCES app_user(id) ON DELETE SET NULL,  -- Creator reference
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,         -- Creation timestamp
  is_public BOOLEAN DEFAULT false
);


CREATE TABLE IF NOT EXISTS instruction (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  experiment_id INTEGER NOT NULL REFERENCES experiment(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES app_user(id) ON DELETE SET NULL,
  type VARCHAR(50), 
  data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Component table: Represents a physical component used in experiments
CREATE TABLE IF NOT EXISTS component (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing component ID
  name VARCHAR(255) NOT NULL,                            -- Required component name
  description TEXT,                                      -- Optional description
  datasheet_url TEXT,                                    -- Optional datasheet link
  buy_link TEXT                                          -- Optional purchase link
);

-- ExperimentComponent table: Many-to-many between experiments and components
CREATE TABLE IF NOT EXISTS experiment_component (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing join ID
  experiment_id INTEGER NOT NULL REFERENCES experiment(id) ON DELETE CASCADE,  -- Required experiment reference
  component_id INTEGER NOT NULL REFERENCES component(id) ON DELETE CASCADE,    -- Required component reference
  user_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  quantity INTEGER NOT NULL DEFAULT 1,                   -- Quantity used (default = 1)
  notes TEXT                                             -- Optional notes
);

-- Observation table: User-submitted data on an experiment
CREATE TABLE IF NOT EXISTS observation (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing observation ID
  experiment_id INTEGER NOT NULL REFERENCES experiment(id) ON DELETE CASCADE, -- Required experiment reference
  user_id INTEGER REFERENCES app_user(id) ON DELETE SET NULL, -- Observer reference (nullable)
  type VARCHAR(50),                                       -- Type of observation (e.g., note, measurement)
  data TEXT,                                              -- Observation content
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP          -- Creation timestamp
);

-- Insert Makerbot user
INSERT INTO app_user (username, email, password_hash)
VALUES ('makerbot', 'makerbot@example.com', 'hashed_password_here');

-- Insert 5 public sections in order
INSERT INTO section (title, description, created_by_user_id, is_public)
VALUES 
  ('Section One: The Basics', NULL, 1, true),
  ('Section Two: Switching', NULL, 1, true),
  ('Section Three: Soldering', NULL, 1, true),
  ('Section Four: Chips, Ahoy!', NULL, 1, true),
  ('Section Five What Next?', NULL, 1, true);


-- Insert Experiments
INSERT INTO experiment (title, description, section_id, created_by_user_id, is_public)
VALUES 
  -- Section One
  ('Build a Simple Circuit', 'Use a battery, resistor, and LED to build a basic circuit.', 1, 1, true),
  ('Understand Resistors', 'Measure resistance and learn how they affect circuits.', 1, 1, true),

  -- Section Two
  ('Using a SPST Switch', 'Control a circuit with a Single Pole Single Throw switch.', 2, 1, true),
  ('Toggle with a Pushbutton', 'Implement a pushbutton as an input in a circuit.', 2, 1, true),

  -- Section Three
  ('Solder a Header Pin', 'Learn to solder a pin to a PCB.', 3, 1, true),
  ('Fix a Broken Connection', 'Resolder a lifted pad on a board.', 3, 1, true),

  -- Section Four
  ('Blink an LED with a 555 Timer', 'Use a 555 timer IC in astable mode.', 4, 1, true),
  ('Build a Counter with a 4017 IC', 'Use a decade counter to sequence outputs.', 4, 1, true),

  -- Section Five
  ('Design Your Own PCB', 'Plan and design a basic printed circuit board.', 5, 1, true),
  ('Simulate Before You Build', 'Use a simulator to test circuit behavior before assembly.', 5, 1, true);


`;

// -- Insert a user
// INSERT INTO app_user (username, email, password_hash)
// VALUES ('maker123', 'maker@example.com', 'hashed_password_here');
//
// -- Insert a section
// INSERT INTO section (title, description, created_by_user_id)
// VALUES (
//   'Basic Circuits',
//   'Covers fundamental experiments like resistors, LEDs, and batteries.',
//   1
// );
//
// -- Insert experiments
// INSERT INTO experiment (title, description, section_id, created_by_user_id)
// VALUES 
//   (
//     'LED Blinker',
//     'Make an LED blink using a resistor and a battery.',
//     1,
//     1
//   ),
//   (
//     'Voltage Divider',
//     'Demonstrate how voltage divides across resistors in series.',
//     1,
//     1
//   );
//
// -- Insert instructions for experiment 1
// INSERT INTO instruction (experiment_id, step_number, text)
// VALUES 
//   (1, 1, 'Connect a 220-ohm resistor to the positive leg of the LED.'),
//   (1, 2, 'Attach the negative leg of the LED to the ground.'),
//   (1, 3, 'Power the circuit using a 9V battery and observe the LED.');
//
// -- Insert components
// INSERT INTO component (name, description, datasheet_url, buy_link)
// VALUES
//   ('LED (Red)', 'Standard 5mm red LED', NULL, 'https://example.com/led'),
//   ('220-ohm Resistor', 'Resistor with color bands: red-red-brown-gold', NULL, 'https://example.com/resistor'),
//   ('9V Battery', 'Standard 9V battery', NULL, 'https://example.com/9vbattery'),
//   ('Breadboard', '400-point breadboard for prototyping', NULL, 'https://example.com/breadboard');
//
// -- Associate components to experiment 1 (LED Blinker)
// INSERT INTO experiment_component (experiment_id, component_id, quantity)
// VALUES
//   (1, 1, 1),  -- LED
//   (1, 2, 1),  -- Resistor
//   (1, 3, 1),  -- 9V Battery
//   (1, 4, 1);  -- Breadboard
//
// -- Observation by user for experiment 1
// INSERT INTO observation (experiment_id, user_id, type, data)
// VALUES 
//   (1, 1, 'reading', 'LED blinks every 1 second'),
//   (1, 1, 'note', 'Resistor gets slightly warm after prolonged use');
// `;

async function main() {

  const client = new Client({
    connectionString: process.env.DEV_DATABASE_URL,
  })

  try {
    console.log("seeding...")
    await client.connect()
    await client.query(SQL)
    console.log("done")
  } catch (err) {
    console.error("Error creating database", err)
  } finally {
    await client.end()
  }
}

main()
