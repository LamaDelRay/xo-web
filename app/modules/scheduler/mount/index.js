import angular from 'angular'
import filter from 'lodash.filter'
import forEach from 'lodash.foreach'
import map from 'lodash.map'
import trim from 'lodash.trim'
import uiBootstrap from 'angular-ui-bootstrap'
import uiRouter from 'angular-ui-router'
import size from 'lodash.size'

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

    this.ready = false

    this.getReady = () => {
      return xo.mount.getBackupMountPath()
      .then(path => this.backUpRootPath = path)
      .then(() => xo.mount.getAll())
      .then(mounts => this.backUpMounts = mounts)
      .then(() => this.ready = true)
    }
    this.getReady()

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

    this.sanitizePath = (...paths) => (paths[0] && paths[0].charAt(0) === '/' && '/' || '') + filter(map(paths, s => s && filter(map(s.split('/'), trim)).join('/'))).join('/')

    const reset = () => this.path = this.host = this.share = undefined
    this.addMount = (path, host, share) => xo.mount.create(this.sanitizePath(path), host, this.sanitizePath(share)).then(reset).then(refresh)
    this.removeMount = id => xo.mount.delete(id).then(refresh)
    this.mount = id => xo.mount.set(id, undefined, undefined, undefined, true).then(refresh)
    this.unmount = id => xo.mount.set(id, undefined, undefined, undefined, false).then(refresh)

    this.collectionLength = col => size(col)
  })

  // A module exports its name.
  .name
