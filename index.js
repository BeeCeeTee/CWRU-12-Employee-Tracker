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
        pool.query('SELECT employees.employees_id, employees.first_name, employees.last_name, title, salary, dept_name, manager.first_name, manager.last_name FROM roles JOIN employees ON employees.role_id = roles.roles_id JOIN departments ON roles.department_id = departments.departments_id JOIN employees manager ON employees.manager_id = manager.employees_id;', (err, res) => {
          if (err) {
            console.error('Error executing query', err);
            getAnswers();
          } else {
            console.table(res.rows);
            getAnswers();
          }
        });
      }

      if (answers.question_1 === 'Add employee') {
        pool.query('SELECT title, roles_id FROM roles')
          .then(({ rows }) => {
            let roles = rows.map((item) => {
              return { name: item.title, value: item.roles_id }
            })
            pool.query('SELECT first_name, last_name, employees_id FROM employees WHERE manager_id IS null')
              .then(({ rows }) => {
                let managers = rows.map((item) => {
                  return { name: item.first_name.concat(" ", item.last_name), value: item.employees_id }
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
                    choices: roles
                  },
                  {
                    type: 'list',
                    name: 'emp_manager',
                    message: 'Select a manager:',
                    choices: managers
                  }
                ]
                inquirer.prompt(addEmployee).then(({ emp_fname, emp_lname, emp_role, emp_manager }) => {
                  pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [emp_fname, emp_lname, emp_role, emp_manager], (err, res) => {
                    if (err) {
                      console.error('Error executing query', err);
                      getAnswers();
                    } else {
                      console.log('Employee added successfully!');
                      getAnswers();
                    }
                  })
                });
              })
          })
      }

      if (answers.question_1 === 'Update employee role') {
        pool.query('SELECT first_name, last_name, employees_id FROM employees')
          .then(({ rows }) => {
            let employee = rows.map((item) => {
              return { name: item.first_name.concat(" ", item.last_name), value: item.employees_id }
            })
            pool.query('SELECT title, roles_id FROM roles')
              .then(({ rows }) => {
                let role = rows.map((item) => {
                  return { name: item.title, value: item.roles_id }
                })
                const updateEmployee = [
                  {
                    type: 'list',
                    name: 'emp_name',
                    message: 'Select an employee to update:',
                    choices: employee
                  },
                  {
                    type: 'list',
                    name: 'emp_role',
                    message: 'Select a new role for this employee:',
                    choices: role
                  }
                ]
                inquirer.prompt(updateEmployee).then(({ emp_name, emp_role }) => {
                  pool.query('UPDATE employees SET role_id = $2 WHERE employees_id = $1', [emp_name, emp_role], (err, res) => {
                    if (err) {
                      console.error('Error executing query', err);
                      getAnswers();
                    } else {
                      console.log('Employee role updated successfully!');
                      getAnswers();
                    }
                  })
                })
              })
          })
      }



      if (answers.question_1 === 'View all roles') {
        pool.query('SELECT roles_id, title, salary, dept_name FROM roles JOIN departments ON roles.department_id = departments.departments_id', (err, res) => {
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
        pool.query('SELECT departments_id, dept_name FROM departments')
          .then(({ rows }) => {
            dept = rows.map((item) => {
              return { name: item.dept_name, value: item.departments_id }
            })
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
                type: 'list',
                name: 'role_dept',
                message: 'Select a department for the role:',
                choices: dept
              },
            ]
            inquirer.prompt(addRole).then(({ role_title, role_salary, role_dept }) => {
              pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [role_title, role_salary, role_dept], (err, res) => {
                if (err) {
                  console.error('Error executing query', err);
                  getAnswers();
                } else {
                  console.log('Role added successfully!');
                  getAnswers();
                }
              })
            })
          })
      }

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
          .then(({ dept_name }) => {
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