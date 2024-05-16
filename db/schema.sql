DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE departments (
  departments_id SERIAL PRIMARY KEY,
  dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    roles_id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id)
    REFERENCES departments(departments_id)
    ON DELETE SET NULL
);

CREATE TABLE employees (
    employees_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(roles_id) ON DELETE SET NULL, 
    FOREIGN KEY (manager_id) REFERENCES employees(employees_id) ON DELETE SET NULL
);
