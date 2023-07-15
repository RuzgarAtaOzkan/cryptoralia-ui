// MODULES
import { useState, useEffect, Component } from 'react';
import cn from 'classnames';

// COMPONENTS
import LoadingBalls from '../../Icons/LoadingBalls';
import Anchor from '../../Anchor';
import Input from '../../Input';
import Button from '../../Button';
import StateBall from './StateBall';

// UTILS
import getTxnStatus from '../../../utils/getTxnStatus';
import removeSpaces from '../../../utils/removeSpaces';

// STYLES
import styles from './Modal.module.scss';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      repeat: 0,
      timer: 0,
      slippage: {
        value: '',
        custom: false,
        selindex: 0,
      },
    };

    this.check_txn_status = this.check_txn_status.bind(this);
  }

  async check_txn_status(hash) {
    try {
      const res = await getTxnStatus(hash);

      if (!res) {
        return;
      }

      if (res.data.result.status === '') {
        return;
      }

      if (res.data.result.status === '0') {
        this.props.setdata({
          ...this.props.data,
          err: 'Transaction has failed',
          title: 'Transcation fail!',
          desc: 'Transaction has been failed due to some error.',
        });

        clearInterval(this.state.timer);

        return;
      }

      this.props.setdata({
        ...this.props.data,
        state: 3,
        title: 'Transaction complete!',
        desc: 'Congratulation! Transaction has been successfully completed.',
        err: '',
      });

      clearInterval(this.state.timer);
    } catch (err) {}
  }

  componentDidUpdate() {
    if (this.props.data && this.props.data.state === 2 && !this.state.repeat) {
      this.check_txn_status(this.props.data.txnhash);

      const id = setInterval(() => {
        if (this.state.repeat > 20) {
          this.props.setdata({
            ...this.props.data,
            err: 'Transaction has failed',
            title: 'Transcation fail!',
            desc: 'Transaction has been failed due to some error.',
          });

          clearInterval(this.state.timer);
          return;
        }

        this.check_txn_status(this.props.data.txnhash);

        this.setState({
          ...this.state,
          repeat: this.state.repeat + 1,
        });
      }, 4000);

      this.setState({
        ...this.state,
        timer: id,
        repeat: 1,
      });
    }
  }

  render() {
    return this.props.data.active ? (
      <div className={cn(styles['container'])}>
        <div className={cn(styles['bg'])}></div>
        {this.props.data.type === 'txn' ? (
          <div className={cn(styles['txnmodal'])}>
            <div className={cn(styles['txnmodal-states'])}>
              <StateBall data={this.props.data} index={1} />
              {this.props.data.state <= 1 && !this.props.data.err ? <LoadingBalls /> : <div className={cn(styles['stick'])}></div>}
              <StateBall data={this.props.data} index={2} />
            </div>

            <div className={cn(styles['txnmodal-title'])}>{this.props.data.title}</div>
            <div className={cn(styles['txnmodal-desc'])} dangerouslySetInnerHTML={{ __html: this.props.data.desc }}></div>

            {this.props.data.err ? (
              <div className={cn(styles['txnmodal-err'])}>
                Error: <span>{this.props.data.err.toString()}</span>
              </div>
            ) : null}

            {this.props.data.txnhash ? (
              <div className={cn(styles['txnmodal-link'])}>
                <Anchor target="_blank" rel="noreferrer" href={'https://bscscan.com/tx/' + this.props.data.txnhash}>
                  View on BscScan.com
                </Anchor>
              </div>
            ) : null}

            {this.props.data.state !== 1 ? (
              <div className={cn(styles['txnmodal-close'], 'flx-ctr-ctr')}>
                <Button
                  onClick={() => {
                    this.props.setdata({
                      ...this.props.data,
                      active: false,
                    });
                  }}
                  title="Close"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {this.props.data.type === 'slippage' ? (
          <div className={cn(styles['slippagemodal'])}>
            <div className={cn(styles['slippagemodal-top'], 'flx-btw-ctr')}>
              <div
                onClick={() => {
                  this.setState({
                    ...this.state,
                    slippage: {
                      ...this.state.slippage,
                      value: '1',
                      custom: false,
                      selindex: 0,
                    },
                  });
                }}
                className={cn(styles['slippagemodal-top-value'], this.state.slippage.selindex === 0 ? styles['slippagemodal-top-valueselected'] : null)}
              >
                1%
              </div>
              <div
                onClick={() => {
                  this.setState({
                    ...this.state,
                    slippage: {
                      ...this.state.slippage,
                      value: '3',
                      custom: false,
                      selindex: 1,
                    },
                  });
                }}
                className={cn(styles['slippagemodal-top-value'], this.state.slippage.selindex === 1 ? styles['slippagemodal-top-valueselected'] : null)}
              >
                3%
              </div>
              <div
                onClick={() => {
                  this.setState({
                    ...this.state,
                    slippage: {
                      ...this.state.slippage,
                      value: '5',
                      custom: false,
                      selindex: 2,
                    },
                  });
                }}
                className={cn(styles['slippagemodal-top-value'], this.state.slippage.selindex === 2 ? styles['slippagemodal-top-valueselected'] : null)}
              >
                5%
              </div>
              <div
                onClick={() => {
                  if (!this.state.slippage.custom) {
                    this.setState({
                      ...this.state,
                      slippage: {
                        ...this.state.slippage,
                        custom: !this.state.slippage.custom,
                        value: '',
                        selindex: 3,
                      },
                    });
                  }
                }}
                className={cn(styles['slippagemodal-top-value'])}
              >
                {this.state.slippage.custom ? (
                  <input
                    value={this.state.slippage.value}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (!removeSpaces(value)) {
                        this.setState({
                          ...this.state,
                          slippage: {
                            ...this.state.slippage,
                            value: '',
                          },
                        });

                        return;
                      }

                      if (Number(value) > 50) {
                        this.setState({
                          ...this.state,
                          slippage: {
                            ...this.state.slippage,
                            value: '50',
                            selindex: 3,
                          },
                        });

                        return;
                      }

                      this.setState({
                        ...this.state,
                        slippage: {
                          ...this.state.slippage,
                          value: value,
                          selindex: 3,
                        },
                      });
                    }}
                    type="number"
                    placeholder="Slippage..."
                  />
                ) : (
                  'Custom'
                )}
              </div>
            </div>

            <div className={cn(styles['slippagemodal-bottom'], 'flx-ctr-ctr')}>
              <Button
                title="Done"
                primary
                onClick={() => {
                  if (!removeSpaces(this.state.slippage.value)) {
                    this.props.setswapperconf({
                      ...this.props.swapperconf,
                      slippage: '0.01',
                    });

                    this.props.setdata({
                      ...this.props.data,
                      active: false,
                    });
                    return;
                  }

                  this.props.setswapperconf({
                    ...this.props.swapperconf,
                    slippage: (Number(this.state.slippage.value) / 100).toString(),
                  });

                  this.props.setdata({
                    ...this.props.data,
                    active: false,
                  });
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    ) : null;
  }
}

export default Modal;
