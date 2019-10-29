const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';

const connect = mongoose.connect(url ,{useNewUrlParser: true, useUnifiedTopology: true});

connect.then((db) =>{
    console.log("Server is connected");

    var newDish = Dishes({
        name : "Utthapizza",
        description : "Test desc"
    });

    // saves the values and return
    newDish.save()
    .then((dish) =>{
        console.log(dish);

        return Dishes.find({}).exec();
    })
    .then((dishes) =>{
        console.log(dishes);

        return Dishes.deleteOne({});
    })
    .then(() =>{
        mongoose.connection.close();
    })
    .catch((err) =>{
        console.log(err);
    })
});