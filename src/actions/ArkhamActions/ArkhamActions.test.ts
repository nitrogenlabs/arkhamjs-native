/**
 * Copyright (c) 2017, Nitrogen Labs, Inc.
 * Copyrights licensed under the MIT License. See the accompanying LICENSE file for terms.
 */

import {ArkhamConstants} from '../../constants/ArkhamConstants';
import {FluxAction} from '../../Flux/Flux';
import {ArkhamActions} from './ArkhamActions';

describe('ArkhamActions', () => {
  describe('#goBack', () => {
    it('should dispatch event ', async(): Promise<any> => {
      const action: FluxAction = await ArkhamActions.goBack();
      expect(action.type).toBe(ArkhamConstants.GO_BACK);
    });
  });
  
  describe('#goReplace', () => {
    it('should dispatch event to go back', async(): Promise<any> => {
      const url: string = '/test';
      const params = {item: 'test'};
      const action: FluxAction = await ArkhamActions.goReplace(url, params);
      expect(action.type).toBe(ArkhamConstants.GO_REPLACE);
      expect(action.url).toBe(url);
      expect(action.params.item).toBe(params.item);
    });
  });

  describe('#goto', () => {
    it('should push path into history', async(): Promise<any> => {
      const url: string = '/test';
      const params = {item: 'test'};
      const action: FluxAction = await ArkhamActions.goto(url, params);
      expect(action.type).resolves.toBe(ArkhamConstants.GOTO);
      expect(action.url).toBe(url);
      expect(action.params.item).toBe(params.item);
    });
  });
});
