import React from 'react';
import { render } from 'react-dom';
import Keyboardist from '../../lib';
import './styles.css';

const List = ({ items, selectedItem }) => {
  return (
    <ul className="list">
      {items.map((item, index) => (
        <li
          className={`list-item ${
            index !== selectedItem ? '' : 'list-item--selected'
          }`}
          key={index}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

class KeyboardList extends React.Component {
  state = {
    selectedItem: 0,
  };

  static defaultProperties = {
    onSelect: () => {},
  };

  next = () => {
    let nextItem = this.state.selectedItem + 1;
    if (nextItem >= this.props.items.length) {
      nextItem = this.props.items.length - 1;
    }
    this.setState({ selectedItem: nextItem });
  };

  prev = () => {
    let nextItem = this.state.selectedItem - 1;
    if (nextItem < 0) {
      nextItem = 0;
    }
    this.setState({ selectedItem: nextItem });
  };

  superNext = () => {
    let nextItem = this.state.selectedItem + 3;
    if (nextItem >= this.props.items.length) {
      nextItem = this.props.items.length - 1;
    }
    this.setState({ selectedItem: nextItem });
  };

  superPrev = () => {
    let nextItem = this.state.selectedItem - 3;
    if (nextItem < 0) {
      nextItem = 0;
    }
    this.setState({ selectedItem: nextItem });
  };

  submit = () => {
    this.props.onSelect(this.state.selectedItem);
  };

  render() {
    return (
      <React.Fragment>
        <Keyboardist
          bindings={{
            down: this.next,
            'shift+down': this.superNext,
            up: this.prev,
            'shift+up': this.superPrev,
            enter: this.submit,
          }}
        />
        <List items={items} selectedItem={this.state.selectedItem} />
      </React.Fragment>
    );
  }
}

const items = [
  'Rick Wakeman',
  'Keith Emerson',
  'Jordan Rudess',
  'Tony Banks',
  'Richard Wright',
  'Chick Corea',
  'Stevie Wonder',
  'Herbie Hancock',
  'Aleks Syntek',
  'Chico Che',
];

const Modal = ({ show = false, onClose, children }) => {
  console.log('ONCLOSE', onClose);

  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <Keyboardist
        bindings={{
          esc: onClose,
        }}
      />
      <div className="modal__content">{children}</div>
    </div>
  );
};

class DemoApp extends React.Component {
  state = {
    selected: null,
    showingDialog: false,
  };

  showDialog = () => {
    this.setState({
      showingDialog: true,
    });
  };

  hideDialog = () => {
    this.setState({
      showingDialog: false,
    });
  };

  setItem = index => {
    this.setState({
      selectedItem: items[index],
      showingDialog: true,
    });
  };

  render() {
    return (
      <div>
        <Modal show={this.state.showingDialog} onClose={this.hideDialog}>
          <h3>You selected</h3>
          <h2>{this.state.selectedItem}</h2>
          <p className="instructions">
            press <kbd>ESC</kbd> to close
          </p>
        </Modal>

        <h1>Select your favorite keyboardist</h1>
        <p className="instructions">
          Use up and down arrows to higlight a name / Hold down <kbd>Shift</kbd>{' '}
          to move three names at a time / press <kbd>Enter</kbd> to select.
        </p>
        <KeyboardList items={items} onSelect={this.setItem} />
        <p className="footer">
          This is a demo built with{' '}
          <a href="https://github.com/soska/react-keyboardist">
            React Keyboardist
          </a>
        </p>
      </div>
    );
  }
}

render(<DemoApp />, document.getElementById('app'));
