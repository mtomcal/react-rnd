import React from 'react';
import * as Query from './QueryContainer';
import * as QueryStore from './QueryStore';
import _ from 'lodash';
/**
 * Add Starships
 *
 * Add Starships from Star Wars API
 * @class AddStarships
 * @constructor
 */
export default React.createClass({
    onSubmit(e) {
        if (e) {
            e.preventDefault();
        }
        QueryStore.updateMutation({
            method: "post",
            route: "http://localhost:3000/starships",
            payload: {
                name: this.refs.name.value,
                model: this.refs.model.value,
                manufacturer: this.refs.manufacturer.value
            },
            affects: ['starships']
        }, (err, res) => {
        });
    },
    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Starship Name" ref="name"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Starship Model" ref="model"/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="Starship Manufacturer" ref="manufacturer"/>
                        </div>
                        <button onClick={this.onSubmit} className="btn btn-default">Add</button>
                    </form>
                </div>
            </div>
        );
    }
});

