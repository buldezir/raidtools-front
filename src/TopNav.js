import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';


class NavIsNotAuthed extends Component {
    render() {
        return (
            <Bootstrap.Navbar.Form pullRight>
                <a href="/fbauth/" className="btn btn-social btn-facebook" title="Sign in">
                    <i className="fa fa-facebook"></i>
                    Sign in with Facebook
                </a>
                {' '}
                <a href="/vkauth/" className="btn btn-social btn-vk" title="Sign in">
                    <i className="fa fa-vk"></i>
                    Sign in with VK
                </a>
            </Bootstrap.Navbar.Form>
        )
    }
}

class NavIsAuthed extends Component {
    render() {
        return (
            <Bootstrap.Navbar.Form pullRight>
                {this.props.fbid ?
                    <button className="btn btn-social btn-facebook" disabled="disabled">
                        <i className="fa fa-facebook"></i>
                        {this.props.fbname}
                    </button>
                    :
                    <a href="/fbauth/" className="btn btn-social btn-facebook" title="Connect FB">
                        <i className="fa fa-facebook"></i>
                        Connect Facebook
                    </a>
                }
                {' '}
                {this.props.vkid ?
                    <button className="btn btn-social btn-vk" disabled="disabled">
                        <i className="fa fa-vk"></i>
                        {this.props.vkname}
                    </button>
                    :
                    <a href="/vkauth/" className="btn btn-social btn-vk" title="Connect VK">
                        <i className="fa fa-vk"></i>
                        Connect VK
                    </a>
                }
                {' '}
                <a href="/logout/" className="btn btn-warning" title="Sign out">
                    <i className="fa fa-sign-out fa-lg"></i>
                </a>
            </Bootstrap.Navbar.Form>
        )
    }
}

export {NavIsAuthed, NavIsNotAuthed};