const { Pool } = require('pg');
const inquirer = require('inquirer');

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

const addRole = [
  {
    type: 'input',
    name: 'role_title',
    message: 'Enter role title:'
  },
  {
    type: 'input',
    name: 'role_salary',
    message: 'Enter a salary number (without any punctuation):'
  },
  {
    type: 'input',
    name: 'role_dept',
    message: 'Enter a department for the role:'
  },
]

const addDept = [
  {
    type: 'input',
    name: 'dept_name',
    message: 'Enter the department name:'
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
            // pool.query('SELECT * FROM employees JOIN employees e1 ON e1.manager_id = employees.id', (err, res) => {

            // })
          }
        });
      }

      if (answers.question_1 === 'Add employee') {
        pool.query('SELECT title FROM roles')
        .then(({rows}) => {
          rows = rows.map((item) => {
            return item.title
          })
        })
          pool.query('SELECT salary FROM roles')
          .then(({rows}) => {
            rows = rows.map((item) => {
              return item.title
            })
          const addEmployee = [
            {
              type: 'input',
              name: 'emp_fname',
              message: 'Enter a first name:'
            },
            {
              type: 'input',
              name: 'emp_lname',
              message: 'Enter a last name:'
            },
            {
              type: 'list',
              name: 'emp_role',
              message: 'Select a role:',
              choices: [rows]
            },
            {
              type: 'list',
              name: 'emp_manager',
              message: 'Select a manager:',
              choices: [rows]
            }
          ]
          inquirer.prompt(addEmployee)
          })
        .then(answers => {
          pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',[answers], (err, res) => {
            if (err) {
              console.error('Error executing query', err);
              getAnswers();
            } else {
              console.log('Employee added successfully!');
              getAnswers();
            }
        })
        });
      }

      if (answers.question_1 === 'Update employee role') {
        inquirer.prompt(addEmployee)
        .then(answers => {
          pool.query('UPDATE employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers], (err, res) => {
            if (err) {
              console.error('Error executing query', err);
              getAnswers();
            } else {
              console.log('Employee role updated successfully!');
              getAnswers();
            }
        })
        });
        };

      if (answers.question_1 === 'View all roles') {
        pool.query('SELECT * FROM roles', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.table(res.rows)
            getAnswers();
          }
        });
        };

      if (answers.question_1 === 'Add role') {
        inquirer.prompt()
        .then(answers => {
          pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers], (err, res) => {
            if (err) {
              console.error('Error executing query', err);
              getAnswers();
            } else {
              console.log('Role added successfully!');
              getAnswers();
            }
        })
        });
        };

      if (answers.question_1 === 'View all departments') {
        pool.query('SELECT * FROM departments', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.table(res.rows)
            getAnswers();
          }
        });
        };

      if (answers.question_1 === 'Add department') {
        inquirer.prompt(addDept)
        .then(({dept_name}) => {
          console.log(dept_name);
          pool.query('INSERT INTO departments (dept_name) VALUES ($1)', [dept_name], (err, res) => {
            if (err) {
              console.error('Error executing query', err);
              getAnswers();
            } else {
              console.log('Department added successfully!');
              getAnswers();
            }
        })
        });
        };

      if (answers.question_1 === 'Quit') {
        console.log('Have a nice day!')
        process.exit();
        };
    })
  }

getAnswers();

// SELECT * FROM employees JOIN employees e1 ON e1.manager_id = employees.id;
// SELECT e1.first_name AS manager, employees.first_name, employees.last_name  FROM employees JOIN employees e1 ON e1.manager_id = employees.id;