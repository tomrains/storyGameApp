//this was copied and pasted from somewhere else. so it hasnt been changed at all yet
//and wont  make sense

import React from 'react';

import { Link } from 'react-router-dom';

class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
    <div className="App">
      <h1>Project Home</h1>
      {/* Link to WelcomeScreen2.js */}
      <Link to={'./list'}>
        <button variant="raised">
            My List
        </button>
      </Link>
    </div>
    );
  }
}
export default WelcomeScreen;
