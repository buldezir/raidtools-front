import React, {Component, PropTypes} from 'react';

import {fetchJSON, LoadMask} from './Helpers';

let ApiTest = React.createClass({
    getInitialState() {
        return {
            result: ''
        };
    },
    handleSubmit(e) {
        e.preventDefault();
        if (!this.refs.button.disabled) {
            this.refs.button.disabled = true;
            this.refs.mask.handleLoad(this.loadFunc);
        }
    },
    loadFunc() {
        let method = this.refs.method.value;
        let path = this.refs.path.value;
        let payload = this.refs.payload.value;
        let params = (payload.length > 0) ? JSON.parse(payload) : {};

        return fetchJSON(path, params, method).then(function (json) {
            this.setState({result: JSON.stringify(json)});
            this.refs.button.disabled = false;
            return json;
        }.bind(this));
    },
    render() {
        return (
            <div style={{padding: 20}}>
                <form className="form-inline" onSubmit={this.handleSubmit}>
                    Api test
                    {' '}
                    <div className="form-group">
                        <select name="method" className="form-control" ref="method">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                        </select>
                    </div>
                    {' '}
                    <div className="form-group">
                        <input name="path" className="form-control" placeholder="path" size="40" ref="path"/>
                    </div>
                    {' '}
                    <div className="form-group">
                        <input name="payload" className="form-control" placeholder="payload" size="70" ref="payload"/>
                    </div>
                    {' '}
                    <input type="submit" className="btn btn-default" ref="button"/>
                </form>
                <br/>
                <div className="loading-mask-parent">
                    <LoadMask ref="mask" needLoad={true}>
                        <pre>{this.state.result}</pre>
                    </LoadMask>
                </div>
            </div>
        );
    }
});

export default ApiTest;