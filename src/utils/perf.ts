/**
 * 防抖优化函数
 * @param delay
 */
export function debounce(delay = 100): Function {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (fn: Function): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout((): void => {
      fn && fn();
    }, delay);
  };
}

/**
 * 节流优化函数
 * @param min 最小移动像素点
 */
export function throttle(min = 5): (currentOffset: number, fn: Function, immediate: boolean) => void {
  let prevOffset = 0;
  return function (currentOffset = 0, fn: Function, immediate = false): void {
    if (Math.abs(currentOffset - prevOffset) > min || immediate) {
      fn();
      prevOffset = currentOffset;
    }
  };
}
