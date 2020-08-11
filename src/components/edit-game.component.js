import React, { Component } from 'react';
import axios from 'axios';

export default class EditGame extends Component {

    constructor(props) {
        super(props);

        this.onChangeGameDescription = this.onChangeGameDescription.bind(this);
        this.onChangeGameResponsible = this.onChangeGameResponsible.bind(this);
        this.onChangeGamePriority = this.onChangeGamePriority.bind(this);
        this.onChangeGameCompleted = this.onChangeGameCompleted.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            game_description: '',
            game_responsible: '',
            game_priority: '',
            game_completed: false
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/games/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    game_description: response.data.game_description,
                    game_responsible: response.data.game_responsible,
                    game_priority: response.data.game_priority,
                    game_completed: response.data.game_completed
                })
            })
            .catch(function (error) {
                console.log(error);
            })
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

    onChangeGameCompleted(e) {
        this.setState({
            game_completed: !this.state.game_completed
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const obj = {
            game_description: this.state.game_description,
            game_responsible: this.state.game_responsible,
            game_priority: this.state.game_priority,
            game_completed: this.state.game_completed
        };
        console.log(obj);
        axios.post('http://localhost:4000/games/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));

        this.props.history.push('/');
    }

    render() {
        return (
            <div>
                <h3 align="center">Update Game</h3>
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
                    <div className="form-check">
                        <input  className="form-check-input"
                                id="completedCheckbox"
                                type="checkbox"
                                name="completedCheckbox"
                                onChange={this.onChangeGameCompleted}
                                checked={this.state.game_completed}
                                value={this.state.game_completed}
                                />
                        <label className="form-check-label" htmlFor="completedCheckbox">
                            Completed
                        </label>
                    </div>

                    <br />

                    <div className="form-group">
                        <input type="submit" value="Update Game" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}
