var express = require('express');
var router = express.Router();
var about_dal = require('../model/about_dal');


// View All userss
router.get('/all', function(req, res) {
    about_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('aboutus/aboutusViewAll', { 'result':result });
        }
    });

});

// View the users for the given id
router.get('/', function(req, res){
    if(req.query.users_id == null) {
        res.send('users_id is null');
    }
    else {
        users_dal.getById(req.query.users_id, function(err,result) {
           if (err) {
               res.send(err);
           }
           else {
               res.render('users/usersViewById', {'result': result});
           }
        });
    }
});

// Return the add a new users form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    address_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('users/usersAdd', {'address': result});
        }
    });
});

// View the users for the given id
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.users_name == null) {
        res.send('users Name must be provided.');
    }
    else if(req.query.address_id == null) {
        res.send('At least one address must be selected');
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
    if(req.query.users_id == null) {
        res.send('A users id is required');
    }
    else {
        users_dal.edit(req.query.users_id, function(err, result){
            res.render('users/usersUpdate', {users: result[0][0], address: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.users_id == null) {
       res.send('A users id is required');
   }
   else {
       users_dal.getById(req.query.users_id, function(err, users){
           address_dal.getAll(function(err, address) {
               res.render('users/usersUpdate', {users: users[0], address: address});
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
    if(req.query.users_id == null) {
        res.send('users_id is null');
    }
    else {
        users_dal.delete(req.query.users_id, function(err, result){
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
