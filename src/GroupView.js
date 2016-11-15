import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {LoadMask, getJSON, postJSON} from './Helpers';

const RoleView = React.createClass({
    handleChange(e) {
        postJSON('/api/group/' + this.props.row.group + '/change-role', {role_id: this.refs.role.value});
    },
    render() {
        if (window.INITIAL_DATA.id === this.props.row.user.id) {
            return (<select ref="role" className="form-control" onChange={this.handleChange} defaultValue={this.props.row.role}>
                <option value="4">Any</option>
                <option value="1">Damage Dealer</option>
                <option value="2">Healer</option>
                <option value="3">Tank</option>
            </select>);
        }
        return (<span>{this.props.row.role_name}</span>);
    }
});

class RosterTable extends Component {
    render() {
        let rows = this.props.data.map(function (row) {
            let needControl = window.INITIAL_DATA.id !== row.user.id && this.props.managed;
            return (
                <tr key={row.id}>
                    <td>@{row.user.gameid}</td>
                    <td><RoleView row={row}/></td>
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
        postJSON('/api/group/' + this.props.id + '/move-member', {member_id: row.user.id});
    },
    onMemberKick(row) {
        this.setState({
            data: this.state.data.filter(function (el) {
                return (row.id !== el.id);
            })
        });
        postJSON('/api/group/' + this.props.id + '/kick-member', {member_id: row.user.id});
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
                    <h2>
                        Group #{this.props.params.id}{' '}
                        {this.getIsManaged() ?
                            <Link title="Edit" to={'/group/' + this.props.params.id + '/edit'}><i className="fa fa-cog"
                                                                                                  aria-hidden="true"></i></Link> : ''}
                        {' '}| Leader: <span className="label label-info">@{this.state.data.leader.gameid}</span>
                    </h2>
                    {this.state.data.next_event ? <div className="panel panel-danger">
                        <div className="panel-body">Next event: {this.state.data.next_event.time}</div>
                    </div> : ''}
                    <div>
                        <Link className="btn btn-warning" to={'/group/' + this.props.params.id + '/event/create'}>Create Event</Link>
                        {' '}
                        <Link className="btn btn-info" to={'/group/' + this.props.params.id + '/event/list'}>Events list</Link>
                    </div>
                    <GroupRoster id={this.props.params.id} managed={this.getIsManaged()}/>
                    {this.state.data.description ? <div className="panel panel-warning">
                        <div className="panel-body" dangerouslySetInnerHTML={{__html: this.state.data.description_md}}/>
                    </div> : ''}
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