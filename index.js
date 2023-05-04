const inquirer = require("inquirer");
const mysql = require("mysql2"); 
const cTable = require("console.table");
const db = mysql.createConnection(
    {
        host: "127.0.0.1",
        user: "root",
        password: "$milingTurtle421",
        database: "employees_db",
    },
    console.log("Database")
);
console.table(
    `
    '########:'##::::'##:'########::'##::::::::'#######::'##:::'##:'########:'########:
     ##.....:: ###::'###: ##.... ##: ##:::::::'##.... ##:. ##:'##:: ##.....:: ##.....::
     ##::::::: ####'####: ##:::: ##: ##::::::: ##:::: ##::. ####::: ##::::::: ##:::::::
     ######::: ## ### ##: ########:: ##::::::: ##:::: ##:::. ##:::: ######::: ######:::
     ##...:::: ##. #: ##: ##.....::: ##::::::: ##:::: ##:::: ##:::: ##...:::: ##...::::
     ##::::::: ##:.:: ##: ##:::::::: ##::::::: ##:::: ##:::: ##:::: ##::::::: ##:::::::
     ########: ##:::: ##: ##:::::::: ########:. #######::::: ##:::: ########: ########:
    ........::..:::::..::..:::::::::........:::.......::::::..:::::........::........::
    ::::::'########:'########:::::'###:::::'######::'##:::'##:'########:'########:::::
    ::::::... ##..:: ##.... ##:::'## ##:::'##... ##: ##::'##:: ##.....:: ##.... ##::::
    ::::::::: ##:::: ##:::: ##::'##:. ##:: ##:::..:: ##:'##::: ##::::::: ##:::: ##::::
    ::::::::: ##:::: ########::'##:::. ##: ##::::::: #####:::: ######::: ########:::::
    ::::::::: ##:::: ##.. ##::: #########: ##::::::: ##. ##::: ##...:::: ##.. ##::::::
    ::::::::: ##:::: ##::. ##:: ##.... ##: ##::: ##: ##:. ##:: ##::::::: ##::. ##:::::
    ::::::::: ##:::: ##:::. ##: ##:::: ##:. ######:: ##::. ##: ########: ##:::. ##::::
    :::::::::..:::::..:::::..::..:::::..:::......:::..::::..::........::..:::::..::::: `
  );


const userInput = async () => {
    try {
        const ans = await inquirer.prompt({
            type: "list",
            name: "options",
            message:"Please choose one of these options",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add A Department",
                "Add A Role",
                "Add An Employee",
                "Update An Employee Role",
                "Quit"
            ],
        });
        switch (ans.options) {
            case "View All Departments":
             viewAllDepartments();
              break;

            case "View All Roles":
             viewAllRoles();
              break;

            case "View All Employees":
             viewAllEmployees();
              break;
            
            case "Add Department":
             addDepartment();
              break;

            case "Add Employee":
             addEmployee();
              break;

            case "Add Role":
            addRole();
              break;

            case "Update Employee Role":
            updateEmployeeRole();
              break;

            case "Quit":
             console.log("Goodbye");
             return;
        }
    } catch(err) {
        console.log(err);
    }
};

// Functions


async function viewAllRoles() {
    const [roles] = await db.promise().query(`SELECT * FROM roles`);
     console.table(roles);
      userInput();
}
async function viewAllEmployees() {
    const [employees] = await db.promise().query(`SELECT * FROM employees`);
     console.table(employees);
      userInput();
}
async function addDepartment() {
    const ans = await inquirer.prompt({
        type: "input",
        name: "department",
        message: "Please enter the department you would like to add",
    });
    await db
    .promise()
    .query(`INSERT INTO department (name) VALUES ('${ans.department}')`);
  viewAllDepartments();
}
async function addEmployee() {
    const [roles] = await db.promise().query(`SELECT * FROM role`);
    const [employees] = await db.promise().query(`SELECT * FROM employee`);
    console.log(employees);
    const ans = await inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Please enter your first name",
        },
        {
            type: "input",
            name: "last_name",
            message: "Please enter your last name",
        },
        {
            type: "list",
            name: "role_id",
            message: "Please choose your role below",
            choices: roles.map(({ title,id }) => ({
                name: title,
                value: id,
            })),
        },
        {
            type: "list",
            name: "manager_id",
            message: "Please choose the manager of this employee",
            choices: employees.map(({ first_name, last_name, id}) => ({
                name: `${first_name} ${last_name}`,
                value: id,
            })),
        },
    ]);
    console.log(ans);
    await db
        .promise()
        .query(`INSERT INTO employees (first_name,last_name,role_id,manager_id) VALUES ('${ans.first_name}','${ans.last_name}', ${ans.role_id}, ${ans.manager_id})`
        );
    viewAllEmployees();
}
async function addRole() {
    const [departments] = await db.promise().query(`SELECT * FROM department`);
    const ans = await inquirer.prompt([
        {
            type: "input",
            name: "newRole",
            message: "What is the new role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the new salary?",
        },
        {
            type: "list",
            name: "department",
            message: "What is the new department?",
            choices: departments.map(({ name, id }) => ({
                name: name,
                value: id,
            })),
        },
    ]);
    console.log(ans);
    await db
    .promise()
    .query(`INSERT INTO role (newRole,salary,department_id) VALUES ('${ans.title}', '${ans.salary}', '${ans.department}')`
    );
viewAllRoles();
}

async function updateEmployeeRole() {
    const [employees] = await db.promise().query(`SELECT * FROM employees`);
    const [roles] = await db.promise().query(`SELECT * FROM roles`);
    const ans = await inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee would you like to change their role?",
            choices: employees.map(({ first_name, last_name, id }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
            })),
        },
        {
            type: "list",
            name: "role",
            message: "What is their new role?",
            choices: roles.map(({title,id}) => ({
                name: title,
                value: id,
            })),
        },
    ]);
    await db
    .promise().query(`UPDATE employee SET role_id = ${ans.role} WHERE id = ${ans.employee}`
    );
    viewAllEmployees();
}
userInput();


