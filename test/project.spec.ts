import { tsquery, files } from '../src/index';

describe('tsquery:', () => {
  describe('tsquery.project:', () => {
    it('should process a tsconfig.json file', () => {
      const files = tsquery.project('./tsconfig.json');

      expect(files.length).toEqual(225);
    });

    it('should find a tsconfig.json file in a directory', () => {
      const files = tsquery.project('./');

      expect(files.length).toEqual(225);
    });

    it(`should handle when a path doesn't exist`, () => {
      const files = tsquery.project('./some-path');

      expect(files.length).toEqual(0);
    });
  });

  describe('tsquery.files', () => {
    it('should get the file paths from a tsconfig.json file', () => {
      const filePaths = tsquery.projectFiles('./tsconfig.json');

      expect(filePaths.length).toEqual(60);
    });

    it(`should handle when a path doesn't exist`, () => {
      const result = files('./some-path');

      expect(result.length).toEqual(0);
    });
  });
});
