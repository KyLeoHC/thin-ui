/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prop,
  Ref,
  Component
} from 'vue-property-decorator';
import { VNode } from 'vue';
import {
  ThinUIComponent,
  createGetComponentName
} from '../component';
import {
  isNumber,
  debounce
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

function fixCSSUnit(value: string | number): string {
  if (!value) return '';
  return isNumber(value) ? `${value}px` : value;
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
  /** browser scrollbar height */
  private scrollbarHeight = 15;
  /** scroll to the extreme left flag */
  private isScrollLeft = false;
  /** scroll to the extreme right flag */
  private isScrollRight = false;
  private hScrollDebounce = debounce();
  private vScrollDebounce = debounce(500);
  @Ref('independentTableHead')
  private readonly independentHeadRef!: HTMLElement;
  @Ref('tableBody')
  private readonly tableBodyRef!: HTMLElement;

  get isEmptyData(): boolean {
    return !this.data || !this.data.length;
  }

  get cssScroll(): { x: string; y: string } {
    return {
      x: fixCSSUnit(this.scroll.x),
      y: fixCSSUnit(this.scroll.y)
    };
  }

  get useIndependentHeader(): boolean {
    return !!this.cssScroll.y && !this.isEmptyData;
  }

  /**
   * vue 'mounted' hook
   */
  public mounted(): void {
    this.$nextTick((): void => {
      this.initScrollbarHeight();
    });
  }

  /**
   * get scrollbar height dynamically
   */
  public initScrollbarHeight(): void {
    this.scrollbarHeight = this.independentHeadRef
      ? (this.independentHeadRef.offsetHeight - this.independentHeadRef.clientHeight)
      : 0;
    if (!this.scrollbarHeight && this.tableBodyRef) {
      this.scrollbarHeight = this.tableBodyRef.offsetHeight - this.tableBodyRef.clientHeight;
    }
  }

  public resetScroll(): void {
    this.$nextTick((): void => {
      if (this.independentHeadRef) {
        this.independentHeadRef.scrollLeft = 0;
      }
      if (this.tableBodyRef) {
        this.tableBodyRef.scrollLeft = 0;
      }
      // if (this.tableScrollFixed) {
      //   tableScrollFixed.scrollLeft = 0;
      // }
    });
  }

  /**
   * sync the Horizontal scrolling of independent head and main body;
   * @param scrollLeft
   */
  public syncHorizontalScroll(scrollLeft: number): void {
    const {
      independentHeadRef,
      tableBodyRef,
      hScrollDebounce
    } = this;
    tableBodyRef.scrollLeft = scrollLeft;
    if (independentHeadRef) {
      independentHeadRef.scrollLeft = scrollLeft;
    }
    // if ($refs.tableScrollFixed) {
    //   const tableScrollFixed = $refs.tableScrollFixed as HTMLElement;
    //   tableScrollFixed.scrollLeft = scrollLeft;
    // }
    hScrollDebounce((): void => {
      // to the extreme left
      this.isScrollLeft = scrollLeft === 0;
      // to the extreme right
      this.isScrollRight = (scrollLeft + tableBodyRef.clientWidth) >= tableBodyRef.scrollWidth;
    });
  }

  public handleHeadScroll(): void {
    this.syncHorizontalScroll(this.independentHeadRef.scrollLeft);
  }

  public handleBodyScroll(): void {
    this.syncHorizontalScroll(this.tableBodyRef.scrollLeft);
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

  public renderIndependentHeader(
    colGroupVNode: VNode,
    headVNode: VNode,
    minWidth: string
  ): VNode | null {
    return this.useIndependentHeader ? (
      <div
        {...{
          class: [getComponentName('head-wrapper')]
        }}
      >
        <div
          {...{
            class: [getComponentName('head')],
            style: {
              'margin-bottom': `-${this.scrollbarHeight}px`
            },
            on: {
              scroll: this.handleHeadScroll
            },
            ref: 'independentTableHead'
          }}
        >
          <table
            {...{
              style: {
                'min-width': minWidth
              }
            }}
          >
            {colGroupVNode}
            {headVNode}
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

  /**
   * vue 'render' function
   */
  public render(): VNode {
    const {
      isScrollLeft,
      isScrollRight,
      cssScroll,
      minTableWidth,
      useIndependentHeader,
      border,
      handleBodyScroll,
      renderIndependentHeader,
      renderColgroup,
      renderHeader,
      renderBody
    } = this;
    const colGroupVNode = renderColgroup();
    const headVNode = renderHeader();
    const minWidth = cssScroll.x ? cssScroll.x : minTableWidth;
    return (
      <div
        {...{
          class: [
            componentName,
            border ? getComponentName('-border') : '',
            useIndependentHeader ? getComponentName('-independent-head') : '',
            cssScroll.x ? getComponentName('-scroll-x') : '',
            cssScroll.y ? getComponentName('-scroll-y') : '',
            isScrollLeft ? getComponentName('-position-left') : '',
            isScrollRight ? getComponentName('-position-right') : ''
          ]
        }}
      >
        <div
          {...{
            class: [getComponentName('content')]
          }}
        >
          <div
            {...{
              class: [getComponentName('main')]
            }}
          >
            {renderIndependentHeader(colGroupVNode, headVNode, minWidth)}
            <div
              {...{
                class: [getComponentName('body')],
                style: {
                  'max-height': cssScroll.y,
                  overflow: (cssScroll.x && cssScroll.y) ? 'scroll' : '',
                  'overflow-x': cssScroll.x ? 'scroll' : '',
                  'overflow-y': cssScroll.y ? 'scroll' : ''
                },
                on: {
                  scroll: handleBodyScroll
                },
                ref: 'tableBody'
              }}
            >
              <table
                {...{
                  style: {
                    'min-width': minWidth
                  }
                }}
              >
                {colGroupVNode}
                {!useIndependentHeader && headVNode}
                {renderBody()}
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
