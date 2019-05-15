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

});

// ================================= Functions =================================

function displayAll() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    // Log all results of the table statement
    console.table(res, ["item_id", "product_name", "price"]);
    buyProduct();
  });
}

function buyProduct() {
  var buyID, buyQTY;
  inquirer
    .prompt({
      name: "buyItem",
      type: "input",
      message: "Enter the item ID for the product you'd like to buy."
    })
    .then(function (answer) {
      // Store the id.
      buyID = answer.buyItem;

      inquirer
        .prompt({
          name: "buyAmount",
          type: "input",
          message: "Enter the quantity of the product you'd like to buy."
        })
        .then(function (answer) {
          // Store the amount.
          buyQTY = answer.buyAmount;

          checkStock(buyID, buyQTY);
        });
    });
}

function checkStock(buyID, buyQTY) {
  var stockQTY;
  connection.query("SELECT * FROM products WHERE item_id = " + buyID, function (err, res) {
    if (err) throw err;
    stockQTY = res[0].stock_quantity;
    if (buyQTY > stockQTY) {
      console.log("Bamazon doesn't have enough of that product. Please try again.");
      buyProduct();
    }
    else {
      updateItem(buyID, buyQTY, stockQTY);
    }
  });
}

function updateItem(buyID, buyQTY, stockQTY) {
  var newQTY = stockQTY - buyQTY;
  connection.query("UPDATE products SET ? WHERE item_id = " + buyID,
    [
      {
        stock_quantity: newQTY
      }
    ], function (err, res) {
      displayPurchase(buyID, buyQTY);
    });
}

function displayPurchase(buyID, buyQTY) {
  var itemCost, totalCost;
  connection.query("SELECT * FROM products WHERE item_id = " + buyID, function (err, res) {
    if (err) throw err;
    itemCost = res[0].price;
    totalCost = itemCost * buyQTY;
    console.log("Your total purchase is for $" + totalCost);

    inquirer
      .prompt({
        name: "continue",
        type: "confirm",
        message: "Would you like to make another purchase?"
      })
      .then(function (answer) {
        if (answer.continue) {
          displayAll();
        }
        else {
          console.log("Thank you for shopping with us!");
          connection.end();
        }
      });
  });
}