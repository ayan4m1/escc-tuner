import Papa from 'papaparse';
import winston from 'winston';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const { Container, format, transports } = winston;
const { combine, label, prettyPrint, printf } = format;

const loggers = {};
const container = new Container();

const createLogger = (category, categoryLabel) => {
  let formatter = (data) => `[${data.level}][${data.label}] ${data.message}`;
  const formatters = [label({ label: categoryLabel })];

  formatters.push(prettyPrint(), printf(formatter));
  container.add(category, {
    transports: [
      new transports.Console({
        level: 'info',
        format: combine.apply(null, formatters)
      })
    ]
  });

  return container.get(category);
};

export const getLogger = (category, categoryLabel = category) => {
  if (!loggers[category]) {
    loggers[category] = createLogger(category, categoryLabel);
  }

  return loggers[category];
};

export const readText = (path) => readFile(resolve(path), 'utf-8');

export const parseCsv = async (path, header = false) => {
  if (!existsSync(path)) {
    throw new Error(`${path} does not exist!`);
  }

  const text = await readText(path);
  const { data } = Papa.parse(text, {
    header,
    comments: '#',
    skipEmptyLines: true
  });

  return data;
};
