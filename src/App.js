import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {GroupJoin} from './GroupJoin';
import GroupCreateForm from './GroupCreate';
import GroupEditForm from './GroupEdit';
import NavUserIdForm from './MyUserid';
import GroupList from './GroupList';
import GroupView from './GroupView';
import EventCreateForm from './EventCreate';
import ApiTest from './ApiTest';
import {PageNotFound} from './Helpers';
import {NavIsAuthed, NavIsNotAuthed} from './TopNav';
import {browserHistory, Router, Route, IndexRoute, IndexRedirect, Link} from 'react-router';

const NavTab = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    render() {
        let isActive = this.context.router.isActive(this.props.to, this.props.query);
        let className = isActive ? 'active' : '';
        return <li className={className}><Link {...this.props}/></li>
    }
});

class MainContent extends Component {
    render() {
        return this.props.authed && this.props.gameid ?
            (
                <div className="row">
                    <div className="col-md-3">
                        <div className="custom-tabs">
                            <ul className="nav nav-pills nav-stacked">
                                <NavTab to="/group">My groups</NavTab>
                                <NavTab to="/group/join">Join group</NavTab>
                                <NavTab to="/group/create">Create group</NavTab>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-9">
                        {React.cloneElement(this.props.children, this.props)}
                    </div>
                </div>
            ) :
            (
                <p className="text-center">
                    <h2>Welcome to Raid Tools</h2>
                    This is app for managing game groups/raids. Currently supported only <a
                    href="http://www.elderscrollsonline.com/en-gb/home">Elder Scrolls Online</a>
                    <br/>
                    To start use please sing in and provide your game ID (@accountid)
                </p>
            );
    }
}

let Layout = React.createClass({

    getInitialState() {

        // return {
        //     authed: window.INITIAL_DATA.authed,
        //     username: window.INITIAL_DATA.username,
        //     userid: window.INITIAL_DATA.userid
        // };
        return window.INITIAL_DATA;
    },

    componentDidMount: function () {
        // fetch('/data')
        //     .then(function (response) {
        //         return response.json();
        //         // return {userid: 10210621139426367};
        //     }).then(function (user) {
        //     this.setState({
        //         userid: user.userid,
        //         authed: true
        //     });
        // }.bind(this));
    },

    handleGameIdUpdate(value) {
        this.setState({gameid: value.replace('@', '')});
    },

    render() {
        return (
            <div className="container">
                <Bootstrap.Navbar fixedTop>
                    <Bootstrap.Grid>
                        <Bootstrap.Navbar.Header>
                            <Bootstrap.Navbar.Brand>
                                <Link to="/">Raid Tools</Link>
                            </Bootstrap.Navbar.Brand>
                            {this.state.authed ? <NavUserIdForm onUserInput={this.handleGameIdUpdate} gameid={this.state.gameid}/> : ''}
                            <Bootstrap.Navbar.Toggle />
                        </Bootstrap.Navbar.Header>
                        {this.state.authed ? <NavIsAuthed {...this.state}/> : <NavIsNotAuthed/>}
                    </Bootstrap.Grid>
                </Bootstrap.Navbar>
                <br/><br/><br/>
                <Bootstrap.Jumbotron>
                    {React.cloneElement(this.props.children, this.state)}
                </Bootstrap.Jumbotron>
                {location.hostname === 'raidtools.buldezir.com' ? '' : <ApiTest/>}
                <Bootstrap.Navbar fixedBottom>
                    <Bootstrap.Navbar.Text>
                        Created by <Bootstrap.Navbar.Link href="https://www.facebook.com/buldezir" target="_blank"><i className="fa fa-facebook"></i> Alexandr
                        Arutyunov</Bootstrap.Navbar.Link> <Bootstrap.Navbar.Link href="https://vk.com/buldezir" target="_blank"><i className="fa fa-vk"></i></Bootstrap.Navbar.Link> &copy; {(new Date()).getFullYear()}
                    </Bootstrap.Navbar.Text>
                </Bootstrap.Navbar>
            </div>
        );
    }
});

class App extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Layout}>
                    <Route component={MainContent}>
                        <IndexRedirect to="/group"/>
                        <Route path="/group/create" component={GroupCreateForm}/>
                        <Route path="/group/join" component={GroupJoin}/>
                        <Route path="/group">
                            <IndexRoute component={GroupList}/>
                            <Route path="/group/:id" component={GroupView}/>
                            <Route path="/group/:id/edit" component={GroupEditForm}/>
                            <Route path="/group/:id/event/create" component={EventCreateForm}/>
                        </Route>
                    </Route>
                    <Route path="*" component={PageNotFound}/>
                </Route>
            </Router>
        )
    }
}

export default App;