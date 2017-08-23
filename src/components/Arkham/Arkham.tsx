/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {NativeRouter, Switch} from 'react-router-native';
import {ArkhamConstants} from '../../constants/ArkhamConstants';
import {Flux, FluxOptions} from '../../Flux/Flux';

export interface ArkhamProps {
  readonly children?: JSX.Element;
  readonly className?: string;
  readonly config?: FluxOptions;
  readonly routes?: string[];
  readonly stores?: any[];
}

export interface ArkhamState {
  init: boolean;
}

/**
 * Arkham
 * @type {Component}
 */
export class Arkham extends React.Component<ArkhamProps, ArkhamState> {
  private config: FluxOptions;
  
  static propTypes: object = {
    children: PropTypes.element,
    className: PropTypes.string,
    config: PropTypes.object,
    routes: PropTypes.array,
    stores: PropTypes.array
  };

  static defaultProps: object = {
    config: {},
    routes: [],
    stores: []
  };

  static childContextTypes: object = {
    config: PropTypes.object
  };

  constructor(props: ArkhamProps) {
    super(props);

    // Methods
    this.onInit = this.onInit.bind(this);
    this.onUpdateView = this.onUpdateView.bind(this);

    // Initial state
    this.state = {
      init: false
    };

    // Initialize Flux with custom configuration
    this.config = props.config;
    Flux.config(this.config);
  }

  componentWillMount(): void {
    // Add listeners
    Flux.onInit(this.onInit);
  
    // Register stores
    const {stores} = this.props;
    Flux.registerStores(stores);
  }

  componentWillUnmount(): void {
    // Remove listeners
    Flux.offInit(this.onInit);
  }

  getChildContext(): object {
    return {
      config: this.config
    };
  }

  onInit(): void {
    // Set state
    this.setState({init: true});
  }

  onUpdateView(): void {
    // Dispatch event to indicate view has changed
    Flux.dispatch({type: ArkhamConstants.UPDATE_VIEW});

    // Check custom user confirmation
    const {getUserConfirmation} = this.config;
    
    if(getUserConfirmation) {
      getUserConfirmation();
    }
  }

  render(): JSX.Element {
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
}
