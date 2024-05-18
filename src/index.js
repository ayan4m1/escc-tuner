#!/usr/bin/env node

import { program } from 'commander';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';

try {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const commandDir = resolve(__dirname, 'commands');
  const packageJsonPath = resolve(__dirname, '..', 'package.json');
  const { bin, description, version } = JSON.parse(
    await readFile(packageJsonPath, 'utf-8')
  );
  const [name] = Object.keys(bin);

  program
    .name(name)
    .version(version)
    .description(description)
    .executableDir(commandDir)
    .command('tune', 'Start a tuning session', {
      executableFile: 'tune.js'
    })
    .parseAsync();
} catch (error) {
  console.error(error);
  process.exit(1);
}
