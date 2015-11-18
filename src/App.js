import "./assets/javascripts/bootstrap";
import "./assets/stylesheets/_bootstrap.scss";
import React from 'react';
import axios from 'axios';
import _ from 'lodash';

export default React.createClass({
    getInitialState() {
        return {
            planets: []
        }
    },
    fetchQuery(query) {
        var defaultQuery = "http://swapi.co/api/planets";
        var chosenQuery = query ? query : defaultQuery;
        axios.get(chosenQuery)
            .then((payload) => {
                this.setState({
                    "planets": this.state.planets.concat(payload.data.results),
                    "next": payload.data.next
                });
            });
    },
    componentDidMount() {
        this.fetchQuery();
    },
    renderPlanets() {
        return this.state.planets.map((planet, index) => {
            return <div className="col-sm-4" key={_.kebabCase(planet.name + " " + index)}>
                <h3>{planet.name}</h3>
                <p>{planet.terrain}</p>
            </div>;
        });
    },
    renderLoadMore() {
        if (this.state.next) {
            return <button onClick={() => this.fetchQuery(this.state.next)} className="btn">Load More</button>;
        }

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
                    <div className="row pull-5">{this.renderLoadMore()}</div>
                </div>
            </div>
        );
    }
});