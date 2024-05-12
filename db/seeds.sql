INSERT INTO departments (dept_name)
VALUES ('Accounting'),
       ('Finance'),
       ('Human Resources'),
       ('IT'),
       ('Marketing'),
       ('R & D'),
       ('Management');

INSERT INTO roles (title, salary, department_id)
VALUES ('CEO', 300000, 7),
       ('CFO', 250000, 2),
       ('CMO', 200000, 5),
       ('CTO', 150000, 4),
       ('President', 100000, 6),
       ('Vice President', 75000, 1),
       ('Manager', 50000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Ursula', 'Leroi', 1, null),
       ('Geraldine', 'Cailin', 2, 1),
       ('Brinley', 'Peregrine', 6, 1),
       ('Amanda', 'Rochelle', 3, 1),
       ('Alphonzo', 'Darien', 7, 1),
       ('Marlene', 'Janel', 5, 1),
       ('Jarred', 'Merriweather', 4, 1),
       ('Greg', 'Haywood', 7, 1),
       ('Dean', 'Inez', 7, 1);
       
