import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {LoadMask, getJSON, postJSON, FormSectionHeader, collectFormValues} from './Helpers';
import {browserHistory} from 'react-router';

class GroupFindForm extends Component {
    render() {
        return (
            <form className="form-horizontal" ref="form" onSubmit={this.props.onFind}>
                <LoadMask ref="mask">
                    <Bootstrap.FormGroup controlId="groupidfind">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Group Id #
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <input ref="q" type="text" placeholder="#" id="groupidfind" className="form-control"/>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>
                    <Bootstrap.FormGroup>
                        <Bootstrap.Col smOffset={3} sm={4}>
                            <Bootstrap.Button type="submit" bsStyle="info">
                                Find
                            </Bootstrap.Button>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>
                </LoadMask>
            </form>
        )
    }
}

class GroupJoinForm extends Component {
    render() {
        return (
            <form className="form-horizontal" ref="form" onSubmit={this.props.onJoin}>
                <LoadMask ref="mask">
                    <FormSectionHeader>
                        Group #{this.props.data.id} | Leader: <span className="label label-info">@{this.props.data.leader.gameid}</span>
                    </FormSectionHeader>
                    <Bootstrap.FormGroup controlId="roleforjoin">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Role
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl componentClass="select" name="role">
                                <option value="4">Any</option>
                                <option value="1">Damage Dealer</option>
                                <option value="2">Healer</option>
                                <option value="3">Tank</option>
                            </Bootstrap.FormControl>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>
                    <Bootstrap.FormGroup controlId="descrforjoin">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Description
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl componentClass="textarea" name="description" rows="4" placeholder=""/>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>
                    <Bootstrap.FormGroup>
                        <Bootstrap.Col smOffset={3} sm={4}>
                            <Bootstrap.Button type="submit" bsStyle="success">
                                Join
                            </Bootstrap.Button>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>
                </LoadMask>
            </form>
        )
    }
}

const GroupJoin = React.createClass({
    getInitialState() {
        return {
            data: {},
            success: null,
        };
    },
    onFind(e) {
        e.preventDefault();
        if (parseInt(this.refs.find.refs.q.value) > 0) {
            this.refs.find.refs.mask.handleLoad(this.loadFindFunc);
        }
    },
    loadFindFunc() {
        let id = this.refs.find.refs.q.value.replace('#', '');
        return getJSON('/api/group/' + id).then(function (json) {
            if (json.error) {
                this.setState({success: false});
            } else {
                this.setState({data: json, success: true});
            }
            return json;
        }.bind(this));
    },
    onJoin(e) {
        e.preventDefault();
        this.refs.join.refs.mask.handleLoad(this.loadJoinFunc);

    },
    loadJoinFunc() {
        return postJSON('/api/group/' + this.state.data.id + '/join', collectFormValues(this.refs.join.refs.form)).then(function (json) {
            if (json.error) {
                alert(json.error);
            } else {
                browserHistory.push('/group/' + json.id);
            }
            return json;
        }.bind(this));
    },
    render() {
        if (this.state.success === true) {
            return (
                <div>
                    <GroupFindForm ref="find" onFind={this.onFind}/>
                    <GroupJoinForm ref="join" onJoin={this.onJoin} data={this.state.data}/>
                </div>
            )
        } else if (this.state.success === false) {
            return (
                <div>
                    <GroupFindForm ref="find" onFind={this.onFind}/>
                    <div className="row">
                        <div className="col-md-offset-4">
                            <p className="text-warning">
                                Cant find group or u cant join it (invitation only)
                            </p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <GroupFindForm ref="find" onFind={this.onFind}/>
            )
        }
    }
});

export {GroupJoin, GroupFindForm, GroupJoinForm};