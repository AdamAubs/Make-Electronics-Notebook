require("dotenv").config();
const { Client } = require("pg")


const SQL = `
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP         -- Creation timestamp
);

-- Experiment table: Individual experiments within a section
CREATE TABLE IF NOT EXISTS experiment (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing experiment ID
  title VARCHAR(255) NOT NULL,                           -- Required experiment title
  description TEXT,                                      -- Optional description
  section_id INTEGER NOT NULL REFERENCES section(id) ON DELETE CASCADE, -- Required section reference
  created_by_user_id INTEGER REFERENCES app_user(id) ON DELETE SET NULL,  -- Creator reference
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP         -- Creation timestamp
);

-- Instruction table: Steps to perform an experiment
CREATE TABLE IF NOT EXISTS instruction (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,   -- Auto-incrementing instruction ID
  experiment_id INTEGER NOT NULL REFERENCES experiment(id) ON DELETE CASCADE, -- Required experiment reference
  step_number INTEGER NOT NULL,                          -- Step number/order
  text TEXT NOT NULL                                     -- Instruction content
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

-- Insert a user
INSERT INTO app_user (username, email, password_hash)
VALUES ('maker123', 'maker@example.com', 'hashed_password_here');

-- Insert a section
INSERT INTO section (title, description, created_by_user_id)
VALUES (
  'Basic Circuits',
  'Covers fundamental experiments like resistors, LEDs, and batteries.',
  1
);

-- Insert experiments
INSERT INTO experiment (title, description, section_id, created_by_user_id)
VALUES 
  (
    'LED Blinker',
    'Make an LED blink using a resistor and a battery.',
    1,
    1
  ),
  (
    'Voltage Divider',
    'Demonstrate how voltage divides across resistors in series.',
    1,
    1
  );

-- Insert instructions for experiment 1
INSERT INTO instruction (experiment_id, step_number, text)
VALUES 
  (1, 1, 'Connect a 220-ohm resistor to the positive leg of the LED.'),
  (1, 2, 'Attach the negative leg of the LED to the ground.'),
  (1, 3, 'Power the circuit using a 9V battery and observe the LED.');

-- Insert components
INSERT INTO component (name, description, datasheet_url, buy_link)
VALUES
  ('LED (Red)', 'Standard 5mm red LED', NULL, 'https://example.com/led'),
  ('220-ohm Resistor', 'Resistor with color bands: red-red-brown-gold', NULL, 'https://example.com/resistor'),
  ('9V Battery', 'Standard 9V battery', NULL, 'https://example.com/9vbattery'),
  ('Breadboard', '400-point breadboard for prototyping', NULL, 'https://example.com/breadboard');

-- Associate components to experiment 1 (LED Blinker)
INSERT INTO experiment_component (experiment_id, component_id, quantity)
VALUES
  (1, 1, 1),  -- LED
  (1, 2, 1),  -- Resistor
  (1, 3, 1),  -- 9V Battery
  (1, 4, 1);  -- Breadboard

-- Observation by user for experiment 1
INSERT INTO observation (experiment_id, user_id, type, data)
VALUES 
  (1, 1, 'reading', 'LED blinks every 1 second'),
  (1, 1, 'note', 'Resistor gets slightly warm after prolonged use');
`;

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
