import fs from 'node:fs';
import path from 'node:path';
import { Compiler, CompilerOptions } from 'inkjs/full';
import { PosixFileHandler } from 'inkjs/compiler/FileHandler/PosixFileHandler';
import { lintInk } from './lintInk';

export interface CompileResult {
  json: string;
  errors: string[];
  warnings: string[];
  files: string[];
}

const ERROR_TYPE_ERROR = 2;

export function compileInk(storyDir: string): CompileResult {
  const files = fs
    .readdirSync(storyDir)
    .filter((f) => f.endsWith('.ink'))
    .map((f) => path.join(storyDir, f));

  const errors: string[] = [];
  const warnings: string[] = [];

  for (const file of files) {
    errors.push(...lintInk(fs.readFileSync(file, 'utf8'), path.basename(file)));
  }

  const source = fs.readFileSync(path.join(storyDir, 'main.ink'), 'utf8').replace(/^﻿/, '');
  const options = new CompilerOptions(
    null,
    [],
    false,
    (message: string, type: number) => (type === ERROR_TYPE_ERROR ? errors : warnings).push(message),
    new PosixFileHandler(storyDir + path.sep),
  );

  let json = '';
  try {
    const compiled = new Compiler(source, options).Compile();
    json = compiled.ToJson() ?? '';
  } catch (error) {
    if (errors.length === 0) errors.push(String(error));
  }

  return { json: errors.length > 0 ? '' : json, errors, warnings, files };
}
