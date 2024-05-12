const { Pool } = require('pg');
const inquirer = require('inquirer');

// Connect to database
const pool = new Pool(
  {
    user: 'postgres',
    password: 'MyPassword123',
    host: 'localhost',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
)

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Error connecting to PostgreSQL database', err));

const question1 = [
  {
    type: 'list',
    name: 'question_1',
    message: 'What would you like to do?',
    choices: ['View all employees',
              'Add employee',
              'Update employee role', 
              'View all roles',
              'Add role',
              'View all departments',
              'Add department',
              'Quit']
  }
]

const addEmployee = [
  {
    type: 'input',
    name: 'employee_first_name',
    message: 'Enter a first name:'
  },
  {
    type: 'input',
    name: 'employee_last_name',
    message: 'Enter a last name:'
  },
  {
    type: 'list',
    name: 'employee_role',
    message: 'Select a role:',
    choices: []
  }
]

function getAnswers() {
  inquirer.prompt(question1)
    .then(answers => {
      if (answers.question_1 === 'View all employees') {
        pool.query('SELECT * FROM roles JOIN employees ON employees.role_id = roles.id', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.log('Query result:', res.rows)
            getAnswers();
          }
        });
      }

      if (answers.question_1 === 'Add employee') {
        inquirer.prompt(addEmployee)
        .then(answers => {
          pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ()', (err, res) => {
            if (err) {
              console.error('Error executing query', err);
              getAnswers();
            } else {
              console.log('Query result:', res.rows)
              getAnswers();
            }
        })
        });
      }

      if (answers.question_1 === 'Update employee role') {
        inquirer.prompt(addEmployee)
        .then()
        };

      if (answers.question_1 === 'View all roles') {
        pool.query('SELECT * FROM roles', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.log('Query result:', res.rows)
            getAnswers();
          }
        });
        };

      if (answers.question_1 === 'Add role') {
        inquirer.prompt(addEmployee)
        .then()
        };

      if (answers.question_1 === 'View all departments') {
        pool.query('SELECT * FROM departments', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.log('Query result:', res.rows)
            getAnswers();
          }
        });
        };

      if (answers.question_1 === 'Add department') {
        inquirer.prompt(addEmployee)
        .then()
        };

      if (answers.question_1 === 'Quit') {
        inquirer.prompt(addEmployee)
        .then()
        };
    })
  }

getAnswers();
