var express = require('express');
var router = express.Router();
var pictures_dal = require('../model/pictures_dal');


// View All pictures
router.get('/all', function(req, res) {
    pictures_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('pictures/picturesViewAll', { 'result':result });
        }
    });

});

// View the pictures for the given id
router.get('/', function(req, res){
    if(req.query.pictureID == null) {
        res.send('pictureID is null');
    }
    else {
        pictures_dal.getById(req.query.pictureID, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('pictures/picturesViewById', {'picture': result[0], 'routes': result[1], 'users': result[2], 'coordinates': result[3] });
            }
        });
    }
});

// Return the add a new pictures form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    pictures_dal.getAdd(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('pictures/picturesAdd', {'users': result[0], 'routes': result[1], 'pictures': result[2], 'coordinates': result[3]});
        }
    });
});

// View the pictures for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.picName == null) {
        res.send('Picture name must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        pictures_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/pictures/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.pictureID == null) {
        res.send('A pictures id is required');
    }
    else {
        pictures_dal.edit(req.query.pictureID, function(err, result){
            res.render('pictures/picturesUpdate', {'picture': result[0],'routes': result[1] ,'users': result[2], 'curUsers': result[3] ,'curRoutes': result[4], 'coordinates': result[5], 'curCoordinates': result[6]});
        });
    }

});

router.get('/edit2', function(req, res){
    if(req.query.pictureID == null) {
        res.send('A pictures id is required');
    }
    else {
        pictures_dal.getById(req.query.pictureID, function(err, result){
            pictures_dal.getAll(function(err, address) {
                res.render('pictures/picturesUpdate', {'route': result[0],'pictures': result[1] ,'users': result[2], 'curUsers': result[3] ,'curPictures': result[4], 'coordinates': result[5], 'curCoordinates': result[6]});
            });
        });
    }

});

router.get('/update', function(req, res) {
    pictures_dal.update(req.query, function(err, result){
        res.redirect(302, '/pictures/all');
    });
});

// Delete a pictures for the given pictureID
router.get('/delete', function(req, res){
    if(req.query.pictureID == null) {
        res.send('pictureID is null');
    }
    else {
        pictures_dal.delete(req.query.pictureID, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/pictures/all');
            }
        });
    }
});

module.exports = router;
