import React from 'react';

import { Link } from 'react-router-dom';

// import FullStory from './subcomponents/FullStory.js';
// import GameMasterPlayAgain from './subcomponents/GameMasterPlayAgain.js';
// import HideMyStory from './subcomponents/HideMyStory.js';
// import SaveMyStory from './subcomponents/SaveMyStory.js';

// import Button from 'react-bootstrap/Button';

class Storyrevealed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //state here
    }
  }

  render() {
    //variables, logic and so on here
      return (
        <div>
          {this.props.finalStory}
          {this.props.isHost ? (
            <button class="btn btn-success">
              <Link to='/'>Start New Game</Link>
            </button>
          ) : (
            <div>
            </div>
          )}
          <button class="btn btn-danger">
            <Link to='/writing'>Hide My Story</Link>
          </button>
        </div>
      )
    }
  }

export default Storyrevealed;
