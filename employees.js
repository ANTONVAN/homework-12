var inquirer = require('inquirer');
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "123456",
  database: "employeeDB",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
  });


  function start(){

  inquirer.prompt([
  {
    name: 'actions',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
    'Add Department',
    'Add Role',
    'Add Employee',

    'View All Departments',
    'View All Roles',
    'View All Employees',

    'Update Employee Role',

    'Update Employee Manager',
    'View All Employees By Manager',

    'Remove Deparment',
    'Remove Role',
    'Remove Employee',

    'View Deparment\'s budget'
    ]    
  }
    ])
  .then(answers =>{
    console.log(answers.actions);
    switch (answers.actions) {
  case "Add Department":
    //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
    addDepartment();
    break;

  case "Add Role":
    //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor2
    addRole();
    break;
  
  case "Add Employee":
    //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
    addEmployee();
    break;

  case "View All Departments":
    //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
    viewDepartments();
    break;

  case "View All Roles":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  viewRoles();
  break;

  case "View All Employees":
  viewEmployees();
    //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  break;

  case "Update Employee Role":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  UpdateEmployeeRole();
  break;

  case "Update Employee Manager":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  break;

  case "View All Employees By Manager":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  break;

  case "Remove Department":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  break;

  case "Remove Role":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  break;

  case "Remove Employee":
  //Declaraciones ejecutadas cuando el resultado de expresión coincide con valorN
  break;

  default:
    //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
    break;
}
  }).catch(error => {
      if(error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
  }


addDepartment = () => {
  inquirer.prompt([{
    name: "department",
    type: "input",
    message: "Enter department"
  }])
  .then(ans=>{
    console.log("Inserting a new department...\n");
    var query = connection.query(
    "INSERT INTO department SET ?",
      {
          name: ans.department,
      },
    function(err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " department inserted!\n");
      start();
    });
  }).catch(error => {
      if(error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
}

addRole = () => {
  var query = connection.query(
      "SELECT * FROM department",
      function(err, res) {
        if (err) throw err;
        inquirer.prompt([{
          name: "title",
          type: "input",
          message: "Enter role"
        },
        {
          name: "salary",
          type: "input",
          message: "Enter salary"
        },
        {
          name: 'department',
          type: 'list',
          message: 'Select a department?',
          choices: res
        }
      ])
      .then(ans=>{
        console.log(ans);
        //console.log(res);        
        let obj = res.find(o => o.name === ans.department);
        console.log(obj.id);
        //console.log("Inserting a new role...\n");
        var query = connection.query(
        "INSERT INTO role SET ?",
          {
              title: ans.title,
              salary: ans.salary,
              department_id: obj.id
          },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role inserted!\n");
          start();
        });
      });    
    });
}


addEmployee = () => {
  var managersQuery = connection.query(
    "SELECT * FROM employee",
    function(error, result) {
      if(error) throw error;
      var managersList = result.map(b => b.first_name + " " + b.last_name);

  var query = connection.query(
      "SELECT * FROM role",
      function(err, res) {
        if (err) throw err;
        let roles = res.map(a => a.title);
        inquirer.prompt([{
          name: "firstName",
          type: "input",
          message: "Enter the employee's name"
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter the employee's last name"
        },
        {
          name: 'role',
          type: 'list',
          message: "Select the employee's role",
          choices: roles
        },
        {
          name: 'manager',
          type: 'list',
          message: "Select the employee's manager",
          choices: managersList
        }
      ])
      .then(ans=>{
        console.log(ans);
        //console.log(res);        
        let obj = res.find(o => o.title === ans.role);
        let managerObj = result.find(s => s.first_name + " " + s.last_name === ans.manager);
        console.log(obj.id);
        //console.log("Inserting a new role...\n");
        var query = connection.query(
        "INSERT INTO employee SET ?",
          {
              first_name: ans.firstName,
              last_name: ans.lastName,
              role_id: obj.id,
              manager_id: managerObj.id
          },
        function(err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " role inserted!\n");
          start();
        });
      });    
    });
  });
}


viewEmployees = () => {
  var query = connection.query(
    "SELECT * FROM employee",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
}

viewDepartments = () => {
  var query = connection.query(
    "SELECT * FROM department",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
}

viewRoles = () => {
  var query = connection.query(
    "SELECT * FROM role",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      start();
    });
}

UpdateEmployeeRole = () =>{


  var queryRoles = connection.query(
    "SELECT * FROM role",
      function(error,result){
        if(error) throw error;
        var rolesList = result.map(b => b.title);
      
  var query = connection.query(
      "SELECT * FROM employee",

      function(err, res) {

        if (err) throw err;
        let employees = res.map(a => a.first_name + " " +a.last_name);

        inquirer.prompt([
        {
          name: 'employees',
          type: 'list',
          message: "Select the employee to update",
          choices: employees
        },
        {
          name: 'roles',
          type: 'list',
          message: "Select the new role",
          choices: rolesList
        }
      ])
      .then(ans=>{
      
        let employeeObj = res.find(o => o.first_name + " " + o.last_name === ans.employees);
        let roleObj = result.find(s => s.title === ans.roles);
        console.log(employeeObj);
        console.log(roleObj);
          
          var updateQuery = connection.query(
          `UPDATE employee SET role_id = ${roleObj.id} WHERE id = ${employeeObj.id}`,
          function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " role updated!\n");
            start();
          }); 
        });
      });
    });


    }


    



 