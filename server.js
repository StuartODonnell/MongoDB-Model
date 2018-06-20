const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(parser.urlencoded({extended: true}));

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;


MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if (err){
    console.log(err);
    return;
  }
  const db = client.db("game_of_thrones");
  console.log("_______________________________drop datbase!! Database in connected_______________________________");

  server.post("/api/characters", function(req,res, next){
    const charactersCollection = db.collection("characters");
    const charactersToSave = req.body;
    charactersCollection.save(charactersToSave, function(err, result)
    {
      if (err) next(err);

      res.status(204);
      res.json(result.ops[0])
      console.log("saved to database!!");
    })
  });

  server.get("/api/characters", function(req, res, next){
    const charactersCollection = db.collection("characters");
    charactersCollection.find().toArray(function(err, allCharacters){
      if (err) next(err);
      res.json(allCharacters);
    })
  })

  server.delete('/api/characters', function(req, res, next){
    const charactersCollection = db.collection("characters");
    charactersCollection.remove({}, function(err,result){
        if(err) next(err);
        res.status(204).send();
  })
  })

  server.post('/api/characters/:id', function(req, res, next){
    const charactersCollection = db.collection("characters");
    const objectID = ObjectID(req.params.id);
    charactersCollection.update({_id: objectID}, req.body, function(err, result){
      if(err) next(err);
      res.status(204).send();
    })
  })

server.listen(3000, function(){
  console.log("Listening on port 3000");
});
})



server.listen(3000, function(){
  console.log("Listening on port 3000");
});
