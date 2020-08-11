import React from 'react';

class ThreeNewLines extends React.Component {
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
          <p>Write your new lines here ...</p>
          <p>line #2</p>
          <p>Line #3</p>
        </div>
      )
    }
  }

export default ThreeNewLines;
