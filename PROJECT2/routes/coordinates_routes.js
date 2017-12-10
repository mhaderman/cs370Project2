var express = require('express');
var router = express.Router();
var coordinates_dal = require('../model/coordinates_dal');


// View All coordinates
router.get('/all', function(req, res) {
    coordinates_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('coordinates/coordinatesViewAll', { 'result':result });
        }
    });

});

// View the coordinates for the given id
router.get('/', function(req, res){
    if(req.query.coordID == null) {
        res.send('coordID is null');
    }
    else {
        coordinates_dal.getById(req.query.coordID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('coordinates/coordinatesViewById', {'coordinate': result[0], 'routes': result[1], 'pictures': result[2]});
            }
        });
    }
});

// Return the add a new coordinates form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    coordinates_dal.getAdd(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('coordinates/coordinatesAdd', {'users': result[0], 'routes': result[1], 'pictures': result[2], 'coordinates': result[3]});
        }
    });
});

// View the coordinates for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.lat == null && req.query.lon == null) {
        res.send('Latitude and longitude must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        coordinates_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/coordinates/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.coordID == null) {
        res.send('A coordinates id is required');
    }
    else {
        coordinates_dal.edit(req.query.coordID, function(err, result){
            res.render('coordinates/coordinatesUpdate', {'coordinate': result[0],'routes': result[1] ,'pictures': result[2], 'curRoutes': result[3] ,'curPictures': result[4]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.coordID == null) {
        res.send('A coordinates id is required');
    }
    else {
        coordinates_dal.getById(req.query.coordID, function(err, result){
            coordinates_dal.getAll(function(err, address) {
                res.render('coordinates/coordinatesUpdate', {'coordinate': result[0],'routes': result[1] ,'pictures': result[2], 'curRoutes': result[3] ,'curPictures': result[4]});
            });
        });
    }

});

router.get('/update', function(req, res) {
    coordinates_dal.update(req.query, function(err, result){
        res.redirect(302, '/coordinates/all');
    });
});

// Delete a coordinates for the given coordID
router.get('/delete', function(req, res){
    if(req.query.coordID == null) {
        res.send('coordID is null');
    }
    else {
        coordinates_dal.delete(req.query.coordID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/coordinates/all');
            }
        });
    }
});

module.exports = router;
