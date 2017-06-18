/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import Flux from '..//Flux';
import ArkhamConstants from '../constants/ArkhamConstants';

/**
 * ArkhamActions
 * @type {object}
 */
const ArkhamActions = {
  goto: (url, params) => {
    return Flux.dispatch({type: ArkhamConstants.GOTO, url, params});
  },

  goBack: () => {
    return Flux.dispatch({type: ArkhamConstants.GO_BACK});
  },

  goReplace: (url, params) => {
    return Flux.dispatch({type: ArkhamConstants.GO_REPLACE, url, params});
  }
};

export default ArkhamActions;
