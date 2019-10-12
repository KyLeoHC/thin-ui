import Vue, { VueConstructor } from 'vue';

export const COMPONENT_NAME_PREFIX = 'thin';

export const getComponentName = (component: string): string => `${COMPONENT_NAME_PREFIX}-${component}`;

export class ThinUIComponent extends Vue {
  static install: (Vue: VueConstructor) => void;
}
