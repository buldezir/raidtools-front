import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {LoadMask, getJSON} from './Helpers';

class RosterTable extends Component {
    render() {
        let rows = this.props.data.map(function (row) {
            let needControl = window.INITIAL_DATA.id !== row.user.id && this.props.managed;
            return (
                <tr key={row.id}>
                    <td>@{row.user.gameid}</td>
                    <td>{row.role_name}</td>
                    <td>{row.description}</td>
                    {needControl ?
                        <td><a href="javascript:void(0)" onClick={(e) => this.props.onMemberMove(row, e)} title="Move member"
                               className="btn btn-warning btn-sm"><i
                            className="fa fa-arrows-v" aria-hidden="true"></i></a></td> : <td></td>}
                    {needControl ?
                        <td><a href="javascript:void(0)" onClick={(e) => this.props.onMemberKick(row, e)} title="Kick"
                               className="btn btn-danger btn-sm"><i
                            className="fa fa-trash-o" aria-hidden="true"></i></a></td> : <td></td>}
                </tr>
            );
        }.bind(this));
        return (
            <table className="table table-striped table-hover roster">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Description</th>
                    <th width={30}></th>
                    <th width={30}></th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        )
    }
}
RosterTable.propTypes = {
    onMemberMove: React.PropTypes.func.isRequired,
    onMemberKick: React.PropTypes.func.isRequired,
    data: React.PropTypes.array.isRequired,
    managed: React.PropTypes.bool.isRequired
};

const GroupRoster = React.createClass({
    propTypes: {
        managed: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {data: []};
    },
    componentDidMount() {
        this.refs.mask.handleLoad(this.loadFunc);
    },
    loadFunc() {
        return getJSON('/api/group/' + this.props.id + '/members').then(function (json) {
            if (json.error) {
                alert(json.error);
            } else {
                this.setState({data: json});
            }
            return json;
        }.bind(this));
    },
    onMemberMove(row) {
        this.setState({
            data: this.state.data.map(function (el) {
                if (row.id === el.id) {
                    el.ismain = !el.ismain;
                }
                return el;
            })
        });
    },
    onMemberKick(row) {
        this.setState({
            data: this.state.data.filter(function (el) {
                return (row.id !== el.id);
            })
        });
    },
    render() {
        if (this.state.data.length > 0) {
            return (
                <div>
                    <h3>Main</h3>
                    <RosterTable onMemberMove={this.onMemberMove} onMemberKick={this.onMemberKick}
                                 data={this.state.data.filter(row => row.ismain === true)} managed={this.props.managed}/>

                    <h3>StandBy</h3>
                    <RosterTable onMemberMove={this.onMemberMove} onMemberKick={this.onMemberKick}
                                 data={this.state.data.filter(row => row.ismain === false)} managed={this.props.managed}/>
                </div>
            )
        } else {
            return (
                <LoadMask ref="mask">
                    <p>Loading members...</p>
                </LoadMask>
            )
        }
    }
});

const GroupView = React.createClass({
    getIsManaged() {
        return (window.INITIAL_DATA.id === this.state.data.leader.id);
    },
    getInitialState() {
        return {data: {}};
    },
    componentDidMount: function () {
        this.refs.mask.handleLoad(this.loadFunc);
    },
    loadFunc() {
        return getJSON('/api/group/' + this.props.params.id).then(function (json) {
            if (json.error) {
                //alert(json.error);
                browserHistory.push('/404');
            } else {
                this.setState({data: json});
            }
            return json;
        }.bind(this));
    },
    render() {
        if (this.state.data.id) {
            return (
                <div>
                    <h2>Group #{this.props.params.id} | Leader: <span className="label label-info">@{this.state.data.leader.gameid}</span></h2>
                    <GroupRoster id={this.props.params.id} managed={this.getIsManaged()}/>
                </div>
            )
        } else {
            return (
                <LoadMask ref="mask">
                    <h2>Group #{this.props.params.id}</h2>
                    <p>Loading...</p>
                </LoadMask>
            )
        }
    }
});

export default GroupView;