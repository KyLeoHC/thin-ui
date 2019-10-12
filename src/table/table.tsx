/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prop,
  Component
} from 'vue-property-decorator';
import { VNode } from 'vue';
import {
  ThinUIComponent,
  createGetComponentName
} from '../component';
import {
  isNumber
} from '../utils';

const getComponentName = createGetComponentName('table');
const componentName = getComponentName();

export interface ScrollOption {
  x: number | string;
  y: number | string;
}

export interface RenderResult {
  rowSpan?: number;
  colSpan?: number;
}

export interface Column {
  prop?: number | string;
  title?: string;
  fixed?: 'left' | 'right';
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  headSlot?: string;

  customRender?(row: any, index?: number): RenderResult;
}

function getColumnWidth(column: Column): string {
  const value = column.width || '';
  return isNumber(value) ? `${value}px` : value;
}

function getColumnAlign(column: Column): string {
  return column.align || 'center';
}

@Component
export default class ThinTable extends ThinUIComponent {
  @Prop({
    type: Boolean,
    default: false
  })
  private readonly border!: boolean;
  @Prop({
    type: Object,
    default(): ScrollOption {
      return { x: '', y: '' };
    }
  })
  private readonly scroll!: ScrollOption;
  @Prop({
    type: Array,
    default(): [] {
      return [];
    }
  })
  private readonly columns!: Column[];
  @Prop({
    type: Array,
    default(): [] {
      return [];
    }
  })
  private readonly data!: { [key: string]: any }[];
  private minTableWidth = '700px';
  private isScroll = false;
  private useIndependentHeader = true;

  public renderFixColumn(): VNode | null {
    return this.isScroll ? (
      <div>fix column</div>
    ) : null;
  }

  public renderColgroup(): VNode {
    const colVNodes = this.columns.map((column): VNode => {
      return (
        <col
          {...{
            style: {
              width: getColumnWidth(column)
            }
          }}
        >
        </col>
      );
    });
    return (
      <colgroup>{colVNodes}</colgroup>
    );
  }

  public renderHeader(): VNode {
    const thVNodes = this.columns.map((column): VNode => {
      const slot = this.$scopedSlots[column.headSlot || ''];
      const slotData = {
        value: column.title || '',
        column
      };
      return (
        <th
          {...{
            style: {
              width: getColumnWidth(column),
              'text-align': getColumnAlign(column)
            }
          }}
        >
          {slot ? slot(slotData) : slotData.value}
        </th>
      );
    });
    return (
      <thead
        {...{
          class: [getComponentName('thead')]
        }}
      >
        <tr>{thVNodes}</tr>
      </thead>
    );
  }

  public renderIndependentHeader(colGroupVNode?: VNode, headVNode?: VNode): VNode | null {
    return this.useIndependentHeader ? (
      <div
        {...{
          class: [getComponentName('head-wrapper')]
        }}
      >
        <div
          {...{
            class: [getComponentName('head')]
          }}
        >
          <table
            {...{
              style: {
                'min-width': this.minTableWidth
              }
            }}
          >
            {colGroupVNode || this.renderColgroup()}
            {headVNode || this.renderHeader()}
          </table>
        </div>
      </div>
    ) : null;
  }

  public renderBody(): VNode {
    const trVNodes = this.data.map((item): VNode => {
      const tdVNodes = this.columns.map((column): VNode => {
        const slot = this.$scopedSlots[column.prop || ''];
        const slotData = {
          value: column.prop ? item[column.prop] : '',
          row: item,
          column
        };
        return (
          <td
            {...{
              style: {
                width: getColumnWidth(column),
                'text-align': getColumnAlign(column)
              }
            }}
          >
            {slot ? slot(slotData) : slotData.value}
          </td>
        );
      });
      return (
        <tr>{tdVNodes}</tr>
      );
    });
    return (
      <tbody
        {...{
          class: [getComponentName('tbody')]
        }}
      >
        {trVNodes}
      </tbody>
    );
  }

  public render(): VNode {
    const colGroupVNode = this.renderColgroup();
    const headVNode = this.renderHeader();
    return (
      <div
        {...{
          class: [
            componentName,
            this.border ? getComponentName('-border') : '',
            this.useIndependentHeader ? getComponentName('-independent-head') : ''
          ]
        }}
      >
        <div
          {...{
            class: [getComponentName('content'), getComponentName('scroll')]
          }}
        >
          <div
            {...{
              class: [getComponentName('main')]
            }}
          >
            {this.renderIndependentHeader(colGroupVNode, headVNode)}
            <div
              {...{
                class: [getComponentName('body')]
              }}
            >
              <table
                {...{
                  style: {
                    'min-width': this.minTableWidth
                  }
                }}
              >
                {colGroupVNode}
                {!this.useIndependentHeader && headVNode}
                {this.renderBody()}
              </table>
            </div>
          </div>
          {this.renderFixColumn()}
        </div>
      </div>
    );
  }
}
