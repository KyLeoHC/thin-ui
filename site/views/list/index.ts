import { Vue, Component } from 'vue-property-decorator';
import {
  Column
} from '@/table/table';

interface User {
  id: number;
  name: string;
  birthday: string;
  sex: number;
}

const data: User[] = [];
for (let i = 0; i < 10; i++) {
  data.push({
    id: i,
    name: `James-${i}`,
    birthday: `2000-10-10 ${i}`,
    sex: Math.random() > 0.5 ? 1 : 0
  });
}

@Component
export default class List extends Vue {
  private columns: Column[] = [{
    prop: 'id',
    title: '标识符',
    width: 100
  }, {
    prop: 'name',
    title: '姓名',
    width: 200,
    headSlot: 'nameHead'
  }, {
    prop: 'birthday',
    title: '出生日期',
    width: 160
  }, {
    prop: 'sex',
    title: '性别'
  }];
  private data = data;
};
