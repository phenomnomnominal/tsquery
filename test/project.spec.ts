// Under test:
import { tsquery } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery.project:', () => {
    it('should process a tsconfig.json file', () => {
      const files = tsquery.project('./tsconfig.json');

      expect(files.length).toEqual(170);
    });

    it('should get the file paths from a tsconfig.json file', () => {
      const filePaths = tsquery.projectFiles('./tsconfig.json');

      expect(filePaths.length).toEqual(56);
    });

    it('should find a tsconfig.json file in a directory', () => {
      const files = tsquery.project('./');

      expect(files.length).toEqual(170);
    });

    it(`should handle when a path doesn't exist`, () => {
      const files = tsquery.project('./boop');

      expect(files.length).toEqual(0);
    });
  });
});
