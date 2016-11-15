import React, {Component} from 'react';
import * as Bootstrap from 'react-bootstrap';
import {Link} from 'react-router';

class PageNotFound extends React.Component {
    render() {
        return (
            <div>
                <h1>Page Not Found.</h1>
                <p>Go to <Link to="/">Home Page</Link></p>
            </div>
        )
    }
}

const LoadMask = React.createClass({
    propTypes: {
        needLoad: React.PropTypes.bool
    },
    getDefaultProps: function () {
        return {
            needLoad: false
        };
    },
    getInitialState() {
        return {
            loading: false,
            loaded: !this.props.needLoad
        };
    },
    handleLoad(loadCallback) {
        this.setState({loading: true});
        loadCallback().then(function (data) {
            if (this.isMounted()) {
                this.setState({loading: false, loaded: true});
            }
            return data;
        }.bind(this)).catch(function (e) {
            if (this.isMounted()) {
                this.setState({loading: false});
            }
        }.bind(this));
    },
    render() {
        const mask = (<div className="loading-mask"><i className="fa fa-spinner fa-pulse fa-3x fa-fw" aria-hidden="true"></i></div>);
        //return this.state.loading ? mask : (this.state.loaded ? <div>{this.props.children}</div> : null);
        if (this.props.needLoad) {
            return this.state.loading ? <div>{mask}<br/><br/><br/><br/><br/><br/><br/><br/></div> : (this.state.loaded ? <div>{this.props.children}</div> : null);
        } else {
            return this.state.loading ? <div>{mask}{this.props.children}</div> : <div>{this.props.children}</div>;
        }
    }
});

class FormSectionHeader extends Component {
    render() {
        return (
            <Bootstrap.Col smOffset={3} sm={9} style={{paddingLeft: 0}}>
                <h3>{this.props.children}</h3>
            </Bootstrap.Col>
        )
    }
}

function collectFormValues(formDomElement) {
    let values = {};
    for (let i in formDomElement.elements) {
        if (formDomElement.elements.hasOwnProperty(i)) {
            let el = formDomElement.elements[i];
            if (el.name) {
                if (el.type === 'checkbox') {
                    if (el.checked) {
                        values[el.name] = el.value;
                    }
                } else {
                    values[el.name] = el.value;
                }
            }
        }
    }
    // formDomElement.elements.forEach((el) -> );
    return values;
}

function fetchJSON(url, params, method) {
    let data = null;
    method = method || 'GET';
    if (method !== 'GET' && method !== 'HEAD' && params) {
        data = new FormData();
        for (let x in params) {
            if (params.hasOwnProperty(x)) {
                data.append(x, params[x]);
            }
        }
    }
    return fetch(url, {
        method: method === 'GET' ? 'GET' : 'POST',
        body: data,
        credentials: 'include',
        headers: {
            'X-HTTP-METHOD-OVERRIDE': method,
            'X-Requested-With': 'XMLHttpRequest'
        }
    }).then(function (response) {
        return response.json();
    }).catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
}

function getJSON(url) {
    return fetchJSON(url, null, 'GET');
}

function postJSON(url, params) {
    return fetchJSON(url, params, 'POST');
}

export {PageNotFound, FormSectionHeader, fetchJSON, getJSON, postJSON, collectFormValues, LoadMask};