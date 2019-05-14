var mysql = require("mysql");

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
   
    console.log("connected as id " + connection.threadId);
});


connection.end();


// ================================= Functions =================================

