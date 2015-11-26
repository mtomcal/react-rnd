import React from 'react';
import * as Query from './query/Container';
import * as QueryStore from './query/Store';
import {FavoriteStore, FavoriteActions} from './flux/Favorites';
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
    getInitialState() {
        return {
            "favorites": {}
        }
    },
    onFavorite(key) {
        return () => {
            FavoriteActions.add(key, true);
        }
    },
    renderFavorite(key) {
        let style = {
            color: "gold",
            fontSize: "0.75em"
        };
        if (this.state.favorites[key]) {
            return <span style={style} onClick={this.onFavorite(key)} className="glyphicon glyphicon-star"></span>;
        }
        return <span style={style} onClick={this.onFavorite(key)} className="glyphicon glyphicon-star-empty"></span>;
    },
    onRemove(starship) {
        return () => {
            QueryStore.updateMutation({
                method: "delete",
                route: "http://localhost:3000/starships/" + starship.id,
                payload: {
                },
                affects: ['starships']
            }, (err, res) => {
            });
        };
    },
    renderRemove(starship) {
        let style = {
            color: "gray",
            fontSize: "0.75em"
        };
        return <span style={style} onClick={this.onRemove(starship)} className="glyphicon glyphicon-remove"></span>;
    },
    renderStarships() {
        let {res} = this.props.queryData;

        return res.data.map((starship, index) => {
            var key = _.kebabCase(starship) + " " + index;
            return (<div className="col-sm-4" key={key}>
                <h3>{starship.name} {this.renderFavorite(key)}{this.renderRemove(starship)}</h3>
                <ul>
                    <li>{starship.model}</li>
                    <li>{starship.manufacturer}</li>
                </ul>
            </div>);
        });
    },
    store: null,
    componentDidMount() {
        this.store = FavoriteStore.listen((val) => {
            this.setState({favorites: val});
        });
        this.setState({favorites: FavoriteStore.getState().toJS()});
    },
    componentWillUnmount() {
        this.store();
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