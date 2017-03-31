import { CronJob } from 'cron'
import digits from 'digits'
import dl from 'download'
import fs from 'fs'
import mkdirp from 'mkdirp'
import {
  forEach
} from 'lodash'

import {
  args,
  config,
  log
} from './utils'

const { destinationPath } = args

forEach(config, ({
  cron,
  delay,
  description,
  digits: nbDigits = 3,
  firstIndex = 1,
  name,
  path,
  url
}) => {
  const fileFolderPath = `${destinationPath}/${path}`
  mkdirp(fileFolderPath, error => {
    if (error) {
      log(`ERROR while creating folder ${fileFolderPath}: ${error}`)
    }
  })

  const onTick = () => {
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
      () => log(`Saved ${description || name}`),
      error => log(`ERROR while saving ${description || name}: ${error}`)
    )
  }

  return new CronJob({
    cronTime: cron || `0 0/${delay} * * *`,
    onTick,
    start: true
  })
})
