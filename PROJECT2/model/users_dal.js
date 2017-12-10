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
    var query = 'SELECT users.userID, users.email FROM users GROUP BY users.userID;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getAdd = function(callback){
    var query = 'CALL get_allTables();'
    connection.query(query, function(err, result){
       callback(err, result);
    });
};

exports.getById = function(userID, callback) {
    var query = 'CALL get_userByID(?);'
    var queryData = [userID];
    console.log(query);

    connection.query(query, queryData, function(err, result) {

        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE COMPANY
    var query = 'INSERT INTO users (email, PW) VALUES (?,?)';

    var queryData = [params.email, params.PW];

    connection.query(query, queryData, function(err, result) {
        var newQuery = 'SELECT userID FROM users WHERE email = ?;'
        var newQueryData = [params.email];
        connection.query(newQuery, newQueryData, function (err, result) {
            if(params.pictureID != null){
                for(var i = 0; i < params.pictureID.length; i++){
                    userPictureInsert(result[0].userID, params.pictureID[i], function (err, result) {

                    });
                }
            }
            if(params.routeID != null){
                for(var i = 0; i < params.routeID.length; i++){
                    userRouteInsert(result[0].userID, params.routeID[i], function (err, result) {

                    });
                }
            }
            callback(err, result);
        });
    });

};

var userPictureInsert = function(userID, pictureID, callback){
    var query = 'INSERT INTO users_pictures(userID, pictureID) VALUES (?,?)'
    var queryData = [userID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userPictureInsert = userPictureInsert;

var userRouteInsert = function (userID, routeID, callback) {
    var query = 'INSERT INTO users_routes(userID, routeID) VALUES (?,?)'
    var queryData = [userID, routeID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userRouteInsert = userRouteInsert;

exports.delete = function(userID, callback) {
    var query = 'DELETE FROM users_pictures WHERE userID = ?';
    var queryData = [userID];

    connection.query(query, queryData, function(err, result) {

    });
    query = 'DELETE FROM users_routes WHERE userID = ?';
    connection.query(query, queryData, function (err, result) {

    });
    query = 'DELETE FROM users WHERE userID = ?';
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.update = function(params, callback) {
    if(params._pictureID != null){
        if(params._pictureID.constructor == Array){
            for(var i = 0; i < params._pictureID.length; i++){
                userPictureDelete(params.userID, params._pictureID[i], function (err, result) {

                });
            }
        }
        else{
            userPictureDelete(params.userID, params._pictureID, function (err, result) {

            });
        }
    }
    if(params._routeID != null){
        if(params._routeID.constructor == Array){
            for(var i = 0; i < params._routeID.length; i++){
                userRouteDelete(params.userID, params._routeID[i], function (err, result) {

                });
            }

        }
        else{
            userRouteDelete(params.userID, params._routeID, function (err, callback) {

            });
        }
    }
    if(params.pictureID != null){
        if(params.pictureID.constructor == Array){
            for(var i = 0; i < params.pictureID.length; i++){
                userPictureInsert(params.userID, params.pictureID[i], function (err, result) {

                });
            }
        }
        else{
            userPictureInsert(params.userID, params.pictureID, function (err, result) {

            });
        }

    }
    if(params.routeID != null){
        if(params.routeID.constructor == Array){
            for(var i = 0; i < params.routeID.length; i++){
                userRouteInsert(params.userID, params.routeID[i], function (err, result) {

                });
            }
        }
        else{
            userRouteInsert(params.userID, params.routeID, function (err, result) {

            });
        }
    }
    if(params.PW == ""){
        var query = 'UPDATE users SET PW = ? WHERE userID = ?';
        var queryData = [params.PW, params.userID];

        connection.query(query, queryData, function(err, result) {
            callback(err, result);
        });
    }
    else{
        callback(null, null);
    }
};

var userRouteDelete = function (userID, routeID, callback) {
    var query = 'DELETE FROM users_routes WHERE userID = ? AND routeID = ?';
    var queryData = [userID, routeID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userRouteDelete = userRouteDelete;
var userPictureDelete = function (userID, pictureID, callback) {
    var query = 'DELETE FROM users_pictures WHERE userID = ? AND pictureID = ?';
    var queryData = [userID, pictureID];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};
module.exports.userPictureDelete = userPictureDelete;

/*  Stored procedure used in this example
     DROP PROCEDURE IF EXISTS company_getinfo;

     DELIMITER //
     CREATE PROCEDURE company_getinfo (company_id int)
     BEGIN

     SELECT * FROM company WHERE company_id = _company_id;

     SELECT a.*, s.company_id FROM address a
     LEFT JOIN company_address s on s.address_id = a.address_id AND company_id = _company_id;

     END //
     DELIMITER ;

     # Call the Stored Procedure
     CALL company_getinfo (4);

 */

exports.edit = function(userID, callback) {
    var query = 'CALL get_userUpdate(?)';
    var queryData = [userID];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};