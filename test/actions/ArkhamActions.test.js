import Flux from '../../src/Flux';
import ArkhamActions from '../../src/actions/ArkhamActions';
import ArkhamConstants from '../../src/constants/ArkhamConstants';

describe('ArkhamActions', () => {
  beforeAll(() => {
    Flux._useImmutable = false;
  });

  afterAll(() => {
    Flux._useImmutable = true;
  });

  describe('#goto', () => {
    it('should push path into history', async() => {
      const url = '/test';
      const params = {item: 'test'};
      const action = await ArkhamActions.goto(url, params);
      expect(action.type).toBe(ArkhamConstants.GOTO);
      expect(action.url).toBe(url);
      expect(action.params.item).toBe(params.item);
    });
  });

  describe('#goBack', () => {
    it('should dispatch event ', async() => {
      const url = '/test';
      const action = await ArkhamActions.goBack(url);
      expect(action.type).toBe(ArkhamConstants.GO_BACK);
    });
  });

  describe('#goReplace', () => {
    it('should dispatch event to go back', async() => {
      const url = '/test';
      const params = {item: 'test'};
      const action = await ArkhamActions.goReplace(url, params);
      expect(action.type).toBe(ArkhamConstants.GO_REPLACE);
      expect(action.url).toBe(url);
      expect(action.params.item).toBe(params.item);
    });
  });
});
