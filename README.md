# MakeElectronics Notebook - Based on Make Electronics Third Edition
- This app helps readers of Make: Electronics (Third Edition) easily plan, document, and organize the experiments provided in the book. It also supports creating custom experiments, components, instructions, and observations.

## Live Demo
You can try the app here:  
➡️ **[MakeElectronics Notebook on Railway](https://make-electronics-notebook.up.railway.app)**  

## Features

- Create and organize experiments into user-defined sections
- Add components, step-by-step instructions, and observations to each experiment
- Supports Markdown for writing instructions and observations
- User authentication with signup/login using Passport.js
- Public view for shared experiments (read-only)
- Responsive notebook-style UI with custom backgrounds
- PostgreSQL-based backend with full CRUD functionality

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS templates, vanilla CSS
- **Database**: PostgreSQL
- **Authentication**: Passport.js 
- **Validation**: express-validator
- **Other Tools**: Markdown parser

## Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/MakeElectronicsNotebook.git
   cd MakeElectronicsNotebook
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a .env file based on .env.example:
   ```bash
   DATABASE_URL=your_postgres_connection_string
   SESSION_SECRET=your_secret
   ```
4. Initialize the database:
   ```bash
   node db/populate.js
   ```

5. Start the app
   ```bash
   node app.js
   ```

### What I learned

- How to structure a full-stack Express.js app with route controllers, models, and views
- Working with PostgreSQL using parameterized queries and connection pooling
- Managing user authentication securely with Passport.js
- Handling Markdown safely for user-generated content
- Creating a RESTful routing system, including nested routes and CRUD patterns

## Entity-relationship-diagram (ERD) of database model
![database-ERD](./diagrams/ERD_diagram_final.png)

## Project structure
```bash

MakeElectronicsNoteBook/
│
├── app.js                    # Main Express server setup
├── reload.js                 # Live reload or utility for development
├── README.md
│
├── config/                   # Configuration (e.g., Passport.js strategy)
│   └── passportConfig.js
│
├── controllers/              # Route handler logic
│   ├── experimentController.js
│   ├── indexController.js
│   ├── publicExperimentController.js
│   ├── publicSectionController.js
│   ├── sectionController.js
│   └── userController.js
│
├── db/                       # Database setup & seed scripts
│   ├── pool.js
│   └── populate.js
│
├── diagrams/                 # Diagrams or visual resources (if used)
│
├── models/                   # Database query abstraction
│   ├── experiment/
│   │   └── queries.js
│   ├── index/
│   │   └── queries.js
│   └── sections/
│       └── queries.js
│
├── public/                   # Static assets
│   ├── 404/
│   │   └── styles.css
│   ├── about/
│   │   └── styles.css
│   ├── experiment/
│   │   ├── createComponentStyles.css
│   │   ├── editComponentStyles.css
│   │   ├── markdownParser.js
│   │   └── styles.css
│   ├── images/               # Backgrounds and illustrations
│   ├── index/
│   │   └── styles.css
│   ├── login/
│   │   └── styles.css
│   ├── section/
│   │   ├── createExperimentStyles.css
│   │   └── styles.css
│   └── signup/
│       └── styles.css
│
├── routes/                   # Express route modules
│   ├── about.js
│   ├── index.js
│   ├── users.js
│   └── sections/
│       ├── experiment.js
│       ├── publicExperiment.js
│       ├── publicSections.js
│       └── sections.js
│
├── validators/              # Input validators using express-validator
│   ├── auth.js
│   ├── authValidators.js
│   ├── experiment.js
│   └── section.js
│
├── views/                    # EJS templates
│   ├── 404.ejs
│   ├── about.ejs
│   ├── index/
│   │   └── index.ejs
│   ├── experiment/
│   │   ├── createComponent.ejs
│   │   ├── createExperiment.ejs
│   │   ├── editComponent.ejs
│   │   └── experiment.ejs
│   ├── partials/
│   │   └── errors.ejs
│   ├── sections/
│   │   ├── createSection.ejs
│   │   └── sections.ejs
│   └── users/
│       ├── login.ejs
│       └── signup.ejs
│
├── .env                      # Environment variables (e.g., DB credentials)
├── package.json
└── package-lock.json
```

# Route Overview

## Public Routes

| Method | Path                                      | Description                          | Controller                      |
|--------|-------------------------------------------|------------------------------------|--------------------------------|
| GET    | /                                         | Homepage with sections list        | `indexController.sectionsListGet` |
| GET    | /about                                    | About page                        | Inline in `routes/about.js`     |
| GET    | /signup                                   | Signup form                       | `userController.signupFormGet`  |
| POST   | /signup                                   | Submit signup form                | `userController.signupFormPost` |
| GET    | /login                                    | Login form                       | `userController.loginFormGet`   |
| POST   | /login                                    | Submit login form (with rate limit and validation) | Passport local auth + `userController` |
| GET    | /logout                                   | Logout user                      | `userController.logoutFormGet`  |
| GET    | /sections/:sectionId/experiments          | Public view of experiments in a section | `sectionController.experimentsListGet` |
| GET    | /sections/:sectionId/experiments/:experimentId | Public view of specific experiment | `publicExperimentController.experimentGet` |

---

## Authenticated User Routes (Require Login)

| Method | Path                                                    | Description                         | Controller                   |
|--------|---------------------------------------------------------|-----------------------------------|------------------------------|
| GET    | /my/sections                                            | List user's sections              | (Not explicitly shown, probably `sectionController`) |
| POST   | /my/sections                                            | Create new section for user       | (Not explicitly shown)        |
| GET    | /my/sections/:sectionId/experiments                     | List experiments in user's section | `sectionsController.experimentsListGet` |
| GET    | /my/sections/:sectionId/experiments/:experimentId       | View specific experiment          | `experimentController.experimentGet` |
| GET    | /my/sections/:sectionId/experiments/createExperiment    | Form to create new experiment     | `experimentController.experimentCreateGet` |
| POST   | /my/sections/:sectionId/experiments/createExperiment    | Submit new experiment             | `experimentController.experimentCreatePost` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/delete | Delete an experiment              | `experimentController.experimentDelete` |

### Experiment Components and Instructions

| Method | Path                                                                 | Description                       | Controller                   |
|--------|----------------------------------------------------------------------|---------------------------------|------------------------------|
| GET    | /my/sections/:sectionId/experiments/:experimentId/createComponent    | Form to create component         | `experimentController.experimentCreateComponentGet` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/createComponent    | Submit component creation        | `experimentController.experimentCreateComponentPost` |
| GET    | /my/sections/:sectionId/experiments/:experimentId/editComponent/:componentId | Form to edit component           | `experimentController.experimentEditComponentGet` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/editComponent/:componentId | Submit component edits           | `experimentController.experimentEditComponentPost` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/deleteComponent/:componentId | Delete component                 | `experimentController.experimentDeleteComponentPost` |

### Instructions and Observations (Markdown content)

| Method | Path                                                                    | Description                      | Controller                   |
|--------|-------------------------------------------------------------------------|--------------------------------|------------------------------|
| POST   | /my/sections/:sectionId/experiments/:experimentId/createInstruction     | Create instruction markdown     | `experimentController.experimentCreateInstructionPost` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/editInstruction/:instId | Edit instruction markdown       | `experimentController.experimentUpdateInstructionPost` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/createObservation     | Create observation markdown     | `experimentController.experimentCreateObservationPost` |
| POST   | /my/sections/:sectionId/experiments/:experimentId/editObservation/:obsId | Edit observation markdown       | `experimentController.experimentUpdateObservationPost` |

---

## Acknowledgements
- Inspired by the book *Make: Electronics (Third Edition)* by Charles Platt


