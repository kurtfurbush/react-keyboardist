import React from 'react';
import { render } from 'react-dom';
import Keyboardist, { KeyboardInput } from '../lib';
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

  reset = () => {
    this.setState({ selectedItem: 0 });
  };

  render() {
    return (
      <React.Fragment>
        <Keyboardist
          bindings={{
            Down: this.next,
            'Shift+Down': this.superNext,
            Up: this.prev,
            'Shift+Up': this.superPrev,
            Enter: this.submit,
            Escape: this.reset,
          }}
          monitor={true}
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

class Love extends React.Component {
  state = {
    loving: false,
    love: 0,
  };

  startLoving = () => {
    this.setState({ loving: true });
  };

  stopLoving = () => {
    this.setState({ loving: false });
  };

  love = () => {
    if (this.state.loving) {
      console.log('love is in the air');
      let love = this.state.love + 1;
      this.setState({ love });
    }
    this.timeout = window.setTimeout(this.love, 100);
  };

  componentDidMount() {
    this.love();
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render() {
    return (
      <React.Fragment>
        <Keyboardist
          bindings={{
            KeyL: this.startLoving,
          }}
        />
        <Keyboardist
          eventName={'keyup'}
          bindings={{
            KeyL: this.stopLoving,
          }}
        />
        <div className={this.state.loving ? 'love love--loving' : 'love'}>
          <span>❤️</span>
          <span>=</span>
          <span>{this.state.love}</span>
        </div>
      </React.Fragment>
    );
  }
}

const Modal = ({ show = false, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal">
      <Keyboardist
        bindings={{
          Escape: onClose,
        }}
      />
      <div className="modal__content">{children}</div>
    </div>
  );
};

class BPMMeter extends React.Component {
  state = {
    bpm: 140,
  };

  up = () => {
    const bpm = this.state.bpm + 1;
    if (bpm < 280) {
      this.setState({ bpm });
    }
  };

  down = () => {
    const bpm = this.state.bpm - 1;
    if (bpm > 90) {
      this.setState({ bpm });
    }
  };

  render() {
    return (
      <div className="bpm-meter">
        <label>
          <span>Chose a BPM</span>
          <KeyboardInput
            value={this.state.bpm}
            className={'bpm-meter__input'}
            onChange={() => {}}
            bindings={{
              UP: this.up,
              DOWN: this.down,
            }}
          />
          <span className="instructions">&larr; Use your keyboard arrows</span>
        </label>
      </div>
    );
  }
}

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
    // returning false means the event does not propagate,
    // so the table reset action won't be fired.
    return false;
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
        <BPMMeter />

        <div className="demo">
          <h1>Select your favorite keyboardist</h1>
          <p className="instructions">
            Use up and down arrows to higlight a name / Hold down{' '}
            <kbd>Shift</kbd> to move three names at a time / press{' '}
            <kbd>Enter</kbd> to select / press <kbd>Escape</kbd> to reset /
            press <kbd>L</kbd> to show love.
          </p>
          <Love />
          <KeyboardList items={items} onSelect={this.setItem} />
          <p className="footer">
            This is a demo built with{' '}
            <a href="https://github.com/soska/react-keyboardist">
              React Keyboardist
            </a>. Source code for this demo{' '}
            <a href="https://github.com/soska/react-keyboardist/blob/master/src/docs/index.jsx">
              is here
            </a>.
          </p>
        </div>
      </div>
    );
  }
}

render(<DemoApp />, document.getElementById('app'));
