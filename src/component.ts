import Vue, { VueConstructor } from 'vue';

export const COMPONENT_NAME_PREFIX = 'thin';

export const createGetComponentName = (component: string): (classNameSuffix?: string) => string => {
  const componentName = `${COMPONENT_NAME_PREFIX}-${component}`;
  // return class name getter function
  return (classNameSuffix?: string): string => {
    return classNameSuffix ? `${componentName}-${classNameSuffix}` : `${componentName}`;
  };
};

export class ThinUIComponent extends Vue {
  static install: (Vue: VueConstructor) => void;
}
