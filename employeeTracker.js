var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "whatAction",
            type: "list",
            message: "What would you like to do?",
            choices: ["View all departments",
                "View all roles",
                "View all employees",
                "Add department",
                "Add role",
                "Add employee",
                "Update employee role",
                "Exit"
            ]
        })
        .then(function (answer) {
            if (answer.whatAction === "View all departments") {
                viewDepartments();
            }
            else if (answer.whatAction === "View all roles") {
                viewRoles();
            }
            else if (answer.whatAction === "View all employees") {
                viewEmployees();
            }
            else if (answer.whatAction === "Add department") {
                addDepartment();
            }
            else if (answer.whatAction === "Add role") {
                addRole();
            }
            else if (answer.whatAction === "Add employee") {
                addEmployee();
            }
            else if (answer.whatAction === "Update employee role") {
                updateRole();
            }
            else {
                connection.end();
            }
        });
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        console.table(results);
        start();
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "newDept",
            type: "input",
            message: "What department would you like to add?"
        }
    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.newDept
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    start();
                }
            );
        });
}

function addRole() {
    inquirer.prompt([
        {
            name: "newRoleTitle",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "newRoleSalary",
            type: "input",
            message: "What salary will this role have?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "newRoleDept",
            type: "list",
            message: "In which department will this new role be?",
            choices: [
                "Engineering",
                "Sales",
                "Finance",
                "Legal"
            ]
        }
    ])
        .then(function (answer) {
            connection.query("SELECT id FROM department WHERE name = ?",
                [answer.newRoleDept], function (err, results) {
                    if (err) throw err;
                    let newRoleDeptId = results[0].id;

                    connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: answer.newRoleTitle,
                            salary: answer.newRoleSalary,
                            department_id: newRoleDeptId
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Your role was created successfully!");
                            start();
                        }
                    );
                }
            );
        });
}

function addEmployee() {
    inquirer.prompt([
        {
            name: "newFirstName",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "newLastName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "newEmpRole",
            type: "list",
            message: "What is the employee's role?",
            choices: [
                "Lead Engineer",
                "Software Engineer",
                "Sales Lead",
                "Salesperson",
                "Accountant",
                "Legal Team Lead",
                "Lawyer"
            ]
        },
        {
            name: "newEmpManager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: [
                "None",
                "Rodriguez",
                "Doe",
                "Lourd"
            ]
        }
    ]).then(function (answer) {
        connection.query("SELECT id FROM role WHERE title = ?",
            [answer.newEmpRole], function (err, results) {
                if (err) throw err;
                let newEmpRoleId = results[0].id;

                if (answer.manager = "None") {
                    insertEmployee(answer, newEmpRoleId, null);
                } else {
                    connection.query("SELECT id FROM employee WHERE last_name = ?",
                        [answer.newEmpManager], function (err, results) {
                            if (err) throw err;
                            let newEmpManagerId = results[0].id;

                            insertEmployee(employeeData, newEmpRoleId, newEmpManagerId);
                        }
                    );
                }
            }
        )
    })
}

function insertEmployee(employeeData, newEmpRoleId, newEmpManagerId) {
    connection.query(
        "INSERT INTO employee SET ?",
        {
            first_name: employeeData.newFirstName,
            last_name: employeeData.newLastName,
            role_id: newEmpRoleId,
            manager_id: newEmpManagerId
        },
        function (err) {
            if (err) throw err;
            console.log("Your role was created successfully!");
            start();
        }
    );
}

function updateRole() {
    inquirer.prompt([
        {
            name: "whichEmp",
            type: "list",
            message: "Which employee would you like to update?",
            choices: [
                "Rodriguez",
                "Doe",
                "Lourd",
                "Tupik",
                "Chan",
                "Allen",
                "Brown"
            ]
        },
        {
            name: "whichRole",
            type: "list",
            message: "What will their new role be?",
            choices: [
                "Lead Engineer",
                "Software Engineer",
                "Sales Lead",
                "Salesperson",
                "Accountant",
                "Legal Team Lead",
                "Lawyer"
            ]
        }
    ]).then(function (answer) {
        connection.query("SELECT id FROM role WHERE title = ?",
            [answer.whichRole], function (err, results) {
                if (err) throw err;
                let whichRoleId = results[0].id;
                connection.query(
                    "UPDATE employee SET ? WHERE ?", [
                        {
                            role_id: whichRoleId
                        },
                        {
                            last_name: answer.whichEmp
                        }

                    ],
                   
                    function (err) {
                        if (err) throw err;
                        console.log("Your role was updated successfully!");
                        start();
                    }
                );
            }
        )
    })
}
