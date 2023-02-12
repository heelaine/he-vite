/* eslint-disable @typescript-eslint/no-unsafe-return */
// import { merge } from 'lodash-es';
import type { Component } from "vue";

/**
 * 注册并返回弹窗快捷方法
 * @param {*} popper
 * @returns
 */
export function registerDialog(popper, componentsCache) {
  return (popId: string | number, component: Component, options: Record<string | number | symbol, any>) => {
    componentsCache.add(popId, {
      component,
      // 默认定位
      // position: position(),
      ...bindDefaultEvents(popper, popId),
      ...options,
    });

    return {
      open(options?: Record<string | number | symbol, any>) {
        popper.add(popId, { component: popId, ...options });
      },
      close() {
        popper.remove(popId);
      },
      update(options?: Record<string | number | symbol, any>) {
        popper.update(popId, { component: popId, ...options });
      },
      replace(options?: Record<string | number | symbol, any>) {
        popper.replace(popId, { component: popId, ...options });
      },
      clearAll() {
        popper.clearAllPop();
      },
    };
  };
}

export const DEFAULT_POSITION = {
  top: 240,
  left: 0,
  right: 0,
};

// export function position(options = DEFAULT_POSITION) {
//   return merge({}, DEFAULT_POSITION, options);
// }

export function bindDefaultEvents(popper, popId: string | number) {
  return {
    "@headerMousedown": function () {
      popper.topIndex(popId);
    },
    "@close": function () {
      setTimeout(() => {
        popper.remove(popId);
      }, 300);
    },
  };
}

export function isEvent(propName) {
  const rule = /^@/i;
  return rule.test(propName);
}

// @click => click
export function eventNameTransition(name) {
  return name.replace("@", "");
}

// 拆分事件与属性
export function splitProps(cmpProps) {
  return Object.entries(cmpProps).reduce(
    (acc, [propName, propValue]) => {
      if (isEvent(propName)) {
        // 自定义事件
        acc.on[eventNameTransition(propName)] = propValue;
      } else {
        acc.props[propName] = propValue;
      }

      return acc;
    },
    { on: {}, props: {} },
  );
}

export function counter(initCount = 1000, step = 1) {
  let count = initCount;

  function add(customStep = step) {
    count += customStep || step;
  }

  function reduce(customStep) {
    count -= customStep || step;
  }

  function reset(customStep) {
    count = customStep || initCount;
  }

  function getCount() {
    return count;
  }

  return {
    add,
    reduce,
    reset,
    getCount,
  };
}
