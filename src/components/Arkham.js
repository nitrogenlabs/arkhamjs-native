/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import React, {Component} from 'react';
import {NativeRouter, Switch} from 'react-router-native';
import PropTypes from 'prop-types';
import Flux from '../Flux';
import ArkhamConstants from '../constants/ArkhamConstants';

/**
 * Arkham
 * @type {Component}
 */
export default class Arkham extends Component {
  static propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    config: PropTypes.object,
    routes: PropTypes.array,
    stores: PropTypes.array
  };

  static defaultProps = {
    config: {},
    routes: [],
    stores: []
  };

  static childContextTypes = {
    config: PropTypes.object
  };

  constructor(props) {
    super(props);

    // Methods
    this.onInit = this.onInit.bind(this);
    this.onUpdateView = this.onUpdateView.bind(this);

    // Initial state
    this.state = {
      init: false
    };

    // Initialize Flux with custom configuration
    this._config = props.config;
    Flux.config(this._config);
  }

  componentWillMount() {
    // Add listeners
    Flux.onInit(this.onInit);

    // Stores
    const {stores} = this.props;

    // Register stores
    if(stores.length) {
      Flux.registerStore(this.props.stores);
    }
  }

  componentWillUnmount() {
    // Remove listeners
    Flux.offInit(this.onInit);
  }

  getChildContext() {
    return {
      config: this._config
    };
  }

  onInit() {
    // Set state
    this.setState({init: true});
  }

  onUpdateView(message, callback) {
    // Dispatch event to indicate view has changed
    Flux.dispatch(ArkhamConstants.UPDATE_VIEW);

    // Check custom user confirmation
    if(this.props.config.getUserConfirmation) {
      return this.props.config.getUserConfirmation(message, callback);
    } else {
      return callback(true);
    }
  }

  render() {
    if(this.state.init) {
      return (
        <NativeRouter>
          <Switch>
            {this.props.children}
          </Switch>
        </NativeRouter>
      );
    }

    return null;
  }
};
