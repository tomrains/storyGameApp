import React, { Component } from 'react';
import axios from 'axios';

export default class CreateGame extends Component {

    constructor(props) {
        super(props);

        this.onChangeGameDescription = this.onChangeGameDescription.bind(this);
        this.onChangeGameoResponsible = this.onChangeGameResponsible.bind(this);
        this.onChangeGamePriority = this.onChangeGamePriority.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            game_description: '',
            game_responsible: '',
            game_priority: '',
            game_completed: false
        }
    }

    onChangeGameDescription(e) {
        this.setState({
            game_description: e.target.value
        });
    }

    onChangeGameResponsible(e) {
        this.setState({
            game_responsible: e.target.value
        });
    }

    onChangeGamePriority(e) {
        this.setState({
            game_priority: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(`Game Description: ${this.state.game_description}`);
        console.log(`Game Responsible: ${this.state.game_responsible}`);
        console.log(`Game Priority: ${this.state.game_priority}`);

        const newGame = {
            game_description: this.state.game_description,
            game_responsible: this.state.game_responsible,
            game_priority: this.state.game_priority,
            game_completed: this.state.game_completed
        };

        axios.post('http://localhost:4000/games/add', newGame)
            .then(res => console.log(res.data));

        this.setState({
            game_description: '',
            game_responsible: '',
            game_priority: '',
            game_completed: false
        })
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create New Game</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.game_description}
                                onChange={this.onChangeGameDescription}
                                />
                    </div>
                    <div className="form-group">
                        <label>Responsible: </label>
                        <input
                                type="text"
                                className="form-control"
                                value={this.state.game_responsible}
                                onChange={this.onChangeGameResponsible}
                                />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input"
                                    type="radio"
                                    name="priorityOptions"
                                    id="priorityLow"
                                    value="Low"
                                    checked={this.state.game_priority==='Low'}
                                    onChange={this.onChangeGamePriority}
                                    />
                            <label className="form-check-label">Low</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input"
                                    type="radio"
                                    name="priorityOptions"
                                    id="priorityMedium"
                                    value="Medium"
                                    checked={this.state.game_priority==='Medium'}
                                    onChange={this.onChangeGamePriority}
                                    />
                            <label className="form-check-label">Medium</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input  className="form-check-input"
                                    type="radio"
                                    name="priorityOptions"
                                    id="priorityHigh"
                                    value="High"
                                    checked={this.state.game_priority==='High'}
                                    onChange={this.onChangeGamePriority}
                                    />
                            <label className="form-check-label">High</label>
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Game" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
