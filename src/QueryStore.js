/**
 * QueryStore
 *
 * Central Query Store for Execution and Caching of queries
 * @class QueryStore
 * @constructor
 */
import axios from 'axios';
import Immutable from 'immutable';
import invariant from 'invariant';
import _ from 'lodash';

let QueryStore = Immutable.Map();
let ComponentSubscribers = Immutable.List();



let emit = function () {
    ComponentSubscribers.forEach(function (value) {
        if (_.isFunction(value)) {
            value();
        }
    });
};

let storeCache = function (store) {
    QueryStore = store;
};
let request = function ({method = "get", route, payload}, cb) {

    axios[method](route, payload)
        .then(function (res) {
            cb(null, res);
        })
        .catch(function (err) {
            console.log(err);
            cb(err);
        });
};

let updateSubscribers = function (store) {
    ComponentSubscribers = store;
};

let updateContainer = function (options, cb) {
    let {key, route, noCache} = options;

    if (!key) {
        key = route;
    }

    let cache = QueryStore.get(key);

    if (cache && !noCache) {
        setTimeout(() => {
            cb(null, cache);
        }, 1);
        return;
    }

    let cacheCallback = (err, res) => {
        storeCache(QueryStore.set(key, res));
        cb(err, res);
    };

    return request(options, cacheCallback)
};

let updateMutation = function ({method, route, payload, affects}, cb) {
    invariant(_.isObject(payload), "Failed to provide payload of type Object");

};

export let update = function ({type, ...options}, cb) {
    if (type === "Container") {
        updateContainer(options, cb);
    }
    if (type === "Mutation") {
        updateMutation(options, cb);
    }
};

export let getState = function () {
    return QueryStore;
};

export let subscribe = function (cb) {
    var index = ComponentSubscribers.size;
    updateSubscribers(ComponentSubscribers.set(index, cb));
    return () => {
        updateSubscribers(ComponentSubscribers.set(index, null));
    };
};
