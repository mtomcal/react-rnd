import Reflux from 'reflux';
import Immutable from 'immutable';
import Central from './Central';
import CentralMixin from './CentralMixin';

export let FavoriteActions = Reflux.createActions([
    "add",
    "remove"
]);

window.Central = Central;

export let FavoriteStore = Reflux.createStore({
    init() {
        this.listenToMany(FavoriteActions);
    },
    mixins: [CentralMixin],
    cursor: 'favorites',
    onChange() {
        this.trigger(this.getState().toJS());
    },
    onAdd(key, value) {
        let state = this.getState();
        if (state.get(key)) {
            return this.update(state.set(key, null));

        }
        this.update(state.set(key, value));
    }
});






























