import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {LoadMask, postJSON, collectFormValues} from './Helpers';
import {browserHistory} from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';

let DateInput = React.createClass({
    displayName: "DateInput" ,
    propTypes: {
        onClick: React.PropTypes.func,
        value: React.PropTypes.string,
        placeholderText: React.PropTypes.string
    },
    render () {
        return (
            <div className="input-group">
                <input name="date_part" type="text" className="form-control" placeholder={this.props.placeholderText} defaultValue={this.props.value}/>
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.props.onClick}><i className="fa fa-calendar" aria-hidden="true"></i></button>
                </span>
            </div>
        );
    }
});

let EventCreateForm = React.createClass({
    getInitialState: function() {
        return {
            startDate: moment()
        };
    },
    handleSubmit(e) {
        e.preventDefault();
        this.refs.mask.handleLoad(this.loadFunc);
    },
    loadFunc() {
        // return postJSON('/api/group', collectFormValues(this.refs.form)).then(function (json) {
        //     if (json.error) {
        //         alert(json.error);
        //     } else {
        //         browserHistory.push('/group/' + json.data.id);
        //     }
        //     return json;
        // }.bind(this));
    },
    handleChange: function(date) {
        this.setState({
            startDate: date
        });
    },
    render() {
        return (
            <form className="form-horizontal" ref="form" onSubmit={this.handleSubmit}>

                <h3>
                    Group #{this.props.params.id} | Create event
                </h3>

                <LoadMask ref="mask">

                    <Bootstrap.FormGroup controlId="datecreate">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Date
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <DatePicker
                                minDate={moment()}
                                locale="en-gb"
                                dateFormat="YYYY-MM-DD"
                                customInput={<DateInput />}
                                selected={this.state.startDate}
                                onChange={this.handleChange} />
                        </Bootstrap.Col>
                    </Bootstrap.FormGroup>

                    <Bootstrap.FormGroup controlId="timecreate">
                        <Bootstrap.Col componentClass={Bootstrap.ControlLabel} sm={3}>
                            Time
                        </Bootstrap.Col>
                        <Bootstrap.Col sm={9}>
                            <div className="input-group timepicker">
                                <input name="time_part_h" type="number" className="form-control" defaultValue="19" min="0" max="23"/>
                                <span className="input-group-addon">:</span>
                                <input name="time_part_m" type="number" className="form-control" defaultValue="00" min="0" max="59"/>
                            </div>
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

export default EventCreateForm;