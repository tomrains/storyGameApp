import React from 'react';

// import { Link } from 'react-router-dom';

import axios from 'axios';

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getPlayers();
  }


  getPlayers = () => {
    axios.get('/signup')
    .then(playerInfo => this.setState({ players: playerInfo.data }))
  }

  render() {
    //variables, logic and so on here
      return (
        <div>
          <h1>
            Welcome
          </h1>
      </div>
      )
    }
  }

export default WelcomeScreen;
