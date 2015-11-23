import React from 'react';
import axios from 'axios';
import invariant from 'invariant';
import _ from 'lodash';

//Basic object for storing query history
//TODO Use ImmutableJS for tracking state of all query objects
var inMemoryCache = {

};


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

    //Use default error and loading components if Error and Loader
    //not defined

    ErrorComponent = ErrorComponent || ErrorComponentBase;
    
    LoaderComponent = LoaderComponent || LoaderComponentBase;

    //AJAX method

    var quester = function ({method, route, noCache}, cb) {
        var cache = inMemoryCache[route];
        if (cache && !noCache) {
            return cb(null, cache);
        }
        axios[method](route)
            .then(function (res) {
                inMemoryCache[route] = res;
                cb(null, res);
            })
            .catch(function (err) {
                console.log(err);
                cb(err);
            });
    };

    //Returned Generic Wrapping data component for mediating AJAX requests

    var DataComponent = React.createClass({

        //Use this.props.queryData.setVariables to run more requests
        //once child component is mounted
        //May use an optional callback on completion of request

        setVariables(userRequest, cb) {

            //Use pre-supplied options to fill in defaults

            const reqWithDefaults = _.assign(options, userRequest);

            //Invariant checks
            invariant(
                _.isString(reqWithDefaults.route),
                "Illegal request options in setVariables"
            );

            this.executeRequest(reqWithDefaults, cb);
        },
        getInitialState() {
            return {
                isLoaded: false,
                isError: false,
                setVariables: this.setVariables
            };
        },

        //Execute request with quester and store AJAX options as
        //this.props.queryData.req in child component
        //Optional callback

        executeRequest({method, route, noCache}, cb) {
            this.setState({
                req: {method, route, noCache}
            });
            quester({method, route, noCache}, (err, res) => {
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

        componentDidMount() {
            this.executeRequest(options);
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

