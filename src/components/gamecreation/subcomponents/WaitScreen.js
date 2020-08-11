import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';

class WaitScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameInfo: "Default",
      gameStarted: false
    }
  }

  intervalID;

  componentDidMount() {
    this.getPlayers();
    // pausing for now so it stops fetching lol
    this.intervalID = setInterval(this.getPlayers.bind(this), 5000);
  }

  // updateRounds = (e) => {
  //   console.log("lets update those rounds");
  //   this.setState ({ rounds: e.target.value })
  // }

//   copy = (e) => {
//   /* Get the text field */
//   let copyText = e.target.value;
//
//   /* Select the text field */
//   copyText.select();
//   copyText.setSelectionRange(0, 99999); /*For mobile devices*/
//
//   /* Copy the text inside the text field */
//   document.execCommand("copy");
//
//   /* Alert the copied text */
//   alert("Copied the text: " + copyText.value);
// }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  //this only works if you let it do the interval thing
  getPlayers = () => {
    //this shows undefined
    if (this.props.gameId) {
      console.log(`This.props.gameId is: ${this.props.gameId}`);
      // axios.get(`http://localhost:4000/games/${this.props.gameId}/players`)
      axios.get(`http://localhost:4000/games/${this.props.gameId}/players`)
        // .then(game => this.setState({ gameInfo: game.data[0].players }));
        .then(game => this.setState({
          gameInfo: game.data[0].players,
          gameStarted: game.data[0].gameStarted
        }));
        console.log(this.state.gameInfo);
    }
  }

  beginGame = () => {
    console.log("begin game functionality will go here");
    //do a put request to server to begin game
    let gameStatus = {
      gameStatus: true
    }
    axios.put(`http://localhost:4000/games/${this.props.gameId}/startGame`, gameStatus)
  }

  render() {
    let players = this.state.gameInfo;
    let playerBoard = [];
    for (let i = 0; i < players.length; i++) {
      playerBoard.push(players[i].name);
    }
    return (
      <div className="first">
        <h1>The Waitroom</h1>
        <form>
          <div className="form-group" controlId="exampleForm.ControlTextarea1">
            <h2>Invite your friends!</h2>
            <textarea className="form-control" defaultValue={this.props.gameIdUrl}/>
          </div>
        </form>
        <h2>Who's Joined:</h2>
        {this.state.gameInfo !== "Default" && this.state.gameInfo !== null ? (
          <div>
            {playerBoard.map((item) => {
              return(
                <div>
                  {item}
                </div>
              )
            })}
          </div>
        ) : (
          <div>No one's joined yet </div>
        )}
        {!this.state.gameStarted && !this.props.isHost ? (
          <div>
            Waiting for host to start game ...
          </div>
        ) : (
          <div>
            <button type="button"class="btn btn-success" onClick={this.props.startGame}>
              <Link to='/writing'>Start Game</Link>
            </button>
          </div>
        )}
      </div>
    )
  }
}

//
// <!-- The text field -->
// <input type="text" value="Hello World" id="myInput">
//
// <!-- The button used to copy the text -->
// <button onclick="myFunction()">Copy text</button>

export default WaitScreen;


//before it tear up this stuff
{/*this.state.gameInfo ? (
  <div>
    {players.map((item) => {
      return(
        <div>
          {item}
        </div>
      )
    })}
  </div>
) : (
  <div>No one's joined yet </div>
)*/}

{/*if (this.props.isHost) (
  <button type="button"class="btn btn-success" onClick={this.beginGame}>
    <Link to='/writing'>Begin Game</Link>
  </button>
) : (
  {!this.state.gameStarted ? (
    <div>
      Waiting for the host to begin the game...
    </div>
  ) :
(
  <button type="button"class="btn btn-success">
    <Link to='/writing'>Get writing!</Link>
  </button>
)
)}*/}
