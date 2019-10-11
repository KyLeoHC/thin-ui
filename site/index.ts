import Vue, { VNode } from 'vue';
import router from './router';
import App from './app.vue';
import Thin from '@/index';
import '@/style';

Vue.use(Thin);

new Vue({
  router,
  render: (h): VNode => h(App)
}).$mount('#app');
