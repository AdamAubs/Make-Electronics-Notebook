# MakeElectronicsNoteBook - Based on Make Electronics Third Edition

- Helps readers easily plan and document experiments given 
in the book. Also allows user to create there own experiments


## Entity-relationship-diagram (ERD)of database model
![database-ERD](./diagrams/experiment_erd_readable.png)

## Initial project structure

```bash
```
```bash
/your-app
│
├── /views               # EJS templates (sections, experiments, etc.)
├── /public              # CSS, client-side JS, images
├── /routes              # Route handlers (sections.js, experiments.js)
├── /controllers         # Business logic separated from routes
├── /models              # SQL queries or ORM logic
├── /db                  # DB connection setup
├── app.js               # Main server file
├── .env                 # Environment variables (DB creds, PORT)
└── package.json
```
```
```
```
```
```
```
```
```
```
```
```


## Routes
GET    /                → Public homepage or dashboard
GET    /my/sections     → List of *user's* sections
POST   /my/sections     → Add new section (for the user)
GET    /my/sections/:sectionId → View specific section (optional)
GET    /my/sections/:sectionId/experiments     → Experiments in this user's section
POST   /my/sections/:sectionId/experiments     → Add experiment to this section
GET    /my/sections/:sectionId/experiments/:experimentId → Specific experiment details 

## Controllers 
indexController() - coordinates getting information for showing to homepage
usersController() - coordinates handling users


## Development Todo list
1. ~~set up project structure and database~~
2. ~~Create script to set up tables for database and add sample data~~
3. ~~set up server - app.js~~
4. set up routes - /routes (updating...)
5. set uo controllers - /controller (set up core controllers but still updating)
  - set up error handling - /controller (NEXT STEP)
6. set up db models - /models (still in progress but retrieves basic data from db)
7. Add experiments to db - /routes /controller /models
8. Work on intutive way of acessing shared sections across users

possible desgin idea going forward: Instruct user that this app follow the book. Then
                                    explain how to add a new section from the book as well
                                    as walk through documenting an experiment from it.
