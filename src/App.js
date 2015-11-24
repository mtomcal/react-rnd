import "./assets/javascripts/bootstrap";
import "./assets/stylesheets/_bootstrap.scss";
import React from 'react';
import _ from 'lodash';
import Starships from './Starships';
import AddStarship from './AddStarship';

export default React.createClass({
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
                <AddStarship />
                <hr/>
                <Starships />
                <hr/>
                <Starships />
            </div>
        );
    }
});

