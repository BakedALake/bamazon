var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "127.0.0.1",

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazondb"
});

connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId + "\n");
    menu();
});

// ================================= Functions =================================

function menu() {
    inquirer
        .prompt({
            name: "menu",
            type: "list",
            message: "Choose an option.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        })
        .then(function (answer) {
            switch (answer.menu) {
                case "View Products for Sale": {
                    displayAll();
                }
                    break;
                case "View Low Inventory": {
                    viewLow();
                }
                    break;
                case "Add to Inventory": {
                    stockItem();
                }
                    break;
                case "Add New Product": {
                    addProduct();
                }
                    break;
                case "Exit": {
                    connection.end();
                }
                    break;
            }
        });
}

function displayAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the table statement
        console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
        console.log("\n");
        menu();
    });
}

function viewLow() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("The following items are low stock (under 5 on hand):");
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(res[i].product_name);
            }
        }
        console.log("\n");
        menu();
    });

}

function stockItem() {
    var stockID, stockQTY;
    inquirer
        .prompt({
            name: "selectID",
            type: "input",
            message: "Enter the ID of the product to stock."
        })
        .then(function (answer) {
            stockID = answer.selectID;

            inquirer
                .prompt({
                    name: "selectQTY",
                    type: "input",
                    message: "Enter the amount to adjust the items stock by."
                })
                .then(function (answer) {
                    stockQTY = answer.selectQTY;

                    connection.query("SELECT * FROM products WHERE item_id = " + stockID, function (err, res) {
                        if (err) throw err;
                        var newQTY = parseInt(res[0].stock_quantity) + parseInt(stockQTY);
                        console.log(newQTY);

                        connection.query("UPDATE products SET ? WHERE item_id = " + stockID, [{ stock_quantity: newQTY }], function (err, res) {
                            if (err) throw err;
                            else console.log("Product stock updated. \n");
                            menu();
                        });
                    });

                });
        });
}

function addProduct() {
    var questions = [{
        type: "input",
        name: "name",
        message: "Enter the name of the new product."
    }, {
        type: "input",
        name: "department",
        message: "Enter the name of the department the new product belongs to."
    }, {
        type: "input",
        name: "price",
        message: "Enter the price of the new product."
    }, {
        type: "input",
        name: "stock",
        message: "Enter the current stock quantity of the new product."
    }];
    inquirer
        .prompt(questions)
        .then(function (answer) {
            var newProd = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + answer.name + "','" + answer.department + "','" + answer.price + "','" + answer.stock + "')";
            connection.query(newProd, function (err, result) {
                if (err) throw err;
                else console.log("New product added to database.\n");
                menu();
            });
        });
}