// Boilerplate code
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var db = require('./models');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Zoo Routes

// ROOT
app.get('/', function(req, res) {
    res.redirect("/zoos");
});

// INDEX
app.get('/zoos', function(req, res) {
    db.Zoo.find({},
        function(err, zoos) {
            res.render("zoos/index", {
                zoos: zoos
            });
        });
});

// NEW

app.get('/zoos/new', function(req, res) {
    res.render('zoos/new');
});

// CREATE

app.post('/zoos', function(req, res) {
    db.Zoo.create({
        name: req.body.name,
        location: req.body.location
    }, function(err, zoo) {
        if (err) {
            console.log(err);
            res.render('zoos/new');
        } else {
            console.log(zoo);
            res.redirect('/zoos');
        }
    });
});

// SHOW

app.get('/zoos/:id', function(req,res){
  db.Zoo.findById(req.params.id,
    function (err, zoo) {
      db.Animal.find(
      {
        _id: {$in: zoo.animals}
      },
      function(err, animal){
        res.render("zoos/show", {zoo:zoo, animal:animal});
      });
    });
});

// EDIT

app.get('/zoos/:id/edit', function(req, res) {
    db.Zoo.findById(req.params.id,
        function(err, zoo) {
            res.render("zoos/edit", {
                zoo: zoo
            });
        });
});

// UPDATE

app.put('/zoos/:id', function(req, res) {
    db.Zoo.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            location: req.body.location
        },
        function(err, zoo) {
            if (err) {
                res.render('zoos/edit');
            } else {
                res.redirect('/zoos');
            }
        });
});

// Destroy

app.delete('/zoos/:id', function(req, res) {
    db.Zoo.findById(req.params.id, function(err, zoo) {
        if (err) {
            console.log(err);
            res.render('zoos/show');
        } else {
            zoo.remove();
            res.redirect('/zoos');
        }
    });
});

// Animal Routes

// Index

app.get('/zoos/:zoo_id/animals', function(req, res) {
    db.Zoo.findById(req.params.zoo_id).populate('animals').exec(function(err, zoo) {
        res.render('animals/index', {
            zoo: zoo
        });
    });
});

// NEW

app.get('/zoos/:zoo_id/animals/new', function(req, res) {
    db.Zoo.findById(req.params.zoo_id,
        function(err, zoo) {
            res.render('animals/new', {
                zoo: zoo
            });
        });
});

// CREATE

app.post('/zoos/:zoo_id/animals', function(req, res) {
    db.Animal.create({
        name: req.body.name,
        species: req.body.species,
        age: req.body.age,
        photo: req.body.photo
    }, function(err, animal) {
        if (err) {
            console.log(err);
            res.render('animals/new');
        } else {
            db.Zoo.findById(req.params.zoo_id, function(err, zoo) {
                zoo.animals.push(animal);
                animal.zoo = zoo._id;
                animal.save();
                zoo.save();
                res.redirect('/zoos/' + req.params.zoo_id + '/animals');
            });
        }
    });
});

// SHOW

app.get('/zoos/:zoo_id/animals/:id', function(req, res) {
    db.Animal.findById(req.params.id)
        .populate('zoo')
        .exec(function(err, animal) {
            console.log(animal.zoo);
            res.render('animals/show', {
                animal: animal
            });
        });
});

// EDIT

app.get('/zoos/:zoo_id/animals/:id/edit', function(req, res) {
    db.Animl.findById(req.params.id)
        .populate('zoo')
        .exec(function(err, animal) {
            res.render('animals/edit', {
                animal: animal
            });
        });

});

// UPDATE

app.put('/zoos/:zoo_id/animals/:id/', function(req, res) {
    db.Animal.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        species: req.body.species,
        age: req.body.age,
        photo: req.body.photo
    }, function(err, animal) {
        if (err) {
            res.render('animals/edit');
        } else {
            res.redirect('/zoos/' + req.params.zoo_id + '/animals');
        }
    });
});

// DESTORY

app.delete('/zoos/:zoo_id/animals/:id', function(req, res) {
    db.Animal.findByIdAndRemove(req.params.id, {
        name: req.body.name,
        species: req.body.species,
        age: req.body.age,
        photo: req.body.photo
    }, function(err, animal) {
        if (err) {
            console.log(err);
            res.render('animals/edit');
        } else {
            res.redirect('/zoos/' + req.params.zoo_id + '/animals');
        }
    });
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});




// start server
app.listen(3000, function() {
    console.log('server running on port 3000');
});