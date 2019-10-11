// This file is auto generated by build/build-entry.js
import { VueConstructor } from 'vue';
import Table from './table';

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const version = '0.0.1';
const components = [
  Table
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
  Table
};

export default {
  install,
  version
};