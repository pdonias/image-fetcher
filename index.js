#!/usr/bin/env node

'use strict'

const CronJob = require('cron').CronJob
const digits = require('digits')
const dl = require('download')
const fs = require('fs')
const mkdirp = require('mkdirp')
const {
  forEach
} = require('lodash')

const {
  args,
  log,
  config
} = require('./src/utils')

const { destinationPath } = args

forEach(config, ({ name, description, url, path, delay, cron, firstIndex = 1, digits: nbDigits }) => {
  const fileFolderPath = `${destinationPath}/${path}`
  mkdirp(fileFolderPath)

  const cb = () => {
    dl(
      url
    ).then(data => {
      const index = digits(String(firstIndex++), nbDigits)
      const date = Date.now()

      fs.writeFileSync(
        `${fileFolderPath}/` + name.replace(/#|{date}/g, match => {
          switch (match) {
            case '#':
              return index
            case '{date}':
              return date
          }
        }),
        data
      )
    }).then(
      () => log(`[${(new Date()).toString()}] Saved ${description || name}`),
      error => log(`[${(new Date()).toString()}] ERROR while saving ${description || name}: ${error}`)
    )
  }

  return new CronJob({
    cronTime: cron || `0 0/${delay} * * *`,
    onTick: cb,
    start: true
  })
})
