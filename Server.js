
var express = require('express');
var app = express();
var port = process.env.port || 1337;
var bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: true }));
// create application/json parser
app.use(bodyParser.json());


//  http://expressjs.com/en/api.html#app.use
// app.get("/product",function(request,response)
// {
//     response.json({"Message":"Welcome to Node js"});
// });
var productcontroller = require('./controller/productcontroller')();
app.use("/api/products",productcontroller);

app.listen(port, function () {
    var datetime = new Date();
    var message = 'Server running on port: -' + port + ' start at: -' + datetime;
    console.log(message);
});

