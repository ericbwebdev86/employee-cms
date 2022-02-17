const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'test123',
        database: 'employee_cms',
    },
    console.log('Connected to the <><>election<><> database!')
);

