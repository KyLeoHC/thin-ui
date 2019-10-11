import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import { mocks } from '../../../test/component';
import ThinTable from '../table';

describe('Table', () => {
  const localVue = createLocalVue();
  const wrapper = shallowMount(ThinTable, { localVue, mocks });

  test('renders JSX correctly', () => {
    expect(wrapper.html()).not.toBeNull();
  });
});
