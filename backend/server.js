const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRoutes = express.Router();
const PORT = 4000;
// This is from Brad's course. he also had morgan
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars (this idea from Brad's course)
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

let Game = require('./game.model');

app.use(cors());
app.use(bodyParser.json());

gameRoutes.route('/').get(function(req, res) {
    Game.find(function(err, games) {
        if (err) {
            console.log(err);
        } else {
            res.json(games);
        }
    });
});

gameRoutes.route('/:code/startGame').put(function(req, res) {
    let code = req.params.code;
    Game.findOne({code: code}, function(err, game) {
      game.save(game.gameStarted = true);
      res.json(game);
    });
});

gameRoutes.route('/:code/:playerId/finalStory').get(function(req, res) {
    let code = req.params.code;
    let playerNumber = req.params.playerId;
    // console.log(`playerNumber is ${playerNumber}`);
    Game.findOne({code: code}, function(err, game) {
      // console.log(`playerNumber is ${playerNumber}`);
      let chainedStory = [];
      // let playerNumber = this.playerNumber;
      // console.log(`playerNumber is ${playerNumber}`);
      let storyNeeded;
      let rounds = game.rounds;
      // console.log(`rounds is ${rounds}`);
      let length = game.players.length;
      // console.log(`length is ${length}`);
      // console.log(game);
      for (let i = 1; i <= rounds; i++) {
        // console.log(`playerNumber - 1 + i is ${playerNumber - 1 + i}`);
        // console.log(`the little modulo baby is ${(playerNumber - 1 + i) % length}`);
        storyNeeded = (playerNumber - 1 + i) % length;
        // console.log(`storyNeeded is ${storyNeeded}`);
        //add space to end of story if not there already
        //can probably change the weird repetitive location to one variable
        // console.log(game.players);
        let storySpot = game.players[storyNeeded].story[i - 1];
        if (storySpot[storySpot.length - 1] !== " " && i !== rounds) {
          // console.log("this guy needs a space!");
          storySpot = storySpot + " ";
        }
        chainedStory.push(storySpot);
      }
      let draft = "";
      for (let q = 0; q < chainedStory.length; q++) {
        draft = draft + chainedStory[q];
      }
      console.log(`the draft is ${draft}`);
      res.json(draft);
    });
});

gameRoutes.route('/:code/grabNewStory').put(function(req, res) {
  //might be wise to add player-specific stuff that knows if a player has asked for a story or not
  let code = req.params.code;
  let playerNumber = req.body.playerNumber;
  let storyNumber;
  Game.findOne({code: code}, function(err, game) {
    console.log(game);
    let length = game.players.length;
    console.log(length);
    // Go ahead and return if the stories have all been submitted already
    if (game.storiesReturned === length) {
      res.json("You already got your story");
      return;
    }
    // Determine playerNumber for non-hosts
    if (playerNumber > 0) {
      storyNumber = playerNumber - 1;
      console.log(`storyNumber is ${storyNumber}`);
    }
    // Determine playerNumber for host
    else {
      storyNumber = length - 1;
      console.log(`storyNumber is ${storyNumber}`);
    }
    //Determine the story to send back using playerNumber and game.currentRound
    // console.log(game.currentRound);
    // console.log(game.currentRound - 1);
    // console.log(game.players[storyNumber].story);
    // console.log(game.players[storyNumber]);
    // console.log(game.players[storyNumber].story[game.currentRound - 1]);
    if (game.players[storyNumber].story[game.currentRound - 1]) {
      storyToSend = game.players[storyNumber].story[game.currentRound - 1];
    }
    else {
      res.json("You already have a story. Jumping ahead");
      return;
    }
    console.log(`the story to send is ${storyToSend}`);
    console.log(game.storiesReturned);
    game.storiesReturned = game.storiesReturned + 1;
    console.log(`storiesReturned has been increased by 1 and is now ${game.storiesReturned}`);
    // creating a variable to denote it is or isn't last round
    let isLastRound = false;
    // console.log(isLastRound);
    // if all the stories have now been returned
    if (game.storiesReturned === length) {
      console.log("all users have been sent new stories");
      //so in this case you'd want to change the "all stories have been sent" bit
      //also seems like you'd need to unmount the story request thing
      game.currentRound = game.currentRound + 1;
      game.storiesReturned = 0;
      game.storiesSubmitted = 0;
      if (game.currentRound === game.rounds) {
        isLastRound = true;
        // console.log(isLastRound);
      }
    }
    // console.log(isLastRound);
    let storyInfo = {
      story: storyToSend,
      player: game.players[storyNumber].name,
      avatar: game.players[storyNumber].avatar,
      round: game.currentRound,
      isLastRound: isLastRound
    }
    game.save();
    if (err) {
      res.json(err);
    }
    else {
      res.json(storyInfo);
    }
  });
});

/*

*/


// See if all stories are submitted
gameRoutes.route('/:code/storiesSubmitted').get(function(req, res) {
    let code = req.params.code;
    let playerNumber = req.body.playerNumber;
    let storyToSend;
    Game.find({code: code}, function(err, game) {
      console.log(game);
      let length = game[0].players.length;
      console.log(`the length of players is ${length}`);
      // If any player has submitted a story
      if (game[0].storiesSubmitted !== 0) {
        console.log("1 or more stories have been submitted");
        // If every player has submitted a story
        if (game[0].storiesSubmitted % length === 0) {
          console.log("everyone has submitted their story");
          //so send back something that will let them know they can do a put request
          res.json(true);
          return;
          // res.json(storyToSend);
        }
      }
        res.json(false);
      }
    );
  });

// Return players to update the waitscreen page
gameRoutes.route('/:code/players').get(function(req, res) {
    let code = req.params.code;
    Game.find({code: code}, function(err, game) {
      console.log(game);
      res.json(game);
    });
});

gameRoutes.route('/:code').get(function(req, res) {
    let code = req.params.code;
    Game.find({code: code}, function(err, game) {
        res.json(game);
    });
});


// Add a non-host player to the game
gameRoutes.route('/:code').put(function(req, res) {
  console.log(req.params.code);
  console.log(req.body);
  Game.findOne({code: req.params.code }, function (err, game) {
    // console.log(game);
    // Determine what the player's number will be
    let playerNumber;
    playerNumber = game.players.length;
    // console.log(`the current length of players is ${playerNumber}`);
    game.players.push(req.body);
    // console.log(game.players);
    // console.log(game.players[playerNumber].number);
    game.players[playerNumber].number = playerNumber;
    game.save();
    res.json(game.players[playerNumber].number);
  });
});


// doc1.save(function(err, doc) {
//   if (err) return console.error(err);
//   console.log("Document inserted succussfully!");
// });


// Add the host after the game has been initialized in the backend with a code
gameRoutes.route('/add/:code').put(function(req, res) {
  console.log(req.body.code);
    Game.findOne({code: req.body.code}, function (err, game) {
      console.log(game);
      game.rounds = req.body.rounds;
      let hostPlayer = req.body.players;
      game.save(game.players.push(hostPlayer));
      //so now, just add functionality to update the stuff!
      //push the body to players
      // console.log(game.players[0].name);
        if (err) {
          res.status(404).send("data is not found");
        }
        else {
          res.json(`You just added a new player`);
        }
    });
});


// going to switch to findOne
// gameRoutes.route('/write/:code').post(function(req, res) {
//   Game.findOne({code: req.params.code }, function (err, game) {
//     let playerNumber = req.body.playerNumber;
//     // console.log(`the playernumber is ${playerNumber}`);
//     let storyLocation = game.players[playerNumber].story;
//     let newLine = req.body.story;
//     // console.log(`the new line we're adding is ${newLine}`);
//     // console.log(`this is the previous storyLocation: ${storyLocation}`);
//     // storyLocation.push(newLine);
//     game.save(storyLocation.push(newLine));
//     // console.log(`this is the new storyLocation: ${storyLocation}`);
//     // console.log(`this is the game now: ${game}`);
//       if (err){
//         res.status(404).send("data is not found");
//       }
//       else {
//         //increase the counter in game
//         game.storiesSubmitted = game.storiesSubmitted + 1;
//         if (game.storiesSubmitted % game.players.length === 0) {
//           // game.currentRound = game.currentRound + 1;
//           //send all the stories out, and THEN change storiesSubmitted to zero?
//           //might not need to do the below - the frontend function might do it. let's see
//           console.log("add functionality to change the round number plus one");
//         }
//         console.log(game.storiesSubmitted);
//         res.json('Wow you did it!');
//       }
//   });
// });


//Add your lines of the story to backend
//the find one and update is making this wonky. change that.
// gameRoutes.route('/write/:code').post(function(req, res) {
//     Game.findOneAndUpdate({code: req.params.code}, {players[req.body.playerNumber]: req.body.story}, {new: true}, (err, game) => {
//       let playerNumber = req.body.playerNumber;
//       let storyLocation = game.players[playerNumber].story;
//       let newLine = req.body.story;
//       console.log(`the new line we're adding is ${newLine}`);
//       console.log(`this is the previous storyLocation: ${storyLocation}`);
//       storyLocation.push(newLine);
//       console.log(`this is the new storyLocation: ${storyLocation}`);
//         if (err)
//             res.status(404).send("data is not found");
//         res.json('Wow you did it!');
//     });
// });

// Add a new line to the player's story array.
gameRoutes.route('/write/:code').post(function(req, res) {
  Game.findOne({code: req.params.code }, function (err, game) {
    let playerNumber = req.body.playerNumber;
    // console.log(`the playernumber is ${playerNumber}`);
    let storyLocation = game.players[playerNumber].story;
    let newLine = req.body.story;
    // console.log(`the new line we're adding is ${newLine}`);
    // console.log(`this is the previous storyLocation: ${storyLocation}`);
    // storyLocation.push(newLine);
    game.save(storyLocation.push(newLine));
    // console.log(`this is the new storyLocation: ${storyLocation}`);
    // console.log(`this is the game now: ${game}`);
      if (err){
        res.status(404).send("data is not found");
      }
      else {
        //increase the counter in game
        game.storiesSubmitted = game.storiesSubmitted + 1;
        console.log(game.storiesSubmitted);
        res.json('Wow you did it!');
      }
  });
});


// this will now be what you do immediately when the page renders
gameRoutes.route('/add').post(function(req, res) {
    let game = new Game(req.body);
    // console.log(game);
    game.save()
        .then(game => {
            res.status(200).json({'game': 'game added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new game failed');
        });
});

app.use('/games', gameRoutes);

const server = app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

// Handle unhandled promise rejections (from Brad's course - didnt do anything)
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1))
});


//in case i need it later:
// Add the host after the game has been initialized in the backend with a code
// gameRoutes.route('/add/:code').put(function(req, res) {
//   console.log(req.body.code);
//     Game.findOneAndUpdate({code: req.body.code}, {rounds: req.body.rounds, players: req.body.players}, {new: true}, (err, game) => {
//       console.log(game);
//       // console.log(game.players[0].name);
//       console.log(game[0].players[0].name);
//
//         if (err)
//             res.status(404).send("data is not found");
//         res.json(`You just added ${game.players[0].name} to the game with Avatar ${game.players[0].avatar}`);
//     });
// });



// stuff for a put request where you also get your story
// let storyNumber;
// if (playerNumber > 0) {
//   storyNumber = playerNumber - 1;
//   console.log(`storyNumber is ${storyNumber}`);
// }
// else {
//   storyNumber = length - 1;
//   console.log(`storyNumber is ${storyNumber}`);
// }
// storyToSend = game[0].players[storyNumber].story;
// console.log(`the story to send is ${storyToSend}`);
// // console.log(game[0].storiesReturned);
// //the below might need to be done using a put method
// //make it happen when someone successfully receives their story in the database
// // game[0].storiesReturned = game[0].storiesReturned + 1;
// // console.log(`storiesReturned has been increased by 1 and is now ${game[0].storiesReturned}`);
// if (game[0].storiesReturned === length) {
//   console.log("all users have been sent new stories");
//   game[0].currentRound = game[0].currentRound + 1;
//   if (game[0].currentRound === game[0].rounds) {
//     console.log("it's the last round, so execute last rounf stuff")
//   }
// }
