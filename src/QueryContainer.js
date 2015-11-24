import React from 'react';
import invariant from 'invariant';
import _ from 'lodash';
import * as QueryStore from './QueryStore';

//A default error handling message component

var ErrorComponentBase = React.createClass({
        render() {
            return (<div>
            <p className="strong">Failed to fetch {this.props.route}</p>
            <pre>{this.props.err.stack.toString()}</pre>
            </div>);
        }
    });

//A default loading component

var LoaderComponentBase = React.createClass({
        render() {
            return <p className="strong">Loading...</p>;
        }
});

/**
 * Using a relay style createContainer higher order
 * component to assist in simplifying the AJAXing for components
 * Available options:
 * * route: "http://..."
 * * noCache: true or false to ignore cache
 * @param Component {ReactComponent}
 * @param options {Object}
 * @returns {ReactElement}
 */
export const createContainer = function(Component, options) {
    let {LoaderComponent, ErrorComponent} = options;

    invariant(
        _.isString(options.route),
        "Undefined route and method props for createContainer"
    );

    invariant(
        _.isString(options.key),
        "Undefined Query Key"
    );

    //Use default error and loading components if Error and Loader
    //not defined

    ErrorComponent = ErrorComponent || ErrorComponentBase;
    
    LoaderComponent = LoaderComponent || LoaderComponentBase;

    //Returned Generic Wrapping data component for mediating AJAX requests

    var DataComponent = React.createClass({

        //Use this.props.queryData.setVariables to run more requests
        //once child component is mounted
        //May use an optional callback on completion of request

        options: _.assign({}, options),

        setVariables(userRequest, cb) {

            //Use pre-supplied options to fill in defaults

            this.options = _.assign(this.options, userRequest);

            //Reset the key so that an uncached new query can be requested
            if (!userRequest.key) {
                this.options.key = null;
            }

            //Invariant checks
            invariant(
                _.isString(this.options.route),
                "Illegal request options in setVariables"
            );

            this.executeRequest(this.options, cb);
        },
        getInitialState() {
            return {
                isLoaded: false,
                isError: false,
                setVariables: this.setVariables,
                reset: () => { this.options = _.assign({}, options); this.setVariables(this.options); }
            };
        },

        //Execute request with quester and store AJAX options as
        //this.props.queryData.req in child component
        //Optional callback

        executeRequest({key, route, noCache}, cb) {
            this.setState({
                req: {route, key, noCache}
            });
            QueryStore.update({type: "Container", key, route, noCache}, (err, res) => {
                if(cb) {
                    cb(err, res);
                }
                this.requestCallback(err, res);
            });
        },

        //Callback handler for updating state on this Data component

        requestCallback(err, res) {
            if (err) {
                return this.setState({err: err, isError: true});
            }
            return this.setState({
                isLoaded: true, //Set is loaded to removing loading component
                res: res //Set the axios response object to res
            });
        },

        //Unsubscribe handler for state changes from QueryStore
        unsubscribe: null,

        componentDidMount() {

            //Run the default web request onMount
            this.executeRequest(this.options);

            //Subscribe to QueryStore updates based on POST queries
            //and update GET queries based on perceived mutations
            this.unsubscribe = QueryStore.subscribe(() => {
                let state = QueryStore.getState();
                let value = state.get(this.options.key);
                if (value) {
                    this.requestCallback(null, value);
                }
            });
        },
        componentWillUnmount() {
            this.unsubscribe();
        },
        render() {

            //If theres an error in ajax request display error

            if (this.state.isError) return <ErrorComponent err={this.state.err} route={route} />;

            //If loaded display child component

            if (this.state.isLoaded) return <Component queryData={this.state} {...this.props}/>;

            //Return loader component
            return <LoaderComponent/>;
        }
    });

    //Return nonRendered DataComponent

    return DataComponent;
};

