var express = require('express');
var router = express.Router();
var popular_dal = require('../model/popular_dal');


// View All userss
router.get('/all', function(req, res) {
    popular_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('popular/popularAll', { 'result':result });
        }
    });

});

// View the users for the given id
router.get('/limited', function(req, res){
    if(req.query.value <= 0) {
        if(req.query.limitTable1 == 1){
            popular_dal.getRoutes(0, req.query.limitTable2, function(err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularRoutesLimited', {'result': result});
            });
        }
        else if(req.query.limitTable1 == 2){
            popular_dal.getUsers(0, req.query.limitTable2, function (err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularUsersLimited', {'result': result});
            });
        }
        else if(req.query.limitTable1 == 3){
            popular_dal.getPictures(0, req.query.limitTable2, function (err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularPicturesLimited', {'result': result});
            });
        }
        else{
            popular_dal.getCoordinates(0, req.query.limitTable2, function (err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularCoordinatesLimited', {'result': result});
            });
        }
    }
    else {
        if(req.query.limitTable1 == 1){
            popular_dal.getRoutes(req.query.value, req.query.limitTable2, function(err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularRoutesLimited', {'result': result});
            });
        }
        else if(req.query.limitTable1 == 2){
            popular_dal.getUsers(req.query.value, req.query.limitTable2, function (err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularUsersLimited', {'result': result});
            });
        }
        else if(req.query.limitTable1 == 3){
            popular_dal.getPictures(req.query.value, req.query.limitTable2, function (err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularPicturesLimited', {'result': result});
            });
        }
        else{
            popular_dal.getCoordinates(req.query.value, req.query.limitTable2, function (err, result) {
                if(err){
                    res.send(err);
                }
                res.render('popular/popularCoordinatesLimited', {'result': result});
            });
        }
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
        popular_dal.insert(req.query, function(err,result) {
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
        popular_dal.edit(req.query.users_id, function(err, result){
            res.render('users/usersUpdate', {users: result[0][0], address: result[1]});
        });
    }

});

router.get('/edit2', function(req, res){
   if(req.query.users_id == null) {
       res.send('A users id is required');
   }
   else {
       popular_dal.getById(req.query.users_id, function(err, users){
           address_dal.getAll(function(err, address) {
               res.render('users/usersUpdate', {users: users[0], address: address});
           });
       });
   }

});

router.get('/update', function(req, res) {
    popular_dal.update(req.query, function(err, result){
       res.redirect(302, '/users/all');
    });
});

// Delete a users for the given users_id
router.get('/delete', function(req, res){
    if(req.query.users_id == null) {
        res.send('users_id is null');
    }
    else {
        popular_dal.delete(req.query.users_id, function(err, result){
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
