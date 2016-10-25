import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {LoadMask, postJSON, collectFormValues} from './Helpers';
import {browserHistory} from 'react-router';

let GroupCreateForm = React.createClass({

    getInitialState() {
        return {
            invitational: true,
            invList: ''
        }
    },

    handleInvChange(e) {
        this.setState({invitational: !!parseInt(e.target.value)});
    },

    handleInvListChange(e) {
        this.setState({invList: e.target.value});
    },

    getInvListValidationState() {
        let val = this.state.invList;
        if (val.length === 0) return null;
        if (val.split("\n").every(function (s) {
                return (s.length === 0) || /@[\w\d'"]+/.test(s);
            })) {
            return 'success';
        } else {
            return 'error';
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        this.refs.mask.handleLoad(this.loadFunc);
    },
    loadFunc() {
        return postJSON('/api/group', collectFormValues(this.refs.form)).then(function (json) {
            if (json.error) {
                alert(json.error);
            } else {
                // console.log(json);
                window.INITIAL_DATA.groupList = null;
                browserHistory.push('/group/' + json.data.id);
            }
            return json;
        }.bind(this));
    },

    render() {
        return (
            <form className="form-horizontal" ref="form" onSubmit={this.handleSubmit}>

                <LoadMask ref="mask">

                    <Bootstrap.FormGroup controlId="groupnamecreate">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Group name
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl type="text" name="name" placeholder=""/>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup controlId="invcheckcreate">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Invitation only
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl componentClass="select" name="invitational" onChange={this.handleInvChange}>
                                <option value="1">Only users with @accountid from Invitation list can join</option>
                                <option value="0">Anyone can join</option>
                            </Bootstrap.FormControl>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup validationState={this.getInvListValidationState()} controlId="invlistcreate"
                                         className={this.state.invitational ? '' : 'hidden'}>
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Invitation @accountid list
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl
                                componentClass="textarea"
                                rows="10"
                                placeholder=""
                                name="invList"
                                value={this.state.invList}
                                onChange={this.handleInvListChange}
                            />
                            <Bootstrap.HelpBlock>one @userid on each string.
                                example:<br/>@userid1<br/>@userid2<br/>@anotheruserid2</Bootstrap.HelpBlock>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup controlId="descrcreate">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Description/Comments
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl componentClass="textarea" name="description" rows="4" placeholder=""/>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                </LoadMask>

                <Bootstrap.FormGroup>
                    <Bootstrap.Col smOffset={3} sm={4}>
                        <button type="submit" className="btn btn-warning" ref="button">Create</button>
                    </Bootstrap.Col>
                </Bootstrap.FormGroup>
            </form>
        )
    }
});

export default GroupCreateForm;