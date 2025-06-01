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
  ('Experiment 1', 'Taste the Power', 1, 1, true),
  ('Experiment 2', 'Go with the Flow', 1, 1, true),
  ('Experiment 3', 'Applying Pressure', 1, 1, true),
  ('Experiment 4', 'Heat and Power', 1, 1, true),
  ('Experiment 5', 'Let''s Make a Battery', 1, 1, true),

  -- Section Two
  ('Experiment 6', 'Getting Connected', 2, 1, true),
  ('Experiment 7', 'Investigating a Relay', 2, 1, true),
  ('Experiment 8', 'A Relay Oscillator', 2, 1, true),
  ('Experiment 9', 'Time and Capacitors', 2, 1, true),
  ('Experiment 10', 'Transistor Switching', 2, 1, true),
  ('Experiment 11', 'Light and Sound', 2, 1, true),

   -- Section Three
  ('Experiment 12', 'Joining Two Wires Together', 3, 1, true),
  ('Experiment 13', 'Roasting an LED', 3, 1, true),
  ('Experiment 14', 'A Wearable Multivibrator', 3, 1, true),

  -- Section Four
  ('Experiment 15', 'Emitting a Pulse', 4, 1, true),
  ('Experiment 16', 'Set Your Tone', 4, 1, true),
  ('Experiment 17', 'An Alarming Idea', 4, 1, true),
  ('Experiment 18', 'Reflex Tester', 4, 1, true),
  ('Experiment 19', 'Learning Logic', 4, 1, true),
  ('Experiment 20', 'The Unlocker', 4, 1, true),
  ('Experiment 21', 'The Button Blocker', 4, 1, true),
  ('Experiment 22', 'Flipping and Bouncing', 4, 1, true),
  ('Experiment 23', 'Nice Dice', 4, 1, true),

  -- Section Five
  ('Experiment 24', 'Magnetism', 5, 1, true),
  ('Experiment 25', 'Tabletop Power Generation', 5, 1, true),
  ('Experiment 26', 'Loudspeaker Destruction', 5, 1, true),
  ('Experiment 27', 'Making a Coil React', 5, 1, true),
  ('Experiment 28', 'One Radio, No Solder, No Power', 5, 1, true),
  ('Experiment 29', 'Hardware Meets Software', 5, 1, true),
  ('Experiment 30', 'Nicer Dice', 5, 1, true),
  ('Experiment 31', 'The Learning Process', 5, 1, true);
`;

async function main() {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
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
