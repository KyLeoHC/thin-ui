import Vue from 'vue';
import VueRouter from 'vue-router';

import List from '../views/list/index.vue';
import Detail from '../views/detail/index.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  base: '/site',
  routes: [
    {
      name: 'default',
      path: '/',
      component: List
    },
    {
      name: 'list',
      path: '/list',
      component: List
    },
    {
      name: 'detail',
      path: '/detail',
      component: Detail
    }
  ]
});
