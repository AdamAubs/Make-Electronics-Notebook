# MakeElectronicsNoteBook - Based on Make Electronics Third Edition

- Helps readers easily plan and document experiments given 
in the book. Also allows user to create there own experiments


## Entity-relationship-diagram (ERD)of database model
![database-ERD](./diagrams/experiment_erd_readable.png)

## Project structure
```bash
```
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



