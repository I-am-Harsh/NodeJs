const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/confusion';

// set these at the start to avoid depraction warning
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// the below method can also be used to remove the depraction warning.
// const connect = mongoose.connect(url ,{useNewUrlParser: true, useUnifiedTopology: true});

const connect = mongoose.connect(url);
connect.then(() =>{
    console.log("Server is connected");
    // Dishes.remove();

    Dishes.create({
        name: 'Uthappizza',
        description: 'test'
    })
    .then((dish) => {
        console.log(dish);

        return Dishes.findByIdAndUpdate(dish._id, {
            $set: { description: 'Updated test'}
        },{ 
            new: true 
        })
        .exec();
    })
    .then((dish) => {
        console.log(dish);

        dish.comments.push({
            rating: 5,
            comment: 'I\'m getting a sinking feeling!',
            author: 'Leonardo di Carpaccio'
        });


        return dish.save();
    })
    .then((dish) => {
        console.log(dish);

        return Dishes.deleteOne({});
    })
    .then(() => {
        return mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    });
});