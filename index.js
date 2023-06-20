const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');


const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "$milingTurtle421",
    database: "employees_db",
  },
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
:::::::::..:::::..:::::..::..:::::..:::......:::..::::..::........::..:::::..::::: `);

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
  :::::::::..:::::..:::::..::..:::::..:::......:::..::::..::........::..:::::..::::: `);
  
  const startApp = async () => {
      try {
          const ans = await inquirer.prompt({
              type: "list",
              name: "options",
              message: "What would you like to do?",
              choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role", "Quit"]
          });
          switch (ans.options) {
              case "View All Departments":
                  await viewAllDepts();
                  break;
              case "View All Roles":
                  await viewAllRoles();
                  break;
              case "View All Employees":
                  await viewAllEmployees();
                  break;
              case "Add A Department":
                  await addDept();
                  break;
              case "Add A Role":
                  await addRole();
                  break;
              case "Add An Employee":
                  await addEmployee();
                  break;
              case "Update An Employee Role":
                  await updateEmployeeRole();
                  break;
              case "Quit":
                  console.log("Bye!");
                  return;
          }
          await startApp();
      } catch(err) {
          console.log(err);
      }
  };
  
  
  // VIEW FUNCTIONS ======================================================================================
      // view all depts ()
  const viewAllDepts = async () => {
      const [rows, fields] = await db.promise().query(`SELECT id, name FROM departments`);
      console.table(rows);
  };
  
      // view all roles ()
  const viewAllRoles = async () => {
      const queryStr = `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles
      LEFT JOIN departments ON roles.department_id = departments.id`;
      const [rows, fields] = await db.promise().query(queryStr);
      console.table(rows);
  };
  
      // view all employees ()
  const viewAllEmployees = async () => {
      const queryStr = `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, departments.name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees m ON employees.manager_id = m.id`;
      const [rows, fields] = await db.promise().query(queryStr);
      console.table(rows);
  };
  
  
  // ADD FUNCTIONS =======================================================================================
      // add dept ()
  const addDept = async () => {
      const dept = await inquirer.prompt({
          type: "input",
          name: "name",
          message: "Enter the name of the new department."
      });
      await db.promise().query(`INSERT INTO departments(name) VALUES (?)`, dept.name);
      console.log(`${dept.name} department has been added to the database!\n`);
  };
  
      // add role ()
  const addRole = async () => {
          // getting departments to display in choices
      const [deptRows, deptFields] = await db.promise().query(`SELECT id, name FROM departments`);
      const deptChoices = deptRows.map((dept) => {
          return {name: dept.name, value: dept.id};
      });
      const role = await inquirer.prompt([
          {
              type: "input",
              name: "title",
              message: "Enter the title of the new role."
          },
          {
              type: "input",
              name: "salary",
              message: "Enter the salary of the new role."
          },
          {
              type: "list",
              name: "department",
              message: "Select the department the new role is in.",
              choices: deptChoices
          }
      ]);
      await db.promise().query(`INSERT INTO roles(title, salary, department_id) VALUES (?, ?, ?)`, [role.title, role.salary, role.department]);
      console.log(`${role.title} role has been added to the database!\n`);
  };
  
      // add employee ()
  const addEmployee = async () => {
          // getting roles to display in choices
      const [roleRows, roleFields] = await db.promise().query(`SELECT id, title FROM roles`);
      const roleChoices = roleRows.map((role) => {
          return {name: role.title, value: role.id};
      });
          // getting employees to display in choices
      const [empRows, empFields] = await db.promise().query(`SELECT id, first_name, last_name FROM employees`);
      const empChoices = empRows.map((emp) => {
          return {name: `${emp.first_name} ${emp.last_name}`, value: emp.id};
      });
      const employee = await inquirer.prompt([
          {
              type: "input",
              name: "first_name",
              message: "Enter the first name of the new employee:",
            },
            {
              type: "input",
              name: "last_name",
              message: "Enter the last name of the new employee:",
            },
            {
              type: "list",
              name: "role",
              message: "Select the role of the new employee:",
              choices: roleChoices,
            },
            {
              type: "list",
              name: "manager",
              message: "Select the manager of the new employee:",
              choices: [{name: "None", value: null}, ...empChoices],
            },
      ]);
      await db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [employee.first_name, employee.last_name, employee.role, employee.manager]);
      console.log(`${employee.first_name} ${employee.last_name} has been added to the database!\n`);
  };
  
  
  // UPDATE FUNCTIONS ====================================================================================
      // update employee role ()
  const updateEmployeeRole = async () => {
          // getting employees to display in choices
      const [empRows, empFields] = await db.promise().query(`SELECT id, first_name, last_name FROM employees`);
      const empChoices = empRows.map((emp) => {
          return {name: `${emp.first_name} ${emp.last_name}`, value: emp.id};
      });
          // getting roles to display in choices
      const [roleRows, roleFields] = await db.promise().query(`SELECT id, title FROM roles`);
      const roleChoices = roleRows.map((role) => {
          return {name: role.title, value: role.id};
      });
      const update = await inquirer.prompt([
          {
              type: "list",
              name: "employee",
              message: "Select the employee whose role you want to update.",
              choices: empChoices
          },
          {
              type: "list",
              name: "role",
              message: "Select the new role for the employee.",
              choices: roleChoices
          }
      ]);
      const [rows, fields] = await db.promise().query(`UPDATE employees SET role_id = ? WHERE id = ?`, [update.role, update.employee]);
      console.log(`${rows.affectedRows} employee has been updated with a new role!\n`);
  };
  
  
  startApp();