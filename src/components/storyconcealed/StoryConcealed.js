import React from 'react';

// import Button from 'react-bootstrap/Button';

// import BlurredText from './subcomponents/BlurredText.js';
// import OpenMyStoryNow from './subcomponents/OpenMyStoryNow.js';

class Storyconcealed extends React.Component {
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
          <h3>BLURRED TEXT</h3>
          <h3>BLURRED TEXT</h3>
          <h3>BLURRED TEXT</h3>
          <h3>BLURRED TEXT</h3>
          <h3>BLURRED TEXT</h3>
          <h3>BLURRED TEXT</h3>
          <button class="btn btn-primary">
            Reveal Story
          </button>
        </div>
      )
    }
  }

export default Storyconcealed;
