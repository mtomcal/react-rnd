import Central from './Central';

let getCursor = function (cursor, state) {
    return state.get(cursor);
};

let setState = function (cursor, value) {
    return Central.getState().set(cursor, value);
};

export default {
    init() {
        this.listenTo(Central, this._onUpdate);
    },
    getState() {
        return getCursor(this.cursor, Central.getState());
    },
    update(state) {
        Central.update(setState(this.cursor, state));
    },
    _onUpdate(oldState, newState) {
        let oldCursorState = getCursor(this.cursor, oldState);
        let newCursorState = getCursor(this.cursor, newState);
        if (oldCursorState !== newCursorState) {
            this.onChange();
        }
    }
}
