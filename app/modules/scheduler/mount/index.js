import angular from 'angular'
import uiBootstrap from 'angular-ui-bootstrap'
import uiRouter from 'angular-ui-router'

import view from './view'

// ====================================================================

export default angular.module('scheduler.mount', [
  uiRouter,
  uiBootstrap
])
  .config(function ($stateProvider) {
    $stateProvider.state('scheduler.mount', {
      url: '/mount',
      controller: 'MountCtrl as ctrl',
      template: view
    })
  })
  .controller('MountCtrl', function ($scope, $state, $stateParams, $interval, xo, xoApi, notify, selectHighLevelFilter, filterFilter) {
    // FIXME
    this.increment = 0
    this.backUpMounts = {}
    this.backUpRootPath = '/var/lib/xoa'

    this.reset = () => this.path = this.host = this.share = undefined
    this.addMount = (path, host, share) => {
      this.backUpMounts[++this.increment] = {
        id: this.increment,
        path,
        host,
        share,
        mounted: false
      }
      this.reset()
    }
    this.removeMount = id => delete this.backUpMounts[id]

    this.mount = id => this.backUpMounts[id].mounted = true
    this.unmount = id => this.backUpMounts[id].mounted = false

    this.collectionLength = col => Object.keys(col).length
  })

  // A module exports its name.
  .name
