var express = require('express');
var router = express.Router();
var routes_dal = require('../model/routes_dal');


// View All routess
router.get('/all', function(req, res) {
    routes_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('routes/routesViewAll', { 'result':result });
        }
    });

});

// View the routes for the given id
router.get('/', function(req, res){
    if(req.query.routeID == null) {
        res.send('routeID is null');
    }
    else {
        routes_dal.getById(req.query.routeID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('routes/routesViewById', {'route': result[0], 'pictures': result[1], 'users': result[2], 'coordinates': result[3] });
            }
        });
    }
});

// Return the add a new routes form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    routes_dal.getAdd(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('routes/routesAdd', {'users': result[0], 'routes': result[1], 'pictures': result[2], 'coordinates': result[3]});
        }
    });
});

// View the routes for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.routeName == null) {
        res.send('Route name must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        routes_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/routes/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.routeID == null) {
        res.send('A routes id is required');
    }
    else {
        routes_dal.edit(req.query.routeID, function(err, result){
            res.render('routes/routesUpdate', {'route': result[0],'pictures': result[1] ,'users': result[2], 'curUsers': result[3] ,'curPictures': result[4], 'coordinates': result[5], 'curCoordinates': result[6]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.routeID == null) {
        res.send('A routes id is required');
    }
    else {
        routes_dal.getById(req.query.routeID, function(err, result){
            routes_dal.getAll(function(err, address) {
                res.render('routes/routesUpdate', {'route': result[0],'pictures': result[1] ,'users': result[2], 'curUsers': result[3] ,'curPictures': result[4], 'coordinates': result[5], 'curCoordinates': result[6]});
            });
        });
    }

});

router.get('/update', function(req, res) {
    routes_dal.update(req.query, function(err, result){
        res.redirect(302, '/routes/all');
    });
});

// Delete a routes for the given routes_id
router.get('/delete', function(req, res){
    if(req.query.routeID == null) {
        res.send('routeID is null');
    }
    else {
        routes_dal.delete(req.query.routeID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/routes/all');
            }
        });
    }
});

module.exports = router;
