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
    message: 'Select a department for the role:',
    choices: []
  },
]

const addDept = [
  {
    type: 'input',
    name: 'dept_name',
    message: 'Enter the department name:'
  }
]

const updateEmployee = [
  {
    type: 'list',
    name: 'emp_name',
    message: 'Select an employee to update:',
    choices: []
  },
  {
    type: 'list',
    name: 'emp_role',
    message: 'Select a new role for this employee:',
    choices: []
  }
]

function getAnswers() {
  inquirer.prompt(question1)
    .then(answers => {

      // ** Need to change order, exclude dept id, role id, and manager id, and replace dept id with dept name and manager id with manager name
      if (answers.question_1 === 'View all employees') {
        pool.query('SELECT * FROM roles JOIN employees ON employees.role_id = roles.id', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.table(res.rows);
            getAnswers();
            // pool.query('SELECT * FROM employees JOIN employees e1 ON e1.manager_id = employees.id', (err, res) => {
            // SELECT e1.first_name AS employees.first_name, employees.last_name, manager  FROM employees JOIN employees e1 ON e1.manager_id = employees.id;
            // })
          }
        });
      }

      // *** Quits immediately after Enter a first name prompt
      if (answers.question_1 === 'Add employee') {
        // pool.query('SELECT title FROM roles')
        // .then(({rows}) => {
        //   rows = rows.map((item) => {
        //     return item.title
        //   })
        // })
          pool.query('SELECT salary FROM roles')
          .then(({rows}) => {
            rows = rows.map((item) => {
              return item.salary
            })
            console.log('test');
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
              choices: rows
            },
            {
              type: 'list',
              name: 'emp_manager',
              message: 'Select a manager:',
              choices: rows
            }
          ]
          console.log('test2');
          inquirer.prompt(addEmployee).then(() => {
          })
          })
        .then(({emp_fname}, {emp_lname}, {emp_role}, {emp_manager}) => {
          pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',[emp_fname, emp_lname, emp_role, emp_manager], (err, res) => {
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


      // ** See Add employee first
      if (answers.question_1 === 'Update employee role') {
        inquirer.prompt(updateEmployee)
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
      
      // * Need to exclude dept id from table
      if (answers.question_1 === 'View all roles') {
        pool.query('SELECT * FROM roles JOIN departments ON roles.department_id = departments.id', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.table(res.rows)
            getAnswers();
          }
        });
        };

      // ** TypeError: Cannot destructure property 'role_salary' of 'undefined' as it is undefined.
      if (answers.question_1 === 'Add role') {
        inquirer.prompt(addRole)
        .then(({role_title}, {role_salary}, {role_dept}) => {
          pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [role_title, role_salary, role_dept], (err, res) => {
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
// SELECT e1.first_name AS employees.first_name, employees.last_name, manager  FROM employees JOIN employees e1 ON e1.manager_id = employees.id;