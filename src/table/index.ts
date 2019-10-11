import ThinTable from './table';

/* istanbul ignore next */
ThinTable.install = function (Vue): void {
  console.log(ThinTable.name);
  Vue.component(ThinTable.name, ThinTable);
};

export default ThinTable;
