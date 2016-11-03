const config = require('./config.json')
const CronJob = require('cron').CronJob
const dl = require('download')
const fs = require('fs')
const mkdirp = require('mkdirp')
const {
  findLastIndex,
  map,
  replace
} = require('lodash')

if (!config) {
  console.log('Usage: copy file .example.config.json, rename it as config.json and fill it with your configuration before running this program.')
}

const crons = map(config, image => {
  let cpt = 0
  const path = `${__dirname}/` + image.dest.substr(0, findLastIndex(image.dest, c => c === '/'))
  mkdirp(path)
  const cb = () => {
    dl(
      image.url
    ).then(data => {
      fs.writeFileSync(
        `${__dirname}/` + image.dest.replace(/\*|{date}/g, match => match === '*' ? cpt++ : Date.now()),
        data
      )
    }).then(
      () => console.log(`[${(new Date()).toString()}] Saved ${image.description || image.dest}`),
      error => console.log(`[${(new Date()).toString()}] ERROR while saving ${image.description || image.dest}: ${error}`)
    )
  }
  return new CronJob({
    cronTime: image.cron || `0 0/${image.delay} * * *`,
    onTick: cb,
    start: true,
    timeZone: 'Europe/Paris'
  })
})
