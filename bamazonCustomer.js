var mysql = require("mysql");
var inquirer = require("inquirer");

// Connection info
var connection = mysql.createConnection({
    host: "127.0.0.1",

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazondb"
});


// ================================= Main =================================
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
   
    console.log("connected as id " + connection.threadId);

    displayAll();
    connection.end();
});

// ================================= Functions =================================

function displayAll(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(res);
      });
}

function buyProduct(productID, amount){
    console.log("Updating all Rocky Road quantities...\n");
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
            stock_quantity: 100
        },
        {
            item_id: "Rocky Road"
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " products updated!\n");
        // Call deleteProduct AFTER the UPDATE completes
        deleteProduct();
      }
    );
  
    // logs the actual query being run
    console.log(query.sql);
}

function checkStock(requestQty){

}

function updateItem(productID, amount){
    
}