import React from 'react';
import * as Query from './QueryContainer';
import _ from 'lodash';
/**
 * People
 *
 * Display People from Star Wars API
 * @class People
 * @constructor
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
    renderLoadingIcon() {
        if (this.state.loadingIcon) {
            return <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>;
        }
    },
    renderNext() {
        return <button onClick={this.getMore} className="btn btn-default">Next {this.renderLoadingIcon()}</button>;
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
            <div>
                <div className="container-fluid">
                    <div className="row">
                        {this.renderPeople()}
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-sm-offset-4">
                            {this.renderNext()}
                        </div>
                    </div>
                </div>
            </div>);
    }
});

export default Query.createContainer(People, {
    "method": "get",
    "route": "http://swapi.co/api/people?page=1"
});