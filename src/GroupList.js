import React, {Component} from 'react';
import {Link} from 'react-router';
import {LoadMask, getJSON} from './Helpers';

const GroupList = React.createClass({
    getInitialState() {
        return {
            // data: window.INITIAL_DATA.groupList || []
            data: []
        };
    },
    componentDidMount() {
        // if (window.INITIAL_DATA.groupList) {
        //     this.timer = setTimeout(function () {
        //         window.INITIAL_DATA.groupList = null;
        //     }, 1000*15);
        // } else {
        //     this.refs.mask.handleLoad(this.loadFunc);
        // }
        this.refs.mask.handleLoad(this.loadFunc);
    },
    componentWillUnmount() {
        // clearTimeout(this.timer);
    },
    loadFunc() {
        return getJSON('/api/group').then(function (json) {
            if (json.error) {
                alert(json.error);
            } else {
                this.setState({data: json});
                window.INITIAL_DATA.groupList = json;
            }
            return json;
        }.bind(this));
    },
    render() {
        if (this.state.data.length > 0) {
            let rows = this.state.data.map(function (row) {
                return (
                    <tr key={row.group.id}>
                        <td>{row.group.id}</td>
                        <td><Link to={'/group/' + row.group.id}>{row.group.name}</Link></td>
                        <td>@{row.group.leader.gameid}</td>
                    </tr>
                );
            });
            return (
                <table className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Leader</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            )
        } else {
            return (
                <LoadMask ref="mask" needLoad={true}>
                    <h2>No groups yet</h2>
                    <p><Link to="/group-create">Create your own group</Link> or <Link to="/group-join">join existing</Link></p>
                </LoadMask>
            )
        }
    }
});

export default GroupList;