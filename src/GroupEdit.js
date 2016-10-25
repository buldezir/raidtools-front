import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {LoadMask, getJSON, fetchJSON, collectFormValues} from './Helpers';
import {browserHistory} from 'react-router';

let GroupEditForm = React.createClass({

    getInitialState() {
        return {
            invitational: true,
            invList: '',
            data: {}
        }
    },

    componentDidMount() {
        this.refs.mask.handleLoad(this.loadFunc);
    },
    loadFunc() {
        return getJSON('/api/group/' + this.props.params.id).then(function (json) {
            if (json.error) {
                alert(json.error);
                // browserHistory.push('/404');
            } else {
                this.setState({data: json});
            }
            return json;
        }.bind(this));
    },

    handleChange(e) {
        let fld = e.target;
        if (fld.name) {
            let data = this.state.data;
            data[fld.name] = fld.value;
            this.setState({
                data: data
            });
        }
    },

    getInvListValidationState() {
        if (!this.state.data.invitational_list) return null;
        let val = this.state.data.invitational_list;
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
        this.refs.mask.handleLoad(this.submitFunc);
    },
    submitFunc() {
        return fetchJSON('/api/group/' + this.props.params.id, collectFormValues(this.refs.form), 'PUT').then(function (json) {
            if (json.error) {
                alert(json.error);
            } else {
                console.log(json);
                //window.INITIAL_DATA.groupList = null;
                //browserHistory.push('/group/' + json.data.id);
            }
            return json;
        }.bind(this));
    },

    render() {
        return (
            <form className="form-horizontal" ref="form" onSubmit={this.handleSubmit} onChange={this.handleChange}>

                <LoadMask ref="mask">

                    <Bootstrap.FormGroup controlId="groupnameedit">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Group name
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl type="text" name="name" defaultValue={this.state.data.name}/>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup controlId="lockismainedit">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Lock Main Roster
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <select name="lock_ismain" id="lockismainedit" className="form-control" defaultValue={this.state.data.lock_ismain}>
                                <option value="0">People will join Main roster if it has space (&lt;12)</option>
                                <option value="1">Everybody will join to StandBy roster</option>
                            </select>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup controlId="invcheckedit">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Invitation only
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl componentClass="select" name="invitational" defaultValue={this.state.data.invitational}>
                                <option value="1">Only users with @accountid from Invitation list can join</option>
                                <option value="0">Anyone can join</option>
                            </Bootstrap.FormControl>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup validationState={this.getInvListValidationState()} controlId="invlistedit"
                                         className={this.state.data.invitational == '1' ? '' : 'hidden'}>
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Invitation @accountid list
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl
                                componentClass="textarea"
                                rows="10"
                                name="invitational_list"
                                defaultValue={this.state.data.invitational_list}
                            />
                            <Bootstrap.HelpBlock>one @userid on each string.
                                example:<br/>@userid1<br/>@userid2<br/>@anotheruserid2</Bootstrap.HelpBlock>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup controlId="descredit">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Description/Comments
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <Bootstrap.FormControl componentClass="textarea" name="description" rows="4" defaultValue={this.state.data.description}/>
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                </LoadMask>

                <Bootstrap.FormGroup>
                    <Bootstrap.Col smOffset={3} sm={4}>
                        <button type="submit" className="btn btn-warning" ref="button">Update</button>
                    </Bootstrap.Col>
                </Bootstrap.FormGroup>
            </form>
        )
    }
});

export default GroupEditForm;