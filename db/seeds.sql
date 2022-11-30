USE employee_db;
INSERT INTO department(dept_name)VALUES("accounting"),("human resources"),("sales");
INSERT INTO role(title, salary, dept_id) VALUES("accountant", 80000, 1),("HR rep", 90000, 2),("salesperson", 60000, 3);
INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("Emily", "Smith", 2, NULL), ("Jack", "Johnson", 1, 1),("Shea", "Hannon", 3, 1);
