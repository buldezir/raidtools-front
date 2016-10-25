import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {postJSON} from './Helpers';

class JsLoader extends Component {
    render() {
        return (
            <div className="progress">
                <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"
                     style={{width: '100%'}}>
                    <span className="sr-only">...</span>
                </div>
            </div>
        );
    }
}

let UserId = React.createClass({

    getInitialState() {
        return {
            loading: false
        }
    },

    handleSubmit: function (e) {
        e.preventDefault();
        this.setState({loading: true});
        postJSON('/api/user/update-game-id', {gameid: this.refs.gameId.value}).then(function (data) {
            this.setState({loading: false});
            if (data.error) {
                alert(data.error);
            } else {
                this.props.onUserInput(data.gameid);
            }
        }.bind(this));
    },

    render() {
        if (this.props.gameid) {
            return (
                <div className="navbar-nav">
                    <h4><Bootstrap.Label bsStyle="info">@{this.props.gameid}</Bootstrap.Label></h4>
                </div>
            );
        } else {
            return (
                <Bootstrap.Navbar.Form pullLeft>
                    {!this.state.loading ?
                        <Bootstrap.Form onSubmit={this.handleSubmit}>
                            <Bootstrap.FormGroup>
                                <input className="form-control" ref="gameId" name="gameid" type="text" placeholder="@userId"/>
                            </Bootstrap.FormGroup>
                            {' '}
                            <Bootstrap.Button type="submit" bsStyle="danger">Set</Bootstrap.Button>
                        </Bootstrap.Form>
                        :
                        <div className="navbar-nav" style={{width: 240}}><JsLoader/></div>
                    }
                </Bootstrap.Navbar.Form>
            );
        }
    }
});

export default UserId;