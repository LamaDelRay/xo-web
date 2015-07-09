import angular from 'angular'
import uiBootstrap from 'angular-ui-bootstrap'
import uiRouter from 'angular-ui-router'
import forEach from 'lodash.foreach'

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

    const refresh = () => {
      return xo.mount.getAll()
      .then(mounts => {
        const m = {}
        forEach(mounts, mount => {m[mount.id] = mount})
        this.backUpMounts = m
      })
    }

    refresh()

    const interval = $interval(refresh, 5e3)
    $scope.$on('$destroy', () => {
      $interval.cancel(interval)
    })

    const reset = () => this.path = this.host = this.share = undefined
    this.addMount = (path, host, share) => xo.mount.create(path, host, share).then(reset).then(refresh)
    this.removeMount = id => xo.mount.delete(id).then(refresh)
    this.mount = id => xo.mount.set(id, undefined, undefined, undefined, true).then(refresh)
    this.unmount = id => xo.mount.set(id, undefined, undefined, undefined, false).then(refresh)

    this.collectionLength = col => Object.keys(col).length
  })

  // A module exports its name.
  .name
