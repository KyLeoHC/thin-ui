/*
 * 封装一些常用的dom操作或者dom相关辅助函数
 * @author KyLeo
 */
import {
  isFunction
} from './base';

export let isPassiveSupport = false;
try {
  const opts = {};
  Object.defineProperty(opts, 'passive', {
    get(): void {
      isPassiveSupport = true;
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  window.addEventListener('test-passive', function (): void {
  }, opts);
} catch (e) {
}

type BindEventTarget = Element | Document | Window;

interface HandlerMap {
  [key: string]: EventListenerOrEventListenerObject[];
}

interface EventMap {
  [key: string]: HandlerMap;
}

interface EventWrapper {
  __event?: EventMap;
  __eventProcessor?: EventListener;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Element extends EventWrapper {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Document extends EventWrapper {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Window extends EventWrapper {
  }
}

/**
 * 事件分发代理函数
 */
function processEvent(el: BindEventTarget, evt: Event): void {
  if (!el.__event) return;
  const namespaceObj = el.__event[evt.type];
  Object.keys(namespaceObj)
    .forEach((key): void => {
      namespaceObj[key].forEach((handler): void => {
        if (isFunction(handler)) {
          handler.call(el, evt);
        } else {
          handler.handleEvent.call(el, evt);
        }
      });
    });
}

/**
 * 解析事件名
 * @param event
 */
function parseEvent(event = ''): string[] {
  const [eventName, namespace = 'default'] = event.split('.');
  return [eventName, namespace];
}

/**
 * 绑定事件，支持命名空间绑定，比如 'click.show'(注意，不支持多级命名空间)
 * 提倡绑定事件的时候指定命名空间，也方便于移除事件绑定
 * @param el
 * @param event 比如'click.show'的形式
 * @param handler
 */
export function on(
  el: BindEventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (!el || !event || !handler) return;
  const [eventName, namespace] = parseEvent(event);
  el.__event = el.__event || {};
  el.__eventProcessor = el.__eventProcessor || ((event): void => {
    processEvent(el, event);
  });
  if (!el.__event[eventName]) {
    el.__event[eventName] = {};
    el.addEventListener(eventName, el.__eventProcessor, isPassiveSupport ? { passive: true } : false);
  }
  el.__event[eventName][namespace] = el.__event[eventName][namespace] || [];
  el.__event[eventName][namespace].push(handler);
}

/**
 * 移除事件绑定
 * @param el
 * @param event 比如'click.show'的形式
 */
export function off(el: BindEventTarget, event: string): void {
  if (!el || !event || !el.__event || !el.__eventProcessor) return;
  const [eventName, namespace] = parseEvent(event);
  const namespaceObj = el.__event[eventName];
  namespaceObj && delete namespaceObj[namespace];
  if (!Object.keys(namespaceObj).length) {
    delete el.__event[eventName];
    el.removeEventListener(eventName, el.__eventProcessor, false);
  }
  if (!Object.keys(el.__event).length) {
    delete el.__event;
    delete el.__eventProcessor;
  }
}

/**
 * 绑定事件，执行一次之后就移除绑定
 * @param el
 * @param event
 * @param handler
 */
export function once(
  el: BindEventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  const listener = function (evt: Event): void {
    if (isFunction(handler)) {
      handler.call(el, evt);
    } else {
      handler.handleEvent.call(el, evt);
    }
    off(el, event);
  };
  on(el, event, listener);
}

export interface ElementPosition {
  top: number;
  left: number;
}

/**
 * 计算给定元素所在容器的位置(距离可视区域的top、left值)
 * @param element 需要计算的目标元素
 * @param container 元素所在容器，默认window
 */
export function computeElementPosition(
  element: HTMLElement,
  container: HTMLElement | Window = window
): ElementPosition {
  const position: ElementPosition = {
    top: 0,
    left: 0
  };
  if (!element) return position;
  const rect = element.getBoundingClientRect();
  if (container === window) {
    if (element.ownerDocument) {
      container = element.ownerDocument.documentElement;
      // 减去边框的宽度
      position.top = rect.top - container.clientTop;
      position.left = rect.left - container.clientLeft;
    }
  } else {
    container = container as HTMLElement;
    position.top = rect.top - container.getBoundingClientRect().top;
    position.left = rect.left - container.getBoundingClientRect().left;
  }
  return position;
}

/**
 * 计算给定元素距离容器页面顶部、最左边的位置
 * 如果是全局滚动(或者说滚动元素容器距离页面顶部距离为0)，并且初始滚动位置是0
 * 那么这个函数和computeElementPosition的计算结果是一样的
 * @param element 需要计算的目标元素
 */
export function computeElementPagePosition(
  element: HTMLElement
): ElementPosition {
  const position: ElementPosition = {
    top: 0,
    left: 0
  };
  if (!element) return position;
  do {
    position.top += element.offsetTop;
    position.left += element.offsetLeft;
    element = element.offsetParent as HTMLElement;
  } while (element);
  return position;
}
