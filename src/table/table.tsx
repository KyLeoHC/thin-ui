import {
  Component
} from 'vue-property-decorator';
import { VNode } from 'vue';
import {
  ThinUIComponent,
  getComponentName
} from '../component';

@Component
export default class ThinTable extends ThinUIComponent {
  private text = 'hello';

  public render(): VNode {
    const componentName = getComponentName('table');
    return (
      <div
        {...{
          class: [`${componentName}`]
        }}
        onClick={this.onClick}
      >
        thin table jsx
        <div
          {...{
            on: {
              click: this.onClick2
            }
          }}
        >
          {this.text}
        </div>
      </div>
    );
  }

  public onClick(): void {
    console.log('---');
  }

  public onClick2(): void {
    console.log('---2');
  }
}
