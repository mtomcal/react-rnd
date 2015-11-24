import React from 'react';
import * as Query from './QueryContainer';
import InfiniteList from './InfiniteList';
import _ from 'lodash';
/**
 * Planets
 *
 * Display Planets from Star Wars API
 * @class Planets
 * @constructor
 */
export const Planets = React.createClass({
    propTypes: {
        queryData: React.PropTypes.shape({
            res: React.PropTypes.object,
            req: React.PropTypes.object,
            setVariables: React.PropTypes.func,
            isLoaded: React.PropTypes.bool,
            isError: React.PropTypes.bool
        })
    },
    planets: [],
    renderPlanets() {
        const {res} = this.props.queryData;

        this.planets = _.uniq(this.planets.concat(res.data.results));

       return this.planets.map((planet, index) => {
            return <div className="col-sm-4" key={_.kebabCase(planet.name + " " + index)}>
                <h3>{planet.name}</h3>
                <p>{planet.terrain}</p>
            </div>;
        });
    },
    render() {
        return (
            <InfiniteList dataRef={(value) => { this.planets = value; this.setState({}); }} queryData={this.props.queryData}>
                <div>
                    {this.renderPlanets()}
                </div>
            </InfiniteList>
       );
    }
});

export default Query.createContainer(Planets, {
    "key": "planets",
    "route": "http://swapi.co/api/planets?page=1"
});