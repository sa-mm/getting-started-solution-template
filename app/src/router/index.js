import Router from 'vue-router'
import Vue from 'vue'

import ApplicationsPage from '@/pages/ApplicationsPage'
import DevicesPage from '@/pages/DevicesPage'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import LogoutPage from '@/pages/LogoutPage'
import NotFoundPage from '@/pages/NotFoundPage'
import QRScanPage from '@/pages/QRScanPage'
import auth from '@/api/auth'

export const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
    meta: {
      showFooter: true,
      requiresNotAuth: true
    }
  },
  {
    path: '/qrscan',
    name: 'QRScanPage',
    component: QRScanPage,
    meta: {
      showFooter: true,
      secondaryBg: true,
      hideHeader: true
    }
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      showFooter: true,
      requiresNotAuth: true
    }
  },
  {
    path: '/devices',
    name: 'DevicesPage',
    component: DevicesPage,
    meta: {
      showToolbar: true,
      requiresAuth: true
    }
  },
  {
    path: '/apps',
    name: 'ApplicationsPage',
    component: ApplicationsPage,
    meta: {
      showToolbar: true,
      requiresAuth: true
    }
  },
  {
    path: '/logout',
    name: 'LogoutPage',
    component: LogoutPage,
    meta: {
      showFooter: true,
      secondaryBg: true,
      requiresNotAuth: true
    }
  },
  {
    path: '*',
    name: 'NotFoundPage',
    component: NotFoundPage,
    meta: {
      secondaryBg: true,
      showFooter: true
    }
  }
]

let router = {}

// don't initiate router when running test -> vue-test-utils' bug workaround
// https://stackoverflow.com/a/55544303/10666966
if (process && process.env.NODE_ENV !== 'test') {
  Vue.use(Router)

  router = new Router({
    routes
  })

  router.beforeEach((to, from, next) => {
    const authenticated = auth.isAuthenticated()

    // redirect from route requiring to be logged out
    if (to.meta.requiresNotAuth && authenticated) {
      return next({ name: 'DevicesPage', query: to.query })
    }

    // redirect from any route to login if not logged in and claim query
    if (!authenticated && to.query.claim && to.name !== 'LoginPage') {
      return next({ name: 'LoginPage', query: { claim: to.query.claim } })
    }

    // redirect from auth route to login if not logged in
    if (!authenticated && to.meta.requiresAuth) {
      let query = { redirect: to.path }
      return next({ name: 'LoginPage', query })
    }

    return next()
  })
}

export default router
