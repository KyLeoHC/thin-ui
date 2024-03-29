const fs = require('fs');
const path = require('path');
const upperCamelCase = require('uppercamelcase');
const components = require('./get-components')();
const packageJson = require('../package.json');

const version = process.env.VERSION || packageJson.version;
const tips = '// This file is auto generated by build/build-entry.js';

function buildEntry() {
  const importList = components.map(name => `import ${upperCamelCase(name)} from './${name}';`);
  const exportList = components.map(name => `${upperCamelCase(name)}`);
  // ts content
  const tsContent = `${tips}
import { VueConstructor } from 'vue';
${importList.join('\n')}

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const version = '${version}';
const components = [
  ${exportList.join(',\n')}
];
const install = (Vue: VueConstructor): void => {
  components.forEach(Component => {
    Vue.use(Component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  version,
  ${exportList.join(',\n  ')}
};

export default {
  install,
  version
};
`;
  // less content
  const lessContent = `${tips}
@import "var";
// ----------------------------------------------------------
// components
${components.map(name => `@import "../${name}/style/index";`)}
`;

  fs.writeFileSync(path.join(__dirname, '../src/index.ts'), tsContent);
  fs.writeFileSync(path.join(__dirname, '../src/style/index.less'), lessContent);
}

buildEntry();
