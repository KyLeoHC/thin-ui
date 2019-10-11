import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Detail extends Vue {
  public linkText = '跳转到demo2';

  public linkToDemo2(): void {
    console.log('11');
  }
};
