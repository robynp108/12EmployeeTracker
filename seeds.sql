INSERT INTO department (name)
VALUES ("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 1), ("Software Engineer", 120000, 1), ("Sales Lead", 100000, 2), ("Salesperson", 80000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ashley", "Rodriguez", 1, NULL), ("John", "Doe", 3, NULL), ("Sarah", "Lourd", 6, NULL), ("Kevin", "Tupik", 2, 1), ("Mike", "Chan", 4, 2), ("Tom", "Allen", 7, 3), ("Malia", "Brown", 5, NULL);
