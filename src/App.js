import "./assets/javascripts/bootstrap";
import "./assets/stylesheets/_bootstrap.scss";
import React from 'react';

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
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4">
                            <h1>Project</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});