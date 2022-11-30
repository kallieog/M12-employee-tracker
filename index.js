//Bring in connection to mysql database
const db = require("./db/connection")
//create main menu with inquirer 
//Create view functions
//Create post functions
//Create update functions
//Create delete functions
const { printTable } = require("console-table-printer")
const inquirer = require("inquirer")
const mainMENU = () => {
    inquirer.prompt({
        type: "list",
        name: "direction",
        message: "Please select an action below",
        choices: ["view departments", "view role", "view employees", "add department", "add role", "add employee", "update employee role"]
    }).then(answers => {
        if (answers.direction === "view departments") {
            viewDepartments()
        }
        if (answers.direction === "view role") {
            viewRoles()
        }
        if (answers.direction === "view employees") {
            viewEmployees()
        }
        if (answers.direction === "add department") {
            addDepartment()
        }
        if(answers.direction === "add role") {
            addRole()
        }
        if(answers.direction === "add employee"){
            addEmployee()
        }
        if(answers.direction === "update employee role"){
            updateEmployeeRole()
        }
    })
}
const viewDepartments = () => {
    db.promise().query("SELECT * FROM department").then(([response]) => {
        printTable(response)
        mainMENU()
    });
}
const viewRoles = () => {
    db.promise().query("SELECT * FROM role").then(([response]) => {
        printTable(response)
        mainMENU()
    });
}
const viewEmployees = () => {
    db.promise().query("SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id").then(([response]) => {
        printTable(response)
        mainMENU()
    });
    //view department
}
const addDepartment = () => {
    inquirer.prompt(
        { type: "input", name: "name", message: "Enter the new department name" }
    ).then(answer => {
        const dept = { dept_name: answer.name }
        db.promise().query("INSERT INTO department SET ?", dept).then(([response]) => {
            if (response.affectedRows > 0) {
                viewDepartments()

            } else {
                console.log("failed to create department")
                mainMENU()
            }
        })
    })
}
const addRole = async() => {
    const [departments] = await db.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(({id, dept_name}) => (
        {name: dept_name, value: id}
    ))
    inquirer.prompt([
        {type: "input", name: "title", message: "Please enter the title of the new role"},
        {type: "input", name: "salary", message: "Please enter the salary of the new role"},
        {type: "list", name: "departmentId", message: "Please select department", choices: departmentArray},
    ]).then(answers => {
        const role = {title: answers.title, salary: answers.salary, dept_id: answers.departmentId}
        db.promise().query("INSERT INTO role SET ?", role).then(([response]) => {
            if (response.affectedRows > 0) {
                viewRoles()

            } else {
                console.log("failed to create role")
                mainMENU()
            }
        })
    })
}
const addEmployee = async() => {
    const [roles] = await db.promise().query("SELECT * FROM role")
    const roleArray = roles.map(({id, title}) => (
        {name: title, value: id}
    ))
    const [employees] = await db.promise().query("SELECT * FROM employee")
    const employeeArray = employees.map(({id, first_name, last_name}) => (
        {name: first_name + " " + last_name, value: id}
    ))
    const managerArray = [...employeeArray, {name: "none", value: null}]
    inquirer.prompt([
        {type: "input", name: "first", message: "Please enter the first name of employee"},
        {type: "input", name: "last", message: "Please enter the last name of employee"},
        {type: "list", name: "roleId", message: "Please select role", choices: roleArray},
        {type: "list", name: "managerId", message: "Please select manager", choices: managerArray},
    ]).then(answers => {
        const employee = {first_name: answers.first, last_name: answers.last, role_id: answers.roleId, manager_id: answers.managerId}
        db.promise().query("INSERT INTO employee SET ?", employee).then(([response]) => {
            if (response.affectedRows > 0) {
                viewEmployees()

            } else {
                console.log("failed to create employee")
                mainMENU()
            }
        })
    })
}
const updateEmployeeRole = async() => {
    const [employees] = await db.promise().query("SELECT * FROM employee")
    const employeeArray = employees.map(({id, first_name, last_name}) => (
        {name: first_name + " " + last_name, value: id}
    ))
    const [roles] = await db.promise().query("SELECT * FROM role")
    const roleArray = roles.map(({id, title}) => (
        {name: title, value: id}
    ))
    inquirer.prompt([
        {type: "list", name: "employeeId", message: "Please select employee to update", choices: employeeArray},
        {type: "list", name: "roleId", message: "Please select role", choices: roleArray},
    ]).then(answers => {
        
        db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.roleId, answers.employeeId]).then(([response]) => {
            if (response.affectedRows > 0) {
                viewEmployees()

            } else {
                console.log("failed to create employee")
                mainMENU()
            }
        })
    })
}
mainMENU()

