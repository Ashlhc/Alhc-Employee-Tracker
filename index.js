const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3306;

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "$milingTurtle421",
    database: "employees_db",
  },
  console.log(`Connected to the employee_db database.`)
);


function userInput() {
    inquirer.prompt({
            type: "list",
            name: "options",
            message:"Please choose one of these options",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Quit"
            ],
        }
        ).then(function (answers) {
        switch (answers.options) {
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
});
}

function viewAllEmployees() {
    db.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees manager ON employees.manager_id = manager.id
      ORDER BY employees.id;
    `, function (err, res) {
      if (err) throw err;
      console.table(res);
      userInput();
    });
  }
  
//  when they click on update employee role they will have to enter the id of the employee and the new role id you want to assign to them
function updateEmployeeRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is id of the employee whose role you want to update:",
          name: "employeesId",
        },
        {
          type: "input",
          message: "Enter the ID of the new role:",
          name: "rolesId",
        },
      ])
      .then((res) => {
        const employeesId = parseInt(res.employeesId);
        const rolesId = parseInt(res.rolesId);
  
        db.query(
          "UPDATE employees SET role_id = ? WHERE id = ?",
          [rolesId, employeesId],
          (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            userInput();
        }
        );
      });
}
  
// when they click on view all roles, a table will pop up the the roles
function viewAllRoles() {
    const sql = `SELECT roles.title AS title, departments.name AS departments, roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
    ORDER BY roles.salary DESC`;
  
    db.query(sql, (err, results) => {
      if (err) throw err;
  
      console.table(results);
  
      userInput();
    });
}
// when they click on add department they will be asked to name the new department 
function addDepartment() {
    // code to add a new department
    inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "Enter the name of the department:"
    })
    .then((answers) => {
      // insert the department into the database
      const query = `INSERT INTO departments (name) VALUES ('${answers.departmentName}')`;
      db.query(query, (err, res) => {
        if (err) throw err;
        
        userInput();
      });
    });
  }       
// when they click on add a role, they will be asked what the title will be and what the salary is and what department it belongs to
function addRole() {
  db.query("Select name FROM departments", function (err, results) {
    if (err) throw err;

    const choices = results.map((result) => result.name);
  
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the new role?",
        },
        {
          type: "list",
          name: "departments",
          message: "Which department does the new role belong to?",
          choices: choices,  
        },
        
      ])
      .then((answers) => {
        const query = 
        `INSERT INTO roles (title, salary, department_id)
          VALUES (?, ?, (SELECT id FROM departments WHERE name = ?))`;
        const values = [answers.title, answers.salary, answers.departments];
        db.query(query, values, (err, res) => {
          if (err) throw err;
     
          userInput();
        });
      });
    })
  }
  
// when they click on view all departments, then a table will show up with all the departments 
function viewAllDepartments() {
    const sql = `SELECT * FROM departments`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table(res);
  
  
      userInput();
    });
  }

async function runQuery(query) {
  const res = await db.promise().query(query);
  return res[0];
}
// when they click on add employee they will be asked to enter the first name, last name, the role and the manager assigned to them
async function addEmployee() {
  var query = "SELECT id, title AS 'value' FROM roles";
  var roles = await runQuery(query);
  query = "SELECT id, CONCAT(first_name, ' ',last_name) AS 'value' FROM employees";
  var employees = await runQuery(query);

    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "Enter the employee's first name:",
        },
        {
          type: "input",
          name: "last_name",
          message: "Enter the employee's last name:",
        },
        {
          type: "list",
          name: "roles",
          message: "Select the employee's role:",
          choices: roles,
        },
        {
          type: "list",
          name: "manager",
          message: "Select the employee's manager (if applicable)",
          choices: ['Alivia Thomas', 'Uriah Belletto', 'Ladonna Heikes', 'William Colvin III','Sara McSorley','Jordan Mayou','Scarlett Rose'],
        },
      ])
      .then((answers) => {
        // Insert the employee into the database
        const role_id = roles.find(o => o.value === answers.roles).id;
        const manager_id = employees.find(o => o.value === answers.manager).id;
        const query = "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        db.query(query, [answers.first_name, answers.last_name, role_id, manager_id], (err, res) => {
          if (err) throw err;
          console.log(`Added employee ${answers.first_name} ${answers.last_name}.`);
         
          userInput();
        });
      });
  }
  


userInput()