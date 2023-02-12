/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Component, ComponentPropsOptions } from "vue";
import { inject, provide, shallowRef, unref } from "vue";
import { merge } from "lodash-es";
import { counter, splitProps } from "./utils";

export * from "./utils";

export const DEFAULT_POP_SIGN = "DEFAULT_POP_SIGN";

// 全局层级累加器
export const counterStore = counter();

/**
 * 预先pop注册表
 * @summary
 * 便捷多处pop调用, 调用pop显示方法时，
 * 直接通过名称查询对应的组件预设
 * 将调用与事件配置解耦
 * @returns
 */
class ComponentsRegistry {
  componentsCache;
  constructor() {
    this.componentsCache = new Map([]);
  }

  has(componentName: string) {
    return this.componentsCache.has(componentName);
  }

  add(componentName: string, options) {
    this.componentsCache.set(componentName, options);
  }

  remove(componentName: string) {
    if (this.has(componentName)) {
      this.componentsCache.delete(componentName);
    }
  }

  select(componentName: string) {
    return this.componentsCache.get(componentName);
  }

  clear() {
    this.componentsCache = new Map([]);
  }

  getComponents() {
    return [...this.componentsCache.values()];
  }

  getComponentNames() {
    return [...this.componentsCache.keys()];
  }
}

export const globalComponentsCache = new ComponentsRegistry();

/**
 * 弹窗控制器
 * @summary
 * 提供多弹窗控制逻辑：
 * 1. 单例, 多例: 通过不同的 popId 控制弹窗实例的个数
 * 2. 参数接收： open接收初始传给pop的事件和参数配置, update 提供参数更新
 * 3. 事件回调： options 配置属性 { @[事件名称]：事件回调 } 将作为事件绑定到pop上
 * 4. 动态叠加： 内部将为组件配置 zIndex, 组件内需要自定义接收该参数，判断如何处理层叠关系
 *
 * @tips
 *  这里定位为了兼容 useMove做了接口调整，原接口直接输出定位样式。当前出position属性,
 *  组件内需要自行处理定位样式。 这里存在 style 合并和透传的的问题, 通过透传的style与
 *  props 内定义的style将分开处理, 即最终的结果时两个style的集合, 且透传的style优先级高于
 *  prop。所以如果直出定位样式，通过透传绑定给弹窗组件，后续的useMove拖拽样式将始终被透传样式覆盖
 *
 * @api
 * - add(popId, options) 创建弹窗
 * - update(popId, options) 更新弹窗配置(定位， props，events)
 * - remove(popId) 移除弹窗
 * - replace(popId, options) 替换，如果多处调用同一弹窗，希望只显示唯一同类弹窗时，
 *  使用该函数，多个弹窗公用相同的popId
 * - clearAllPop() 清空所有弹窗
 * - updateIndex(popId) 更新弹窗层级
 * - downIndex(popId) 层级下降一级
 * - topIndex(popId) 层级置顶
 *
 * @example01 - 一般使用
 *
 * const [
 *  pops,
 *  popper
 * ]  = usePop()
 *
 *
 * // 容器组件
 * <component
 *  v-for='(pop, popId) of pops'
 *  :is='pop'
 *  v-bind='pop.props' // 接收定位样式
 *  v-on='pop.on' // 接收回调事件
 *  :key='popId'>
 * </component>
 *
 * // 调用弹窗
 * popper.add('popId', {
 *  component: POP, // 弹窗组件
 *  title: 'xxx', // 弹窗自定义props
 *  @click(e){  // 弹窗事件
 *     ....
 *  }
 * })
 *
 *
 * @example02 - 预注册
 * 通过预注册组件，再次调用时，只需要传入对应注册名称，而不需要具体的配置项
 * const [ pops, popper ] = usePop()
 *
 * // 注册本地弹窗
 * popper.componentsCache.add('userInfo', {
 *  component: CMP,
 *  ...
 * })
 *
 * // 调用
 * popper.add('userInfo', { component: 'userInfo' })
 *
 */

export interface IComponent {
  component: Component | null;
  props: ComponentPropsOptions;
  on: any;
  popId: number | string | symbol | undefined;
}

export function usePop() {
  const components = shallowRef<any>({});
  const componentsCache = new ComponentsRegistry();

  function has(popId) {
    return !!unref(components)[popId];
  }

  /**
   * 添加pop
   * @param popId number | string | symbol | undefined
   * @param options
   * @returns
   */
  function add(popId, options: any = {}) {
    if (has(popId)) {
      return false;
    }

    let { component, ..._options } = options;

    // 全局缓存
    if (globalComponentsCache.has(component)) {
      const { component: cacheComponents, ...cacheOptions } = globalComponentsCache.select(component);
      component = cacheComponents;
      _options = { ...cacheOptions, ..._options };
    }

    // 局部缓存
    if (componentsCache.has(component)) {
      const { component: cacheComponents, ...cacheOptions } = componentsCache.select(component);
      component = cacheComponents;
      _options = { ...cacheOptions, ..._options };
    }

    counterStore.add();
    const newOptions = splitProps({ ..._options, zIndex: counterStore.getCount() });

    components.value = {
      ...components.value,
      [popId]: {
        popId,
        component,
        ...newOptions,
      },
    };
  }

  /**
   * 更新组件参数
   * @param {*} popId
   * @param {*} options
   * @returns
   */
  function update(popId, options = {}) {
    if (!has(popId)) {
      return false;
    }

    const { component, ...oldOptions } = components.value[popId];
    const newOptions = splitProps(options);
    components.value = {
      ...components.value,
      [popId]: {
        component,
        ...merge(oldOptions, newOptions),
      },
    };
  }

  /**
   * 移除pop
   * @param popId string
   */
  function remove(popId) {
    if (has(popId)) {
      const newCmp = components.value;
      delete newCmp[popId];
      components.value = {
        ...newCmp,
      };
    }
  }

  /**
   * 多处调用同一pop时, 替换原显示pop。
   * @param popId
   * @param options
   */
  function replace(popId, options) {
    remove(popId);
    add(popId, options);
  }

  function clearAllPop() {
    components.value = {
      component: null,
      on: {},
      props: {},
      popId: null,
    };
  }

  /**
   * 向上一层级
   * @param popId
   * @returns
   */
  function updateIndex(popId) {
    if (!has(popId)) {
      return;
    }
    const currentComponent = unref(components)[popId];
    // @ts-expect-error
    const upComponent = Object.values(unref(components)).select(i => i.zIndex > currentComponent.zIndex);
    const currentIndex = currentComponent.zIndex;
    const upIndex = upComponent.zIndex;
    update(currentIndex.popId, {
      zIndex: upIndex,
    });
    update(upComponent.popId, {
      zIndex: currentIndex,
    });
  }

  /**
   * 向下一层级
   * @param {*} popId
   * @returns
   */
  function downIndex(popId) {
    if (!has(popId)) {
      return;
    }
    const currentComponent = unref(components)[popId];
    // @ts-expect-error
    const upComponent = Object.values(unref(components)).select(i => i.zIndex < currentComponent.zIndex);
    const currentIndex = currentComponent.zIndex;
    const upIndex = upComponent.zIndex;
    update(currentIndex.popId, {
      zIndex: upIndex,
    });
    update(upComponent.popId, {
      zIndex: currentIndex,
    });
  }

  /**
   * 顶层
   * @param popId
   * @returns
   */
  function topIndex(popId) {
    if (!has(popId)) {
      return;
    }
    counterStore.add();
    update(popId, {
      zIndex: counterStore.getCount(),
    });
  }

  return [
    components,
    { has, add, remove, update, replace, clearAllPop, topIndex, updateIndex, downIndex, componentsCache },
  ];
}

/**
 * 嵌套结构下的弹窗钩子
 */

// 容器钩子
export function usePopContainer(provideKey = DEFAULT_POP_SIGN) {
  const [popMap, popper] = usePop();
  provide(provideKey, {
    popper,
  });
  return [popMap, popper];
}

// 子容器钩子
export function usePopChildren(provideKey = DEFAULT_POP_SIGN) {
  return inject(provideKey, {});
}
