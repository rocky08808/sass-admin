import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const featuresDirectory = path.resolve(process.cwd(), 'src', 'features');
const schemasDirectory = path.resolve(process.cwd(), 'src', 'schemas');
const featureDirectories = readdirSync(featuresDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

function getFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? getFiles(entryPath) : [entryPath];
  });
}

describe('feature architecture', () => {
  it.each(featureDirectories)('%s has a schema and at least one TSX test', (featureName) => {
    const featureDirectory = path.join(featuresDirectory, featureName);
    const featureFiles = getFiles(featureDirectory);

    expect(existsSync(path.join(schemasDirectory, `${featureName}.schema.ts`))).toBe(true);
    expect(featureFiles.some((file) => file.endsWith('.test.tsx'))).toBe(true);
  });

  it('does not import Table or Drawer directly from antd', () => {
    const featureFiles = getFiles(featuresDirectory);
    const prohibitedImports: string[] = [];

    for (const file of featureFiles) {
      const source = readFileSync(file, 'utf8');
      const imports = source.matchAll(/\bimport\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"]antd['"]/gs);

      for (const match of imports) {
        const importedNames = match[1].split(',').map(
          (specifier) =>
            specifier
              .trim()
              .replace(/^type\s+/, '')
              .split(/\s+as\s+/)[0],
        );

        if (importedNames.some((name) => name === 'Table' || name === 'Drawer')) {
          prohibitedImports.push(path.relative(process.cwd(), file));
        }
      }
    }

    expect(prohibitedImports).toEqual([]);
  });

  it('does not call fetch outside api.ts files', () => {
    const violations = getFiles(featuresDirectory)
      .filter((file) => path.basename(file) !== 'api.ts')
      .filter((file) => /\bfetch\s*\(/.test(readFileSync(file, 'utf8')))
      .map((file) => path.relative(process.cwd(), file));

    expect(violations).toEqual([]);
  });
});
