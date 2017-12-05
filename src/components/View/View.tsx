/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import {History, Location} from 'history';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {ArkhamConstants} from '../../constants/ArkhamConstants';
import {Flux} from '../../Flux/Flux';

export interface MatchProps {
  readonly params?: object;
  readonly isExact?: boolean;
  readonly path?: string;
  readonly url?: string;
}

export interface NavigationParams {
  readonly url: string;
  readonly params?: object;
}

export interface ViewProps {
  readonly history?: History;
  readonly location?: Location;
  readonly match?: MatchProps;
}

/**
 * View
 * @type {Component}
 */
export class View extends React.Component<ViewProps, object> {
  static propTypes: object = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };
  
  static contextTypes: object = {
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

  componentWillMount(): void {
    Flux.on(ArkhamConstants.GOTO, this.onGoto);
    Flux.on(ArkhamConstants.GO_BACK, this.onGoBack);
    Flux.on(ArkhamConstants.GO_REPLACE, this.onGoReplace);
    this.viewWillMount();
  }

  componentDidMount(): void {
    this.viewDidMount();
  }

  componentWillUnmount(): void {
    Flux.off(ArkhamConstants.GOTO, this.onGoto);
    Flux.off(ArkhamConstants.GO_BACK, this.onGoBack);
    Flux.off(ArkhamConstants.GO_REPLACE, this.onGoReplace);
    this.viewWillUnmount();
  }

  viewWillMount(): void {
    // Placeholder for view will mount
  }

  viewDidMount(): void {
    // Placeholder for view did mount
  }

  viewWillUnmount(): void {
    // Placeholder for view unmount
  }

  getNavigationParams(data: NavigationParams): MatchProps {
    const {params, url = '/'} = data;
    return {params, url};
  }

  goto(url: string = '/', params: object = {}): void {
    this.props.history.push(url, {params});
  }

  onGoto(data: NavigationParams): void {
    const {params, url} = this.getNavigationParams(data);
    this.goto(url, params);
  }

  onGoBack(): void {
    this.props.history.goBack();
  }

  onGoReplace(data: NavigationParams): void {
    const {params, url}: MatchProps = this.getNavigationParams(data);
    this.props.history.replace(url, {params});
  }
  
  render(): JSX.Element {
    return null;
  }
}
