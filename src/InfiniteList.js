import React from 'react';
import * as Query from './QueryContainer';
import _ from 'lodash';
/**
 * Infinite List
 *
 * Display List from Star Wars API
 * @class People
 * @constructor
 */
export default React.createClass({
    propTypes: {
        queryData: React.PropTypes.shape({
            res: React.PropTypes.object,
            req: React.PropTypes.object,
            setVariables: React.PropTypes.func,
            isLoaded: React.PropTypes.bool,
            isError: React.PropTypes.bool
        }),
        children: React.PropTypes.element
    },
    getInitialState() {
        return {
            loadingIcon: false
        }
    },
    getMore() {
        const {req, res} = this.props.queryData;

        //Update the QueryContainer with variables and it will perform
        //request then will update props with new results

        this.props.queryData.setVariables({route: res.data.next}, () => {
            //On Request completion
            this.setState({loadingIcon: false});
        });

        //Trigger Loading icon while request has been triggered
        this.setState({loadingIcon: true});
    },
    reset() {
        this.props.dataRef([]);
        this.props.queryData.reset();
    },
    renderLoadingIcon() {
        if (this.state.loadingIcon) {
            return <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>;
        }
    },
    renderNext() {
        return <button onClick={this.getMore} className="btn btn-default">Next {this.renderLoadingIcon()}</button>;
    },
    renderReset() {
        return <button onClick={this.reset} className="btn btn-default">Reset</button>;
    },
    render() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        {this.props.children}
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-sm-offset-4">
                            {this.renderNext()}
                            {this.renderReset()}
                        </div>
                    </div>
                </div>
            </div>);
    }
});
