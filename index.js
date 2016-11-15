#!/usr/bin/env node

'use strict'

const CronJob = require('cron').CronJob
const dl = require('download')
const expand = require('expand-tilde')
const fs = require('fs')
const mkdirp = require('mkdirp')
const toAbs = require('to-absolute-glob')
const {
  forEach
} = require('lodash')

const ARGS = process.argv
const FOLDER = process.cwd()

function toAbsolutePath (relativePath = '') {
  return toAbs(expand(relativePath), { cwd: FOLDER })
}

let config
try {
  config = require(toAbsolutePath(ARGS[2]))
} catch (e) {
  console.log('Usage: file-fetcher <config file> [<destination file>]')
  process.exit(0)
}

forEach(config, ({ name, description, url, path, delay, cron }) => {
  let cpt = 0

  const absolutePath = `${toAbsolutePath(ARGS[3])}/${path}`
  mkdirp(absolutePath)

  const cb = () => {
    dl(
      url
    ).then(data => {
      const index = cpt++
      const date = Date.now()

      fs.writeFileSync(
        `${absolutePath}/` + name.replace(/#|{date}/g, match => {
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
      () => console.log(`[${(new Date()).toString()}] Saved ${description || name}`),
      error => console.error(`[${(new Date()).toString()}] ERROR while saving ${description || name}: ${error}`)
    )
  }

  return new CronJob({
    cronTime: cron || `0 0/${delay} * * *`,
    onTick: cb,
    start: true,
    timeZone: 'Europe/Paris'
  })
})
