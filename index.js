const CronJob = require('cron').CronJob
const dl = require('download')
const fs = require('fs')
const mkdirp = require('mkdirp')
const {
  map,
  replace
} = require('lodash')

let config
try {
  config = require('./config.json')
} catch (e) {
  console.log('Usage: you need to create a valid config.json file before running this program')
  process.exit(0)
}

const crons = map(config, ({ name, description, url, path, delay, cron }) => {
  let cpt = 0

  const absolutePath = `${__dirname}/${path}`
  mkdirp(absolutePath)

  const cb = () => {
    dl(
      url
    ).then(data => {
      const index = cpt++
      const date = Date.now()

      fs.writeFileSync(
        `${absolutePath}/` + name.replace(/#|{date}/g, match => {
          switch(match) {
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
