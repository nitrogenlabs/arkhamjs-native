/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */
import {ArkhamConstants} from '../../constants/ArkhamConstants';
import {Flux, FluxAction} from '../../Flux/Flux';

/**
 * ArkhamActions
 *
 */
export class ArkhamActions {
  static goBack(): Promise<FluxAction> {
    return Flux.dispatch({type: ArkhamConstants.GO_BACK});
  }
  
  static goReplace(url: string, params): Promise<FluxAction> {
    return Flux.dispatch({type: ArkhamConstants.GO_REPLACE, url, params});
  }
  
  static goto(url: string, params): Promise<FluxAction> {
    return Flux.dispatch({type: ArkhamConstants.GOTO, url, params});
  }
}
