import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/global.css';

import auth from './js/auth';
import login from './components/login/Login.vue';
import signup from './components/signup/Signup.vue';
import status from './components/status/Status.vue';

Vue.use(VueRouter);
Vue.config.productionTip = false;


function requireAuth(to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: {
        // redirect: to.fullPath
      }
    })
  } else {
    next();
  }
}

function redirect(to, from, next) {
  if (!auth.loggedIn()) {
    next();
  } else {
    next({
      path: '/',
    })
  }
}

// NOTE: Routing should be handled a lot better when it comes to authenticated users.
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [{
      path: '/',
      component: status,
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      component: login,
      beforeEnter: redirect
    },
    {
      path: '/signup',
      component: signup,
      beforeEnter: redirect
    },
    {
      path: '/logout',
      beforeEnter(to, from, next) {
        auth.logout();
        next('/');
      }
    }
  ]
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');