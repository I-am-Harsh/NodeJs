const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) =>{
    const coll = db.collection(collection);
    return(coll.insertOne(document));
};

// pass the reteive documents to the callback funtions 
exports.findDocument = (db, collection, callback) =>{
    const coll = db.collection(collection);
    return (coll.find({}).toArray());
};


exports.removetDocument = (db, document, collection, callback) =>{
    const coll = db.collection(collection);
    return (coll.deleteOne(document));
};


exports.updateDocument = (db, document, update,collection, callback) =>{
    const coll = db.collection(collection);
    return (coll.updateOne(document, {$set : update}, null));
};