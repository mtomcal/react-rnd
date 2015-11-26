import Reflux from 'reflux';
import Immutable from 'immutable';

let _schema = Immutable.Map({
    "favorites": Immutable.Map({})
});

let _store = Immutable.fromJS(JSON.parse(window.localStorage.getItem("globalState"))) || _schema;

let _history = Immutable.List([
    _store
]);

let delta = 0;

export default Reflux.createStore({
    getState() {
        return _store;
    },
    update(store) {
        _store = store;
        this.trigger(_history.slice(-1).get(0), store);
        _history = _history.push(store);
        delta = _history.size - 1;
        window.localStorage.setItem("globalState", JSON.stringify(_store.toJS()));
    },
    rewind() {
        delta = delta - 1;
        let store = _history.slice(delta).get(0);
        _store = store;
        this.trigger(_history.slice(delta-1).get(0), store);
    }
});

