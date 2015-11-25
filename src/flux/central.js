import Reflux from 'reflux';
import Immutable from 'immutable';

let _history = Immutable.List();
let _store = Immutable.Map({
    "favorites": Immutable.Map({})
});

export default Reflux.createStore({
    init() {

    },
    getState() {
        return _store;
    },
    update(store) {
        _store = store;
        _history = _history.push(store);
        this.trigger(_history[-2], store);
    },
    rewind(delta) {
        _store = _history.get(delta);
        _history = _history.push(_store);
    }
})