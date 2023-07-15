// MODULES
import { useState, useEffect, useContext, Component } from 'react';
import cn from 'classnames';

// CONTEXT
import { useStore, Context } from '../../../context';

// STYLES
import styles from './LoadingBalls.module.scss';

class LoadingBalls extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = { index: 0, timer: 0 };
    this.update = this.update.bind(this);
  }

  update() {
    this.setState({
      ...this.state,
      index: this.state.index >= 2 ? 0 : this.state.index + 1,
    });
  }

  componentDidMount() {
    const id = setInterval(() => {
      this.update();
    }, 350);

    this.setState({
      ...this.state,
      timer: id,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    return (
      <div className={cn(styles['con'])}>
        <div className={cn(styles['ball'], this.state.index === 0 ? styles['ballactive'] : null)}></div>
        <div className={cn(styles['ball'], this.state.index === 1 ? styles['ballactive'] : null)}></div>
        <div className={cn(styles['ball'], this.state.index === 2 ? styles['ballactive'] : null)}></div>
      </div>
    );
  }
}

export default LoadingBalls;
