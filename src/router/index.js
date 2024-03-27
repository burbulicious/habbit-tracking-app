import { createRouter, createWebHistory } from 'vue-router';
import WeekView from '../views/WeekView.vue';
import { getToday } from '../utils/timeCalculations';

const today = getToday();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: `/week/${today}` },
    { path: '/week', redirect: `/week/${today}` },
    {
      path: '/week/:selectedDate',
      name: 'selectedDate',
      component: WeekView
    }
  ]
});

export default router;
