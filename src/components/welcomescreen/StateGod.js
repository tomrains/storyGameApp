import React from 'react';
import App from '../../App.js';

// import Dropdown from 'react-bootstrap/Dropdown';

class StateGod extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poo: "poo",
    }
  }

  test = () => {
    console.log("testing");
  }

  render() {
    return <div>
      <App
      // test={this.test}
      poo={this.state.poo}/>
    </div>;
  }
}

export default StateGod;
