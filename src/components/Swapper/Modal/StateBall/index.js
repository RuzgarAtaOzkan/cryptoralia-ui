// MODULES
import { useState, useEffect, Component } from 'react';
import cn from 'classnames';

// COMPONENTS
import CloseIcon from '../../../Icons/Close';
import CheckIcon from '../../../Icons/Check';

// STYLES
import styles from './StateBall.module.scss';

class StateBall extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  displaytitle() {
    if (this.props.data.state === this.props.index && this.props.data.err) {
      return (
        <div className={cn(styles['con-title-closeicon'], 'flx-ctr-ctr')}>
          <CloseIcon />
        </div>
      );
    }

    if (this.props.data.state > this.props.index) {
      return (
        <div className={cn(styles['con-title-checkicon'], 'flx-ctr-ctr')}>
          <CheckIcon />
        </div>
      );
    }

    return this.props.index;
  }

  render() {
    return (
      <div className={cn(styles['con'], this.props.data.state === this.props.index && !this.props.data.err ? styles['conloading'] : null, this.props.data.state === this.props.index && this.props.data.err ? styles['conerror'] : null, this.props.data.state > this.props.index ? styles['consuccess'] : null)}>
        <div className={cn(styles['con-border'], this.props.data.state === this.props.index && !this.props.data.err ? styles['con-borderloading'] : null, this.props.data.state === this.props.index && this.props.data.err ? styles['con-bordererror'] : null, this.props.data.state > this.props.index ? styles['con-bordersuccess'] : null)} />

        <div className={cn(styles['con-title'])}>{this.displaytitle()}</div>
      </div>
    );
  }
}

export default StateBall;
