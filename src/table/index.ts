import ThinTable from './table';

/* istanbul ignore next */
ThinTable.install = function (Vue): void {
  Vue.component(ThinTable.name, ThinTable);
};

export default ThinTable;
