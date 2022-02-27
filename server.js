//dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

//connection params for database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'test123',
        database: 'employee_cms',
    },
    console.log('Connecting to the Employee CMS database!')
);

//connect to db on app launch, also call appprompt function
db.connect(function (err) {
    if (!err) {
        console.log('  ---  Connection Success!  ---  ');
        appPrompt();
    } else {
        throw err;
    }
});
//main inquirer prompt for the app
const appPrompt = () => {
    console.log(`
    ()()()()()()()()()
    ()   MAIN MENU  ()
    ()()()()()()()()()
    `)
    inquirer.prompt([
        {
            type: 'list',
            messsage: 'What would you like to do?',
            name: 'listChoices',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        }
    ]).then((answers) => {
        //if view all depts is chosen then display the results of query
        if (answers.listChoices === 'View all departments') {
            db.query("SELECT * FROM department;",
                function (err, results, fields) {
                    console.table(results);
                    appPrompt();
                })
        }
        if (answers.listChoices === 'View all roles') {
            //if view roles is chosen then display the results of query
            db.query("SELECT employee_role.title, department.department_name AS department, employee_role.salary FROM employee_role INNER JOIN department ON employee_role.department_id = department.id;",
                function (err, results, fields) {
                    console.table(results);
                    appPrompt();
                })
        }
        if (answers.listChoices === 'View all employees') {
            //if view all employees is chosen then display the results of query
            db.query(`SELECT employee.first_name, employee.last_name, employee_role.title, department.department_name AS department, employee_role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee_role ON employee.role_id = employee_role.id LEFT JOIN department ON employee_role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`,
                function (err, results, fields) {
                    console.table(results);
                    appPrompt();
                })
        }
        if (answers.listChoices === 'Add a department') {
            addDept();
        }
        if (answers.listChoices === 'Add a role') {
            addEmployeeRole();
        }
        if (answers.listChoices === 'Add an employee') {
            addEmployee();
        }
        if (answers.listChoices === 'Update an employee role') {
            updateEmployeeRole();
        }
    });
};
addDept = () => {
    console.log(`
    ()()()()()()()()()()()
    ()  Add Department  ()
    ()()()()()()()()()()()
    `)
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptInput',
            message: 'Please enter the department that you would like to add.',
            validate: deptInput => {
                if (deptInput) {
                    return true;
                } else {
                    console.log('please enter a department name')
                    return false;
                }
            }
        }
    ]).then(answers => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        //take department input and use it as the value in the above sql query then return to main menu
        db.query(sql, answers.deptInput, function (err, results, fields) {
            appPrompt();
        })
    })
}
addEmployeeRole = () => {
    console.log(`
    ()()()()()()()()()()()()
    ()      Add Role      ()
    ()()()()()()()()()()()()
    `);
    const sql = 'select department.id, department.department_name from department';
    db.query(sql, (err, results) => {
        //run query to get department ids and department names from department, organize in array and use as choices
        const department = results.map(({ id, department_name }) => ({ name: department_name, value: id }));
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleInput',
                message: 'Please enter the role that you would like to add.',
                validate: roleInput => {
                    if (roleInput) {
                        return true;
                    } else {
                        console.log('please enter the name of the new role')
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salaryInput',
                message: 'Please enter the salary for new role.',
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log('please enter the salary of the new role')
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'roleDeptInput',
                message: 'Which department would you like to add it to?',
                choices: department
            }
        ]).then(answers => {
            const sql = 'INSERT INTO employee_role (title, salary, department_id) VALUES (?, ?, ?)'
            //use the inputs from the 3 questions as values in the above query to make new role, then return to main menu
            db.query(sql, [answers.roleInput, answers.salaryInput, answers.roleDeptInput], function (err, results, fields) {
                appPrompt();
            })
        });
    })
}
addEmployee = () => {
    console.log(`
    ()()()()()()()()()()()
    ()   Add Employee   ()
    ()()()()()()()()()()()
    `)
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter the first name of the employee',
            validate: firstName => {
                if (firstName) {
                    return true;
                } else {
                    console.log('please enter the first name of the new employee')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter the last name of the employee',
            validate: lastName => {
                if (lastName) {
                    return true;
                } else {
                    console.log('please enter the last name of the employee')
                    return false;
                }
            }
        }
    ]).then(answers => {
        const newEmployee = [answers.firstName, answers.lastName];
        let roleQuery = 'SELECT employee_role.id, employee_role.title from employee_role'
        db.query(roleQuery, (err, results) => {
            //get id and title and map them to array for use in choices
            const roleArray = results.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'roleChoice',
                    message: 'Please select a role for the new employee',
                    choices: roleArray
                }
            ]).then(answers => {
            let role = answers.roleChoice;
            newEmployee.push(role);
            const mgrQuery = 'SELECT * FROM employee';
            db.query(mgrQuery, function (err, results) {
                //get all of the employees put the first and last names together mapped in an array for choices
                mgrArray = results.map(({ id, first_name, last_name }) => ({name: first_name + " " + last_name, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'mgrChoice',
                        message: 'Please select a manager for the new employee',
                        choices: mgrArray
                    }
                ]).then(answers => {
            let manager = answers.mgrChoice
            newEmployee.push(manager);
            const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)';
            //take all of the inputs and use them as values for the above query, then go back to main menu
            db.query(sql, newEmployee, function (err, results, fields) {
                appPrompt();
            });
        });
    });
});
});
});      
};
updateEmployeeRole = () => {
    console.log(`
    ()()()()()()()()()()()
    ()   Update  Role   ()
    ()()()()()()()()()()()
    `)
    const employeeQuery = 'SELECT * FROM employee';
    db.query(employeeQuery, (err, results) => {
        employeeArray = results.map(({ id, first_name, last_name }) => ({name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Please select an employee to update',
                choices: employeeArray
            }])
            .then(answers => {
                let selectedEmployee = answers.employee;
                const queryValues = [];
                queryValues.push(selectedEmployee);
                const sql = `SELECT * FROM employee_role`;
                db.query(sql, function (err, results) {
                    const roleArray = results.map(({ id, title }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Please select a role to assign to the employee',
                            choices: roleArray
                        }
                    ]).then(answers => {
                        let selectedRole = answers.role;
                        queryValues.push(selectedRole);
                        queryValues[0] = selectedRole;
                        queryValues[1] = selectedEmployee;
                        const updateRole = 'UPDATE employee SET role_id = ? WHERE id = ?';
                        //took the input from both questions that are asked in an order that makes sense to humans
                        //HOWEVER the query wants the values for role THEN employee
                        //had to rearragne the values for the indeces int he array then use the array as values for the query, then return to main menu
                        db.query(updateRole, queryValues, (err, results) => {
                            appPrompt();
                        });
                    });
                });
            });
        });
};