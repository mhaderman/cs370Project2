var express = require('express');
var router = express.Router();
var users_dal = require('../model/users_dal');


// View All userss
router.get('/all', function(req, res) {
    users_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('users/usersViewAll', { 'result':result });
        }
    });

});

// View the users for the given id
router.get('/', function(req, res){
    if(req.query.userID == null) {
        res.send('userID is null');
    }
    else {
        users_dal.getById(req.query.userID, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               var email = result[0];
               var pictures = result[1];
               var routes = result[2];
               res.render('users/usersViewById', {'email': email, 'pictures': pictures, 'routes': routes });
           }
        });
    }
});

// Return the add a new users form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    users_dal.getAdd(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('users/usersAdd', {'users': result[0], 'routes': result[1], 'pictures': result[2], 'coordinates': result[3]});
        }
    });
});

// View the users for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.email == null) {
        res.send('Email must be provided.');
    }
    else if(req.query.PW == null) {
        res.send('Password must be provided.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        users_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/users/all');
            }
        });
    }
});

router.get('/edit', function(req, res){
    if(req.query.userID == null) {
        res.send('A user id is required');
    }
    else {
        users_dal.edit(req.query.userID, function(err, result){
            res.render('users/usersUpdate', {'user': result[0],'pictures': result[1] ,'routes': result[2], 'curRoutes': result[3] ,'curPictures': result[4]});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.userID == null) {
       res.send('A users id is required');
   }
   else {
       users_dal.getById(req.query.userID, function(err, result){
           users_dal.getAll(function(err, address) {
               res.render('users/usersUpdate', {'user': result[0],'pictures': result[1] ,'routes': result[2], 'curRoutes': result[3] ,'curPictures': result[4]});
           });
       });
   }

});

router.get('/update', function(req, res) {
    users_dal.update(req.query, function(err, result){
       res.redirect(302, '/users/all');
    });
});

// Delete a users for the given users_id
router.get('/delete', function(req, res){
    if(req.query.userID == null) {
        res.send('userID is null');
    }
    else {
        users_dal.delete(req.query.userID, function(err, result){
             if(err) {
                 res.send(err);
             }
             else {
                 //poor practice, but we will handle it differently once we start using Ajax
                 res.redirect(302, '/users/all');
             }
         });
    }
});

module.exports = router;
