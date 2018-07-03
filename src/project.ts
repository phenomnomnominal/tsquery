// Dependencies:
import * as fs from 'fs';
import * as path from 'path';
import { createCompilerHost, createProgram, ParseConfigHost, parseJsonConfigFileContent, readConfigFile, SourceFile, sys } from 'typescript';

export function project (configFilePath: string): Array<SourceFile> {
    const fullPath = findConfig(configFilePath);
    if (fullPath) {
        return getSourceFiles(fullPath);
    }
    return [];
}

function findConfig (configFilePath: string): string | null {
    try {
        const fullPath = path.resolve(process.cwd(), configFilePath);
        // throws if file does not exist:
        const stats = fs.statSync(fullPath);
        if (!stats.isDirectory()) {
            return fullPath;
        }
        const inDirectoryPath = path.join(fullPath, 'tsconfig.json');
        // throws if file does not exist:
        fs.accessSync(inDirectoryPath);
        return inDirectoryPath;
    } catch (e) {
        return null;
    }
}

function getSourceFiles (configFilePath: string): Array<SourceFile> {
    const config = readConfigFile(configFilePath, sys.readFile);

    const parseConfigHost: ParseConfigHost = {
        fileExists: fs.existsSync,
        readDirectory: sys.readDirectory,
        readFile: (file) => fs.readFileSync(file, 'utf8'),
        useCaseSensitiveFileNames: true
    };
    const parsed = parseJsonConfigFileContent(config.config, parseConfigHost, path.dirname(configFilePath), { noEmit: true });
    const host = createCompilerHost(parsed.options, true);
    const program = createProgram(parsed.fileNames, parsed.options, host);

    return Array.from(program.getSourceFiles());
}
