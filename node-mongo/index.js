const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const opertations = require('./operations');

const url = 'mongodb://localhost:27017';
const dbname = 'confusion';

MongoClient.connect(url ,{useNewUrlParser: true, useUnifiedTopology: true}).then((client) => {
    // assert is used for checking the values
    assert.strictEqual(err,null);

    console.log('Server is connected');
     const db = client.db(dbname);
     const collection = db.collection('dishes');

    opertations.insertDocument(db, {name : "Vadonut", decription : "Test"}, 'dishes')
        .then((result) =>{

        console.log(`Insert document : ${result.ops}`);

        return(opertations.findDocument(db, 'dishes'))
        })
        .then((docs) => {
        
            console.log('Found Documents : ',docs);
            return (opertations.updateDocument(db, {name : "Vadonut"}, {description : "Updates desc"}, 'dishes'))
        })
        .then((result) =>{
        console.log('Updated Document :  ',result.result);

        return(opertations.findDocument(db, 'dishes'));
        })
        .then((docs) => {
            console.log("found docuemnt : ", docs);

            return(db.dropCollection('dishes'));
        })
        .then((result) =>{
            console.log('Dropped the collection')
            return(client.close());
        })
    .catch((err) => console.log(err));
})
.catch((err) => console.log(err));


