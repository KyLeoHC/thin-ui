import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import ThinTable from '../table';

describe('Table', () => {
  const localVue = createLocalVue();
  const wrapper = shallowMount(ThinTable, { localVue });

  test('renders JSX correctly', () => {
    expect(wrapper.html()).not.toBeNull();
  });
});
