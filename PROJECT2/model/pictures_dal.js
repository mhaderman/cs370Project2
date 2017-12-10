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
    var query = 'SELECT pictures.pictureID, pictures.picName FROM pictures ORDER BY pictures.pictureID;';

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

exports.getById = function(pictureID, callback) {
    var query = 'CALL get_pictureByID(?);';
    var queryData = [pictureID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    var query = 'INSERT INTO pictures (picName, path) VALUES (?,?)';

    var queryData = [params.picName, params.path];

    connection.query(query, queryData, function(err, result) {
        var newQuery = 'SELECT pictureID FROM pictures WHERE picName = ?;'
        var newQueryData = [params.picName];
        connection.query(newQuery, newQueryData, function (err, result) {
            if(params.routeID != null){
                for(var i = 0; i < params.routeID.length; i++){
                    routePictureInsert(params.routeID[i], result[0].pictureID, function (err, result) {

                    });
                }
            }
            if(params.userID != null){
                for(var i = 0; i < params.userID.length; i++){
                    userPictureInsert(params.userID[i], result[0].pictureID, function (err, result) {

                    });
                }
            }
            if(params.coordID != null){
                for(var i = 0; i < params.coordID.length; i++){
                    coordinatePictureInsert(params.coordID[i], result[0].pictureID, function (err, result) {

                    });
                }
            }
            callback(err, result);
        });
    });

};

exports.delete = function(pictureID, callback) {
    var query = 'DELETE FROM routes_pictures WHERE routeID = ?';
    var queryData = [pictureID];

    connection.query(query, queryData, function(err, result) {

    });
    query = 'DELETE FROM routes_pictures WHERE pictureID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM coordinates_pictures WHERE pictureID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM users_pictures WHERE pictureID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM pictures WHERE pictureID = ?';
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    if(params._routeID != null){
        if(params._pictureID.constructor == Array){
            for(var i = 0; i < params._routeID.length; i++){
                routePictureDelete(params._routeID[i], params.pictureID, function (err, result) {

                });
            }
        }
        else{
            routePictureDelete(params._routeID, params.pictureID, function (err, result) {

            });
        }
    }
    if(params.routeID != null){
        if(params.pictureID.constructor == Array){
            for(var i = 0; i < params.routeID.length; i++){
                routePictureInsert(params.routeID[i], params.pictureID, function (err, result) {

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
                userPictureDelete(params._userID[i], params.pictureID, function (err, result) {

                });
            }

        }
        else{
            userPictureDelete(params._userID, params.pictureID, function (err, callback) {

            });
        }
    }
    if(params.userID != null){
        if(params.userID.constructor == Array){
            for(var i = 0; i < params.userID.length; i++){
                userPictureInsert(params.userID[i], params.pictureID, function (err, result) {

                });
            }
        }
        else{
            userPictureInsert(params.userID, params.pictureID, function (err, result) {

            });
        }
    }
    if(params._coordID != null){
        if(params._coordID.constructor == Array){
            for(var i = 0; i < params._coordID.length; i++){
                coordinatePictureDelete(params._coordID[i], params.pictureID, function (err, result) {

                });
            }
        }
        else{
            coordinatePictureDelete(params._coordID, params.pictureID, function (err, result) {

            });
        }
    }
    if(params.coordID != null){
        if(params.coordID.constructor == Array){
            for(var i = 0; i < params.coordID.length; i++){
                coordinatePictureInsert(params.coordID[i], params.pictureID, function (err, result) {

                });
            }
        }
        else{
            coordinatePictureInsert(params.coordID, params.pictureID, function (err, result) {

            });
        }
    }

    if(params.picName != ""){
        var query = 'UPDATE pictures SET picName = ? WHERE pictureID = ?';
        var queryData = [params.picName, params.pictureID];

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

exports.edit = function(pictureID, callback) {
    var query = 'CALL get_pictureUpdate(?)';
    var queryData = [pictureID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

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

var userRouteDelete = function (userID, routeID, callback) {
    var query = 'DELETE FROM users_routes WHERE userID = ? AND routeID = ?';
    var queryData = [userID, routeID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userRouteDelete = userRouteDelete;

var userRouteInsert = function (userID, routeID, callback) {
    var query = 'INSERT INTO users_routes(userID, routeID) VALUES (?,?)'
    var queryData = [userID, routeID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userRouteInsert = userRouteInsert;

var userPictureInsert = function(userID, pictureID, callback){
    var query = 'INSERT INTO users_pictures(userID, pictureID) VALUES (?,?)'
    var queryData = [userID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userPictureInsert = userPictureInsert;

var userPictureDelete = function (userID, pictureID, callback) {
    var query = 'DELETE FROM users_pictures WHERE userID = ? AND pictureID = ?';
    var queryData = [userID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userPictureDelete = userPictureDelete;

var coordinatePictureInsert = function(coordID, pictureID, callback){
    var query = 'INSERT INTO coordinates_pictures(coordID, pictureID) VALUES (?,?)';
    var queryData = [coordID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.coordinatePictureInsert = coordinatePictureInsert;

var coordinatePictureDelete = function (coordID, pictureID, callback) {
    var query = 'DELETE FROM coordinates_pictures WHERE coordID = ? AND pictureID = ?';
    var queryData = [coordID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.coordinatePictureDelete = coordinatePictureDelete;