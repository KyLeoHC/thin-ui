/*
 * get all components
 */
const fs = require('fs');
const path = require('path');

const excludes = [
  '.DS_Store',
  'index.ts',
  'component.ts',
  'style',
  'utils'
];

function getComponents() {
  const dirs = fs.readdirSync(path.resolve(__dirname, '../src'));
  return dirs.filter(dirName => excludes.indexOf(dirName) === -1);
}

module.exports = getComponents;
