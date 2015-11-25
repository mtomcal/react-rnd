import Reflux from 'reflux';
import Immutable from 'immutable';
import Central from './Central';

export let FavoriteActions = Reflux.createActions([
    "add",
    "remove"
]);

export let FavoriteStore = Reflux.createStore({
    init() {
        this.listenTo(Central, this.onUpdate);
        this.listenToMany(FavoriteActions);
    },
    cursor: 'favorites',
    getCursor(state) {
        return state.get(this.cursor);
    },
    setCursor(value) {
        return this.getCursor(this.getState()).set(this.cursor, value);
    },
    getState() {
        return this.getCursor(Central.getState());
    },
    update(state) {
        Central.update(this.setCursor(state));
    },
    onUpdate(oldState, newState) {
        if (this.getCursor(oldState) !== this.getCursor(newState)) {
            this.trigger(this.getState().toJS());
        }
    },
    onAdd(key, value) {
        let state = this.getState();
        this.update(state.set(key, value));
    }
});




FavoriteStore.listen(function (val) {
    console.log(val);
});

FavoriteActions.add("first", "stuff");

