import "./assets/javascripts/bootstrap";
import "./assets/stylesheets/_bootstrap.scss";
import React from 'react';
import * as Query from './QueryContainer';
import axios from 'axios';
import _ from 'lodash';

export let App = React.createClass({
    renderPlanets() {
        const {res} = this.props.queryData;
        return res.data.results.map((planet, index) => {
                return <div className="col-sm-4" key={_.kebabCase(planet.name + " " + index)}>
                    <h3>{planet.name}</h3>
                    <p>{planet.terrain}</p>
                </div>;
            });
    },
    getMore() {
        const {req, res} = this.props.queryData;

        //Update the QueryContainer with variables and it will perform
        //request then will update props with new results

        this.props.queryData.setVariables({route: res.data.next});
    },
    renderNext() {
        return <button onClick={this.getMore} className="btn btn-default">Next</button>;
    },
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a href="#" className="navbar-brand">React Rnd</a>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid">
                    <div className="row">
                        {this.renderPlanets()}
                    </div>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-sm-offset-4">
                            {this.renderLoadMore()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default Query.createContainer(App, {
    "method": "get",
    "route": "http://swapi.co/api/planets?page=1"
});