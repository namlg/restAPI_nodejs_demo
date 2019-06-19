var sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
        user: 'usertest',
        password: 'Pass123456',
        server: '10.151.120.45',
        database: 'testdb'
    });
 
    return conn;
};

module.exports = connect;