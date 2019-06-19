// Express: express which is a web framework for creating API.
// Router: router to create a route.
// SQL: Microsoft SQL Server client for Node.js
// Conn: we are importing SQL connection from connect.js Class.
var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
    router.route('/')
        .get(function (req, res) {                  //declared HTTP Method "Get" 
            conn.connect().then(function () {
                var sqlquery = "select * from products";
                var req = new sql.Request(conn);
                req.query(sqlquery).then(function (recordset) {
                    res.json(recordset.recordset);
                    conn.close();
                })
                    .catch(function (err) {
                        conn.close();
                        res.status(400).send("error while inserting data");
                    });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("error while inserting data");
            });
        })
        // goi procedure
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("productname", sql.VarChar(30), req.body.productname) // passing paramater
                    request.input("price", sql.Decimal(18, 0), req.body.price)
                    request.execute("proc_insertProduct").then(function () { // use procedure
                        transaction.commit().then(function (recordSet) { //transaction
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while inserting data" + err);
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while inserting data" + err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while inserting data" + err);
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while inserting data" + err);
            });
        });
    // update
    router.route('/:id')
        .put(function (req, res) {
            var _id = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("id", sql.Int, _id)
                    request.input("productname", sql.VarChar(50), req.body.productname)
                    request.input("price", sql.Decimal(18, 0), req.body.price)
                    request.execute("proc_updateProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while updating data" + err);
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while updating data" + err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data" + err);
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error while updating data" + err);
            });
        })
        // delete 
        .delete(function (req, res) {
            var _id = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("id", sql.Int, _id)
                    request.execute("proc_deleteProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).json("id:" + _id);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while Deleting data" + err);
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data" + err);
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data" + err);
                });
            })
        });

    return router;
};
module.exports = routes;