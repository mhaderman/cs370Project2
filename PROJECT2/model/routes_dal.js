var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view company_view as
 select s.*, a.street, a.zip_code from company s
 join address a on a.address_id = s.address_id;

 */

exports.getAll = function(callback) {
    var query = 'SELECT routes.routeID, routes.routeName FROM routes ORDER BY routes.routeID;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getAdd = function(callback){
    var query = 'CALL get_allTables();';
    connection.query(query, function(err, result){
       callback(err, result);
    });
};

exports.getById = function(routeID, callback) {
    var query = 'CALL get_routeByID(?);';
    var queryData = [routeID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    var query = 'INSERT INTO routes (routeName, description) VALUES (?,?)';

    var queryData = [params.routeName, params.description];

    connection.query(query, queryData, function(err, result) {
        var newQuery = 'SELECT routeID FROM routes WHERE routeName = ?;'
        var newQueryData = [params.routeName];
        connection.query(newQuery, newQueryData, function (err, result) {
            if(params.userID != null){
                for(var i = 0; i < params.userID.length; i++){
                    userRouteInsert(params.userID[i], result[0].routeID, function (err, result) {

                    });
                }
            }
            if(params.pictureID != null){
                for(var i = 0; i < params.pictureID.length; i++){
                    routePictureInsert(result[0].routeID, params.pictureID[i], function (err, result) {

                    });
                }
            }
            if(params.coordID != null){
                for(var i = 0; i < params.coordID.length; i++){
                    routeCoordinateInsert(result[0].routeID, params.coordID[i], function (err, result) {

                    });
                }
            }
            callback(err, result);
        });
    });

};

exports.delete = function(routeID, callback) {
    var query = 'DELETE FROM routes_pictures WHERE routeID = ?';
    var queryData = [routeID];

    connection.query(query, queryData, function(err, result) {

    });
    query = 'DELETE FROM users_routes WHERE routeID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM routes_coordinates WHERE routeID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM routes WHERE routeID = ?';
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    if(params._pictureID != null){
        if(params._pictureID.constructor == Array){
            for(var i = 0; i < params._pictureID.length; i++){
                routePictureDelete(params.routeID, params._pictureID[i], function (err, result) {

                });
            }
        }
        else{
            routePictureDelete(params.routeID, params._pictureID, function (err, result) {

            });
        }
    }
    if(params.pictureID != null){
        if(params.pictureID.constructor == Array){
            for(var i = 0; i < params.pictureID.length; i++){
                routePictureInsert(params.routeID, params.pictureID[i], function (err, result) {

                });
            }
        }
        else{
            routePictureInsert(params.routeID, params.pictureID, function (err, result) {

            });
        }

    }
    if(params._userID != null){
        if(params._userID.constructor == Array){
            for(var i = 0; i < params._userID.length; i++){
                userRouteDelete(params._userID[i], params.routeID, function (err, result) {

                });
            }

        }
        else{
            userRouteDelete(params._userID, params.routeID, function (err, callback) {

            });
        }
    }
    if(params.userID != null){
        if(params.userID.constructor == Array){
            for(var i = 0; i < params.userID.length; i++){
                userRouteInsert(params.userID[i], params.routeID, function (err, result) {

                });
            }
        }
        else{
            userRouteInsert(params.userID, params.routeID, function (err, result) {

            });
        }
    }
    if(params._coordID != null){
        if(params._coordID.constructor == Array){
            for(var i = 0; i < params._coordID.length; i++){
                routeCoordinateDelete(params.routeID, params._coordID[i], function (err, result) {

                });
            }
        }
        else{
            routeCoordinateDelete(params.routeID, params._coordID, function (err, result) {

            });
        }
    }
    if(params.coordID != null){
        if(params.coordID.constructor == Array){
            for(var i = 0; i < params.coordID.length; i++){
                routeCoordinateInsert(params.routeID, params.coordID[i], function (err, result) {

                });
            }
        }
        else{
            routeCoordinateInsert(params.routeID, params.coordID, function (err, result) {

            });
        }
    }

    if(params.routeName == "" && params.description != ""){
        var query = 'UPDATE routes SET description = ? WHERE routeID = ?';
        var queryData = [params.description, params.routeID];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });
    }
    else if(params.routeName != "" && params.description == ""){
        var query = 'UPDATE routes SET routeName = ? WHERE routeID = ?';
        var queryData = [params.routeName, params.routeID];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });
    }
    else if(params.routeName != "" && params.description != ""){
        var query = 'UPDATE routes SET routeName = ?, description = ? WHERE routeID = ?';
        var queryData = [params.routeName,params.description, params.routeID];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });
    }
    else{
        var err = null;
        var result = null;
        callback(err, result);
    }
};

exports.edit = function(userID, callback) {
    var query = 'CALL get_routeUpdate(?)';
    var queryData = [userID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

var userRouteDelete = function (userID, routeID, callback) {
    var query = 'DELETE FROM users_routes WHERE userID = ? AND routeID = ?';
    var queryData = [userID, routeID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userRouteDelete = userRouteDelete;

var routePictureDelete = function (routeID, pictureID, callback) {
    var query = 'DELETE FROM routes_pictures WHERE routeID = ? AND pictureID = ?';
    var queryData = [routeID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.routePictureDelete = routePictureDelete;

var routeCoordinateDelete = function (routeID, coordID, callback) {
    var query = 'DELETE FROM routes_coordinates WHERE routeID = ? AND coordID = ?';
    var queryData = [routeID, coordID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.routeCoordinateDelete = routeCoordinateDelete;

var routePictureInsert = function (routeID, pictureID, callback) {
    var query = 'INSERT INTO routes_pictures(routeID, pictureID) VALUES (?,?)';
    var queryData = [routeID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.routePictureInsert = routePictureInsert;

var routeCoordinateInsert = function (routeID, coordID, callback) {
    var query = 'INSERT INTO routes_coordinates(routeID, coordID) VALUES (?,?)';
    var queryData = [routeID, coordID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.routeCoordinateInsert = routeCoordinateInsert;

var userRouteInsert = function (userID, routeID, callback) {
    var query = 'INSERT INTO users_routes(userID, routeID) VALUES (?,?)'
    var queryData = [userID, routeID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userRouteInsert = userRouteInsert;

