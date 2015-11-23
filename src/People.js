import React from 'react';
import * as Query from './QueryContainer';
import InfiniteList from './InfiniteList';
import _ from 'lodash';
/**
 * People
 *
 * Display People from Star Wars API
 * @class People
 * @construotor
 */
export const People = React.createClass({
    propTypes: {
        queryData: React.PropTypes.shape({
            res: React.PropTypes.object,
            req: React.PropTypes.object,
            setVariables: React.PropTypes.func,
            isLoaded: React.PropTypes.bool,
            isError: React.PropTypes.bool
        })
    },
    people: [],
    renderPeople() {
        const {res} = this.props.queryData;

        this.people = _.uniq(this.people.concat(res.data.results));

        return this.people.map((person, index) => {
            return <div className="col-sm-4" key={_.kebabCase(person.name + " " + index)}>
                <h3>{person.name}</h3>
            </div>;
        });
    },
    render() {
        return (
            <InfiniteList queryData={this.props.queryData}>
                {this.renderPeople()}
            </InfiniteList>
        );
    }
});

export default Query.createContainer(People, {
    "method": "get",
    "route": "http://swapi.co/api/people?page=1"
});