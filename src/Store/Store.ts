/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

export class Store {
  state: object;
  name: string;
  
  /**
   * A Flux store interface
   *
   * @constructor
   * @this {Store}
   */
  constructor(name: string = 'store') {
    // Methods
    this.initialState = this.initialState.bind(this);
    this.onAction = this.onAction.bind(this);

    // Vars
    this.state = {};
    this.name = name.toLowerCase();
  }

  /**
   * Get the initial state.
   *
   * @return {Object} The initial state of the store.
   */
  initialState(): object {
    return {};
  }

  /**
   * Action listener. It should return an altered state depending on the event dispatched.
   *
   * @param {String} type Dispatched event.
   * @param {Object} data Data payload associated with the called action.
   * @param {object} state The current state.
   * @return {object} The final state of the store.
   */
  onAction(type: string, data, state): object {
    return state;
  }
}
