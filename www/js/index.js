'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Note = React.createClass({
    displayName: 'Note',
    getInitialState: function getInitialState() {
        return { editing: false };
    },
    componentWillMount: function componentWillMount() {
        this.style = {
            right: this.randomBetween(0, window.innerWidth - 150, 'px'),
            top: this.randomBetween(0, window.innerHeight - 150, 'px')
        };
    },
    componentDidUpdate: function componentDidUpdate() {
        if (this.state.editing) {
            this.refs.newText.focus();
            this.refs.newText.select();
        }
    },
    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return this.props.children !== nextProps.children || this.state !== nextState;
    },
    randomBetween: function randomBetween(x, y, s) {
        return x + Math.ceil(Math.random() * (y - x)) + s;
    },
    edit: function edit() {
        this.setState({ editing: true });
    },
    save: function save() {
        this.props.onChange(this.refs.newText.value, this.props.id);
        this.setState({ editing: false });
    },
    remove: function remove() {
        this.props.onRemove(this.props.id);
    },
    renderForm: function renderForm() {
        return React.createElement(
            'div',
            { className: 'note',
                style: this.style },
            React.createElement('textarea', { ref: 'newText',
                defaultValue: this.props.children }),
            React.createElement(
                'button',
                { onClick: this.save },
                'SAVE'
            )
        );
    },
    renderDisplay: function renderDisplay() {
        return React.createElement(
            'div',
            { className: 'note',
                style: this.style },
            React.createElement(
                'p',
                null,
                this.props.children
            ),
            React.createElement(
                'span',
                null,
                React.createElement(
                    'button',
                    { onClick: this.edit },
                    'EDIT'
                ),
                React.createElement(
                    'button',
                    { onClick: this.remove },
                    'X'
                )
            )
        );
    },
    render: function render() {
        return React.createElement(
            ReactDraggable,
            null,
            this.state.editing ? this.renderForm() : this.renderDisplay()
        );
    }
});

var Board = React.createClass({
    displayName: 'Board',

    propTypes: {
        count: function count(props, propName) {
            if (typeof props[propName] !== "number") {
                return new Error("the count must be a number");
            }

            if (props[propName] > 100) {
                return new Error('Creating ' + props[propName] + ' notes is ridiculous');
            }
        }
    },
    getInitialState: function getInitialState() {
        return {
            notes: []
        };
    },
    componentWillMount: function componentWillMount() {
        var _this = this;

        if (this.props.count) {
            var url = 'https://baconipsum.com/api/?type=all-meat&sentences=' + this.props.count;
            fetch(url).then(function (results) {
                return results.json();
            }).then(function (array) {
                return array[0];
            }).then(function (text) {
                return text.split('. ');
            }).then(function (array) {
                return array.forEach(function (sentence) {
                    return _this.add(sentence);
                });
            }).catch(function (err) {
                console.log("Didn't connect to the API", err);
            });
        }
    },
    nextId: function nextId() {
        this.uniqueId = this.uniqueId || 0;
        return this.uniqueId++;
    },
    add: function add(text) {
        var notes = [].concat(this.state.notes, [{
            id: this.nextId(),
            note: text
        }]);
        this.setState({ notes: notes });
    },
    update: function update(newText, id) {
        var notes = this.state.notes.map(function (note) {
            return note.id !== id ? note : _extends({}, note, {
                note: newText
            });
        });
        this.setState({ notes: notes });
    },
    remove: function remove(id) {
        var notes = this.state.notes.filter(function (note) {
            return note.id !== id;
        });
        this.setState({ notes: notes });
    },
    eachNote: function eachNote(note) {
        return React.createElement(
            Note,
            { key: note.id,
                id: note.id,
                onChange: this.update,
                onRemove: this.remove },
            note.note
        );
    },
    render: function render() {
        var _this2 = this;

        return React.createElement(
            'div',
            { className: 'board' },
            this.state.notes.map(this.eachNote),
            React.createElement(
                'button',
                { onClick: function onClick() {
                        return _this2.add('New Note');
                    } },
                '+'
            )
        );
    }
});

ReactDOM.render(React.createElement(Board, { count: 10 }), document.getElementById('react-container'));