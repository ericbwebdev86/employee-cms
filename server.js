//dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'test123',
        database: 'employee_cms',
    },
    console.log('Connecting to the <><>Employee CMS<><> database!')
);

db.connect(function (err) {
    if (!err) {
        console.log('  ---  Connection Success!  ---  ');
        appPrompt();
    }
    throw err;
});
// THEN I am presented with the following options: 
// view all departments, 
// view all roles, 
// view all employees, 
// add a department, 
// add a role, 
// add an employee, 
// and update an employee role
function appPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            messsage: 'What would you like to do?',
            name: 'mainMenuChoice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ])
}