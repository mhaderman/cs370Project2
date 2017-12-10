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
    var query = 'SELECT coordinates.coordID, coordinates.lat, coordinates.lon FROM coordinates ORDER BY coordinates.coordID';

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
    var query = 'CALL get_coordinateByID(?);';
    var queryData = [pictureID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    var query = 'INSERT INTO coordinates(lat, lon, comments) VALUES (?,?,?)';

    var queryData = [params.lat, params.lon, params.comments];

    connection.query(query, queryData, function(err, result) {
        var newQuery = 'SELECT coordID FROM coordinates WHERE lat = ? AND lon = ?;'
        var newQueryData = [params.lat, params.lon];
        connection.query(newQuery, newQueryData, function (err, result) {
            if(params.routeID != null){
                for(var i = 0; i < params.routeID.length; i++){
                    routeCoordinateInsert(params.routeID[i], result[0].coordID, function (err, result) {

                    });
                }
            }
            if(params.pictureID != null){
                for(var i = 0; i < params.pictureID.length; i++){
                    coordinatePictureInsert(result[0].coordID, params.pictureID[i], function (err, result) {

                    });
                }
            }
            callback(err, result);
        });
    });

};

exports.delete = function(coordID, callback) {

    var query = 'DELETE FROM routes_coordinates WHERE coordID = ?';
    var queryData = [coordID];
    connection.query(query, queryData, function(err, result) {

    });
    query = 'DELETE FROM coordinates_pictures WHERE coordID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM coordinates WHERE coordID = ?';
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    if(params._routeID != null){
        if(params._routeID.constructor == Array){
            for(var i = 0; i < params._routeID.length; i++){
                routeCoordinateDelete(params._routeID[i], params.coordID, function (err, result) {

                });
            }
        }
        else{
            routeCoordinateDelete(params._routeID, params.coordID, function (err, result) {

            });
        }
    };
    if(params.routeID != null){
        if(params.routeID.constructor == Array){
            for(var i = 0; i < params.routeID.length; i++){
                routeCoordinateInsert(params.routeID[i], params.coordID, function (err, result) {

                });
            }
        }
        else{
            routeCoordinateInsert(params.routeID, params.coordID, function (err, result) {

            });
        }

    };
    if(params._pictureID != null){
        if(params._pictureID.constructor == Array){
            for(var i = 0; i < params._pictureID.length; i++){
                coordinatePictureDelete(params.coordID, params._pictureID[i], function (err, result) {

                });
            }

        }
        else{
            coordinatePictureDelete(params.coordID, params._pictureID, function (err, callback) {

            });
        }
    };
    if(params.pictureID != null){
        if(params.pictureID.constructor != String){
            for(var i = 0; i < params.pictureID.length; i++){
                coordinatePictureInsert(params.coordID, params.pictureID[i], function (err, result) {

                });
            }
        }
        else{
            coordinatePictureInsert(params.pictureID, params.coordID, function (err, result) {

            });
        }
    };

    if(params.comments != ""){
        var query = 'UPDATE coordinates SET comments = ? WHERE coordID = ?';
        var queryData = [params.comments, params.coordID];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });
    }
    else{
        callback(null, null);
    }
};

exports.edit = function(coordID, callback) {
    var query = 'CALL get_coordinateUpdate(?)';
    var queryData = [coordID];

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