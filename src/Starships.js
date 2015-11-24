import React from 'react';
import * as Query from './QueryContainer';
import * as QueryStore from './QueryStore';
import _ from 'lodash';
/**
 * Starships
 *
 * Display Starships from Star Wars API
 * @class Starships
 * @constructor
 */
export const Starships = React.createClass({
    propTypes: {
        queryData: React.PropTypes.shape({
            res: React.PropTypes.object,
            req: React.PropTypes.object,
            setVariables: React.PropTypes.func,
            isLoaded: React.PropTypes.bool,
            isError: React.PropTypes.bool
        })
    },
    renderStarships() {
        let {res} = this.props.queryData;

        return res.data.map(function (starship, index) {
            return (<div className="col-sm-4" key={_.kebabCase(starship) + " " + index}>
                <h3>{starship.name}</h3>
                <ul>
                    <li>{starship.model}</li>
                    <li>{starship.manufacturer}</li>
                </ul>
            </div>);

        });
    },
    render() {
        return (
            <div className="row">{this.renderStarships()}</div>
        );
    }
});

export default Query.createContainer(Starships, {
    "key": "starships",
    "route": "http://localhost:3000/starships"
});