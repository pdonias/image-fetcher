const argv = require('yargs').argv
const expand = require('expand-tilde')
const fs = require('fs')
const toAbs = require('to-absolute-glob')

const FOLDER = process.cwd()

function toAbsolutePath (relativePath = '') {
  return toAbs(expand(relativePath), { cwd: FOLDER })
}

const configOpt = argv.config || argv.c || argv._[0]
const destinationOpt = argv.destination || argv.dest || argv.d
const logOpt = argv.log || argv.l

const args = {
  configPath: configOpt && toAbsolutePath(configOpt),
  destinationPath: destinationOpt && toAbsolutePath(destinationOpt) || FOLDER,
  logPath: logOpt && toAbsolutePath(logOpt)
}

function log (message) {
  const { logPath } = args

  if (logPath) {
    fs.appendFile(logPath, `${message}\n`, e => {
      if (e) {
        console.error(e)
      }
    })
  } else {
    console.log(message)
  }
}

module.exports = { toAbsolutePath, log, args }
