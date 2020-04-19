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
        console.log(results);
        start();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        console.log(results);
        start();
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        console.log(results);
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
                    // re-prompt the user for if they want to bid or post
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
            type: "input",
            message: "In which department will this new role be?"
        }
    ])
        .then(function (answer) {
            connection.query("SELECT id FROM department WHERE name = ?",
                [answer.newRoleDept], function (err, results) {
                    if (err) throw err;
                    let newRoleDeptId = results[0].id;

                    console.log(newRoleDeptId);
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
                            // re-prompt the user for if they want to bid or post
                            start();
                        }
                    );
                }
            );

        });
}

// function addEmployee() {
//     inquirer.prompt([
//         {
//             name: "newEmployee",
//             type: "input",
//             message: "What employee would you like to add?"
//         }
//     ])
//         .then(function (answer) {
//             connection.query(
//                 "INSERT INTO employee SET ?",
//                 {
//                     name: answer.newRole
//                 },
//                 function (err) {
//                     if (err) throw err;
//                     console.log("Your employee was created successfully!");
//                     start();
//                 }
//             );
//         });
// }