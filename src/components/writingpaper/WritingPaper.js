import React from 'react';

import { Link } from 'react-router-dom';
import axios from 'axios';

// import CharacterCountLimit from './subcomponents/CharacterCountLimit.js';
// import ConfirmDoneWriting from './subcomponents/ConfirmDoneWriting.js';
// import ConfirmTheEnd from './subcomponents/ConfirmTheEnd.js';
// import DoneWritingButton from './subcomponents/DoneWritingButton.js';
// import GameMasterConfirmEndGame from './subcomponents/GameMasterConfirmEndGame.js';
// import GameMasterConfirmLastRound from './subcomponents/GameMasterConfirmLastRound.js';
// import GameMasterEndGame from './subcomponents/GameMasterEndGame.js';
// import GameMasterMakeLastRound from './subcomponents/GameMasterMakeLastRound.js';
// import Help from './subcomponents/Help.js';
// import LastRoundNotification from './subcomponents/LastRoundNotification.js';
// import PreviousLastLine from './subcomponents/PreviousLastLine.js';
// import RoundNumber from './subcomponents/RoundNumber.js';
// import ThanksForWritingNowWait from './subcomponents/ThanksForWritingNowWait.js';
// import TheEndButton from './subcomponents/TheEndButton.js';
// import ThreeNewLines from './subcomponents/ThreeNewLines.js';


class Writingpaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charactersAllowed: 150,
      charactersUsed: 0,
      charactersLeft: 150,
      minimimumCharactersRequired: 135,
      story: "",
      submitStory: false,
      storySubmitted: false,
      endGame: false,
      makeLastRound: false,
      needHelp: false,
      everyoneHasSubmitted: false,
      previousPersonsWriting: "Lemon, Ella and Nut played Dead by Daylight every day together, until",
      previousPerson: "[Name of Previous Person Here]",
      avatarOfPreviousPerson: "[Avatar of Previous Person Here]",
      nudgeText: "Begin your story here"
    }
  }

  intervalID;

  componentDidMount() {
    this.hasEveryoneSubmitted();
    // pausing for now so it stops fetching lol
    this.intervalID = setInterval(this.hasEveryoneSubmitted.bind(this), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // getPlayers = () => {
  //   //this shows undefined
  //   if (this.props.gameId) {
  //     console.log(`This.props.gameId is: ${this.props.gameId}`)
  //     // axios.get(`http://localhost:4000/games/${this.props.gameId}/players`)
  //     axios.get(`http://localhost:4000/games/${this.props.gameId}/players`)
  //       // .then(game => this.setState({ gameInfo: game.data[0].players }));
  //       .then(game => this.setState({ gameInfo: game.data[0].players }));
  //       // console.log(this.state.gameInfo);
  //   }
  // }

  hasEveryoneSubmitted = () => {
    if (this.state.storySubmitted && !this.props.hasFinalStory) {
    // list what this should do
    axios.get(`http://localhost:4000/games/${this.props.gameId}/storiesSubmitted`)
      .then(res => this.setState({ everyoneHasSubmitted: res.data }));
    if (this.props.isLastRound && this.state.everyoneHasSubmitted) {
      let info = {
        code: this.props.gameId,
        playerNumber: this.props.playerNumber
      }
      axios.get(`http://localhost:4000/games/${this.props.gameId}/${this.props.playerNumber}/finalStory`, info)
        .then(res => this.props.updateFinalStory(res.data))
        .then(this.props.updateHasFinalStory())
        .then(this.setState({ storySubmitted: true })); //might not need this part due to logic in render. test?
    }
    if (this.state.everyoneHasSubmitted && this.state.previousPersonsWriting === "Empty" && !this.props.isLastRound) {
      console.log("do the request for the story that is rightfully yours");
      let info = {
        code: this.props.gameId,
        playerNumber: this.props.playerNumber
      }
      axios.put(`http://localhost:4000/games/${this.props.gameId}/grabNewStory`, info)
        .then(res => this.setState({
          previousPersonsWriting: res.data.story,
          previousPerson: res.data.player,
          avatarOfPreviousPerson: res.data.avatar,
          storySubmitted: false,
          everyoneHasSubmitted: false
        }));
        if (this.props.rounds - this.props.currentRound === 1) {
          this.setState({ nudgeText: "Finish the story here" })
        }
        this.props.updateRoundNumber();
    }
  }
  else {
    return;
  }
}


    // axios.get(`http://localhost:4000/games/${this.props.gameId}/players`)
    //   .then(game => this.setState({ gameInfo: game.data[0].players }));
    // //   .then(game => this.setState({ gameInfo: game.data[0].players }))
    // //   .then(game => this.setState({ gameStarted: game.data[0].gameStarted }));
    // //   console.log(this.state.gameInfo);

      //
    //   .then(
    //     if (res) {
    //     console.log("i got nothing");
    //   }
    //   else {
    //     console.log("there's something here");
    //   }
    // );
      //need to identify whether nothing happened (you get a number) or if you got a story (array/string)
    //and have the backend keep some counter so it knows its sent
  // out all the correct stories and can update the roundNumber)
    //

  //make it where you click and text in writing box goes away
  //eventually would like to add in a minimum where you cant submit if you havent wirrten enough...
  //..maybe textbok could go from yellow to green once you've written enough

  updateStory = (e) => {
    //put the story into state so submit button can send it on
    this.setState({ story: e.target.value });
    this.setState({ charactersLeft: (this.state.charactersAllowed - e.target.value.length) })
  };

  //This function sends the writing to the backend
  //First, we'll try to send it to that player. Eventually, it will go to the player who originally wrote it
  putWriting = (e) => {
    e.preventDefault();
    console.log("and here we are");
    let playerStory = {
      code: this.props.gameId,
      playerNumber: this.props.playerNumber,
      story: this.state.story
    }
    axios.post(`http://localhost:4000/games/write/${this.props.gameId}`, playerStory)
      .then(this.setState({
        charactersUsed: 0,
        charactersLeft: 150,
        story: "Write your story here",
        storySubmitted: true,
        previousPersonsWriting: "Empty",
        submitStory: false,
        nudgeText: "Continue the story here"
       }));
  }

  deleteDefaultText = (e) => {
    if (e.target.value === "Begin your story here" || e.target.value === "Continue the story here" || e.target.value === "Finish the story here") {
      e.target.value = "";
    }
  }

  tryToSubmit = (e) => {
    console.log("try to submit");
    this.setState({ submitStory: true });
  }

  neverMind = (e) => {
    this.setState({ submitStory: false });
  }

  quitGame = () => {
    console.log("They're ready to quit!");
  }

  // waitText = () => {
  //   return "Oh wow!";
  //   // return '<div>'+'<p>Waiting for everyone to finish the round.</p>'+'<p>In the meantime, enjoy this dancing unicorn</p>'+'</div>';
  // }

  render() {
    let waitText = "";
    if (!this.props.finalStory) {
      waitText = "Just waiting on everyone to finish."
    }
    else {
      waitText = null;
    }

    //variables, logic and so on here
    let previousPersonsWriting = this.state.previousPersonsWriting;
    let length = previousPersonsWriting.length;
    let lastLine = "";
    for (let i = length - 50; i > 0 ; i--) {
      if (previousPersonsWriting[i] === " ") {
        lastLine = "..." + previousPersonsWriting.slice(i + 1, length);
        i = 0;
      }
    }
      return (
        //the organization here is wrong, but the components are there
        <div>
          {!this.state.storySubmitted && !this.props.hasFinalStory ? (
          <div>
          <h1>Your Story</h1>
            <p>Round {this.props.currentRound} of {this.props.rounds}</p>
            {this.props.currentRound === 1 ? (
              <div>
              </div>
            ) : (
              <div>
                This is what {this.state.previousPerson} {this.state.avatarOfPreviousPerson} wrote for you:
                <div>{lastLine}</div>
              </div>
            )}
            <form>

              {this.props.isLastRound === false ? (
                <div>
                  <div className="form-group">
                    <label></label>
                    <textarea className="form-control text-monospace" maxLength="150"
                    onChange={this.updateStory}
                    onClick={this.deleteDefaultText}
                    defaultValue={this.state.nudgeText} />
                  </div>
                  <p>Characters remaining: {this.state.charactersLeft} </p>
                </div>
              ) : (
                <div>
                  <div className="form-group">
                    <label></label>
                    <textarea className="form-control text-monospace"
                    onChange={this.updateStory}
                    onClick={this.deleteDefaultText}
                    defaultValue={this.state.nudgeText} />
                  </div>
                  <p>
                    Finish the story. No character limit. Submit when ready.
                  </p>
                </div>
              )
            }

              </form>

              {this.state.submitStory && !this.state.storySubmitted ? (
                <p>
                  <button>Are you sure you want to submit your story?</button>
                  <button onClick={this.putWriting}>Yes</button>
                  <button onClick={this.neverMind}>No</button>
                </p>
                ) : (
                <div>
                </div>
                )
              }

              {!this.state.storySubmitted &&
                !this.state.submitStory &&
                this.state.charactersLeft > 15 && !this.props.isLastRound ? (
                <button disabled>Submit writing</button>
                ) : (
                <div>
                </div>
                )
              }

              {!this.state.storySubmitted &&
                !this.state.submitStory &&
                this.state.charactersLeft <= 15 || this.props.isLastRound && !this.state.storySubmitted &&
                  !this.state.submitStory? (
                <button onClick={this.tryToSubmit}>Submit writing</button>
                ) : (
                <div>
                </div>
                )
              }

              {this.props.isHost && this.state.endGame ? (
                <p>
                  <button>Are you sure you want to end the game for everyone?</button>
                  <button>Yes</button>
                  <button>No</button>
                </p>
                ) : (
                <div>
                </div>
                )
              }

            </div>
          ) : (
            <div>
              {waitText}
            </div>
          )
        }

        {this.props.finalStory ? (
          <div>
            <p>Everyone's turned in their story.</p>
            <p>Reveal yours below.</p>
            <button type="button"className="btn btn-success">
              <Link to='/story'>Reveal My Story</Link>
            </button>
          </div>
        ) : (
          <div>
          </div>
        )
      }
        </div>
      )
    }
  }


export default Writingpaper;


// <CharacterCountLimit />
// <ConfirmDoneWriting />
// <ConfirmTheEnd />
// <DoneWritingButton />
// <GameMasterConfirmEndGame />
// <GameMasterConfirmLastRound />
// <GameMasterEndGame />
// <GameMasterMakeLastRound />
// <Help />
// <LastRoundNotification />
// <PreviousLastLine />
// <RoundNumber />
// <ThanksForWritingNowWait />
// <TheEndButton />
// <ThreeNewLines />

/*{this.props.isHost ? (
  <div>
    <p>
      <button>Make this the last round (make this toggle)</button>
    </p>
  </div>
  ) : (
  <div>
  </div>
  )
}

{this.props.isHost && !this.state.endGame ? (
  <button>End Game</button>
  ) : (
  <div>
  </div>
  )
}

{this.state.needHelp ? (
  <div>
    <p>
      Helpy stuff here
    </p>
  </div>
  ) : (
  <div>
    <button>Help</button>
  </div>
  )
}*/
