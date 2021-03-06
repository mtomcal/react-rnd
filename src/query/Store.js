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
import {EventEmitter} from 'events';

var EE = new EventEmitter();

let QueryStore = Immutable.Map();

let emit = function (affects) {
    EE.emit('update', affects);
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

export let updateContainer = function (options, cb) {
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

export let updateMutation = function ({method, route, payload, affects}, cb) {
    invariant(_.isObject(payload), "Failed to provide payload of type Object");
    invariant(_.isString(route), "Failed to provide a route");
    request({method, route, payload}, (err, res) => {
        if (!err) {
            emit(affects);
        }
        if (cb) {
            cb(err, res);
        }
    });
};

export let getState = function () {
    return QueryStore;
};

export let subscribe = function (cb) {
    EE.on('update', cb);
    return () => {
        EE.removeListener('update', cb);
    };
};
