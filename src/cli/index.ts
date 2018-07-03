// Dependencies:
import * as minimist from 'minimist';

import { tsquery } from '../index';

const args = minimist(process.argv.slice(2), {
    default: {
        config: 'tsconfig.json'
    }
});

tsquery.project(args.config).forEach(sourceFile => {
    const results = tsquery(sourceFile, args.selector);
    if (results.length) {
        // tslint:disable no-console
        console.log(`"${sourceFile.fileName}" has ${results.length} matches:`);
    }
});
