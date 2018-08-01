var mysql = require('mysql');
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"

})

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
})
// display id name and price

function displayItems() {
    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
        console.log(res);
        promptUser();
    })
}

//ask 2 questions 
function promptUser() {
    inquirer
        .prompt({
            name: "item_id",
            type: "input",
            message: "Please enter the item id of the product you wish to purchase?"

        })
        .then(function (answer) {
            console.log(answer.item_id);
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: answer.item_id }, function (err, res) {
                console.log(res)
                if (!res.length) {
                    console.log("Item Not Found");
                    displayItems();

                } else {
                    inquirer
                        .prompt({
                            name: "quantity",
                            type: "input",
                            message: "How many do you want?"
                        }).then(function (answer) {
                            //answer.quanitity is the quantity the user requested
                            //res.stockquantity is the quan available on the database
                            //newq is the new quan based on the amount- had - amount want
                            if (answer.quantity <= res[0].stock_quantity){
                                var newQ = res[0].stock_quantity - answer.quantity
                                var update = "UPDATE products SET stock_quantity=? WHERE item_id=?;"
                            
                                connection.query(update,[newQ, res[0].item_id], function(err, response){
                                    console.log(response)
                                    var totalCost= answer.quantity * res[0].price 
                                    console.log("The cost of your purchase is $" +totalCost)
                                    console.log("Thank you for shopping at Bamazon!")
                                }) 
                            } else{
                                console.log("Insufficient Quantities")
                                displayItems();
                                
                            }
                            
                        })
                }


            });
        });
}
    //ask item_id of product they want to buy
    //how many do you want to buy
//check to see if we sell the item
// check to see if we have enough
    //if we dont sell the item then tell them Insufficient quantity!
    //if we have enough
        //update the data base with the new inventory "stock quanty"
        //total cost for number of items purchase
