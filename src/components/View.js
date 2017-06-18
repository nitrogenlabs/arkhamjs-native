/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Flux from '../Flux';
import ArkhamConstants from '../constants/ArkhamConstants';

/**
 * View
 * @type {Component}
 */
export default class View extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };
  
  static contextTypes = {
    config: PropTypes.object
  };

  constructor(props) {
    super(props);

    // Methods
    this.getNavigationParams = this.getNavigationParams.bind(this);
    this.goto = this.goto.bind(this);
    this.onGoto = this.onGoto.bind(this);
    this.onGoBack = this.onGoBack.bind(this);
    this.onGoReplace = this.onGoReplace.bind(this);
  }

  componentWillMount() {
    Flux.on(ArkhamConstants.GOTO, this.onGoto);
    Flux.on(ArkhamConstants.GO_BACK, this.onGoBack);
    Flux.on(ArkhamConstants.GO_REPLACE, this.onGoReplace);
    this.viewWillMount();
  }

  componentDidMount() {
    this.viewDidMount();
  }

  componentWillUnmount() {
    Flux.off(ArkhamConstants.GOTO, this.onGoto);
    Flux.off(ArkhamConstants.GO_BACK, this.onGoBack);
    Flux.off(ArkhamConstants.GO_REPLACE, this.onGoReplace);
    this.viewWillUnmount();
  }

  viewWillMount() {
  }

  viewDidMount() {
  }

  viewWillUnmount() {
  }

  getNavigationParams(data) {
    if(!Immutable.Iterable.isIterable(data)) {
      data = data.toJS();
    }

    const url = data.url || '/';
    const params = data.params;

    return {params, url};
  }

  goto(url = '/', params) {
    this.props.history.push(url, {params});
  }

  onGoto(data) {
    const {params, url} = this.getNavigationParams(data);
    this.goto(url, params);
  }

  onGoBack() {
    this.props.history.goBack();
  }

  onGoReplace(data) {
    const {params, url} = this.getNavigationParams(data);
    this.props.history.replace(url, {params});
  }
  
  render() {
    return null;
  }
}
