var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);


exports.getAll = function(callback) {
   var query = 'SELECT * FROM fullView ORDER BY userID';
   connection.query(query, function (err, result) {
       callback(err, result);
   });
};

exports.getRoutes = function(value, limit, callback) {
    //Users
    var query = 'SELECT routes.routeID, routes.routeName, routes.description FROM routes WHERE routes.routeID IN ' +
        '(SELECT routeID FROM userRoutesView GROUP BY routeID HAVING COUNT(userID) >= ?) ORDER BY routes.routeID';
    if(limit == 2){ //Routes
        query = 'SELECT routes.routeID, routes.routeName, routes.description FROM routes ORDER BY routes.routeID';
    }
    if(limit == 3){ //Pictures
        query = 'SELECT routes.routeID, routes.routeName, routes.description FROM routes WHERE routes.routeID IN ' +
            '(SELECT routeID FROM routePictureView GROUP BY routeID HAVING COUNT(pictureID) >= ?) ORDER BY routes.routeID';
    }
    if(limit == 4){ //Coordinates
        query = 'SELECT routes.routeID, routes.routeName, routes.description FROM routes WHERE routes.routeID IN ' +
            '(SELECT routeID FROM routeCoordinateView GROUP BY routeID HAVING COUNT(coordID) >= ?) ORDER BY routes.routeID';
    }
    var queryData = [value];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.getUsers = function (value, limit, callback) {
    //Users
    var query = 'SELECT users.userID, users.email FROM users ORDER BY users.userID';
    if(limit == 2){ //Routes
        query = 'SELECT users.userID, users.email FROM users WHERE users.userID IN ' +
            '(SELECT userID FROM userRoutesView GROUP BY userID HAVING COUNT(routeID) >= ?) ORDER BY users.userID';
    }
    if(limit == 3){ //Pictures
        query = 'SELECT users.userID, users.email FROM users WHERE users.userID IN ' +
            '(SELECT userID FROM userPicturesView GROUP BY userID HAVING COUNT(pictureID) >= ?) ORDER BY users.userID';
    }
    if(limit == 4){ //Coordinates
        query = 'SELECT users.userID, users.email FROM users WHERE users.userID IN ' +
            '(SELECT userID FROM userCoordinatesView GROUP BY userID HAVING COUNT(coordID) >= ?) ORDER BY users.userID';
    }
    var queryData = [value];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.getCoordinates = function (value, limit, callback) {
    //Users
    var query = 'SELECT coordinates.coordID, coordinates.lat, coordinates.lon, coordinates.comments FROM coordinates WHERE coordinates.coordID IN ' +
        '(SELECT coordID FROM userCoordinatesView GROUP BY coordID HAVING COUNT(userID) >= ?) ORDER BY coordinates.coordID';
    if(limit == 2){ //Routes
        query = 'SELECT coordinates.coordID, coordinates.lat, coordinates.lon, coordinates.comments FROM coordinates WHERE coordinates.coordID IN ' +
            '(SELECT coordID FROM routeCoordinateView GROUP BY coordID HAVING COUNT(routeID) >= ?) ORDER BY coordinates.coordID';
    }
    if(limit == 3){ //Pictures
        query = 'SELECT coordinates.coordID, coordinates.lat, coordinates.lon, coordinates.comments FROM coordinates WHERE coordinates.coordID IN ' +
            '(SELECT coordID FROM coordinatePictureView GROUP BY coordID HAVING COUNT(pictureID) >= ?) ORDER BY coordinates.coordID';
    }
    if(limit == 4){ //Coordinates
        query = 'SELECT coordinates.coordID, coordinates.lat, coordinates.lon, coordinates.comments FROM coordinates ORDER BY coordinates.coordID';
    }
    var queryData = [value];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

exports.getPictures = function (value, limit, callback) {
    //Users
    var query = 'SELECT pictures.pictureID, pictures.picName FROM pictures WHERE pictures.pictureID IN ' +
        '(SELECT pictureID FROM userPicturesView GROUP BY pictureID HAVING COUNT(userID) >= ?) ORDER BY pictures.pictureID';
    if(limit == 2){ //Routes
        query = 'SELECT pictures.pictureID, pictures.picName FROM pictures WHERE pictures.pictureID IN ' +
            '(SELECT pictureID FROM routePictureView GROUP BY pictureID HAVING COUNT(routeID) >= ?) ORDER BY pictures.pictureID';
    }
    if(limit == 3){ //Pictures
        query = 'SELECT pictures.pictureID, pictures.picName FROM pictures ORDER BY pictures.pictureID';
    }
    if(limit == 4){ //Coordinates
        query = 'SELECT pictures.pictureID, pictures.picName FROM pictures WHERE pictures.pictureID IN ' +
            '(SELECT pictureID FROM coordinatePictureView GROUP BY pictureID HAVING COUNT(coordID) >= ?) ORDER BY pictures.pictureID';
    }
    var queryData = [value];
    connection.query(query, queryData, function (err, result) {
        callback(err, result);
    });
};

