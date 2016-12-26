const argv = require('yargs').argv
const createValidate = require('is-my-json-valid/require')
const expand = require('expand-tilde')
const fs = require('fs')
const toAbs = require('to-absolute-glob')
const {
  forEach
} = require('lodash')

// -----------------------------------------------------------------------------

const FOLDER = process.cwd()
const isConfigValid = createValidate('../schema.json')

const configOpt = argv.config || argv.c || argv._[0] // argv._[0]: first unnamed arg
const destinationOpt = argv.destination || argv.dest || argv.d
const logOpt = argv.log || argv.l

const args = {
  configPath: configOpt && toAbsolutePath(configOpt),
  destinationPath: destinationOpt && toAbsolutePath(destinationOpt) || FOLDER,
  logPath: logOpt && toAbsolutePath(logOpt)
}

let config
try {
  config = require(args.configPath)
} catch (e) {
  console.log('Config file not found')
  process.exit(1)
}

if (!isConfigValid(config)) {
  console.log('Invalid config:')
  forEach(isConfigValid.errors, error => {
    console.log(`\t${error.field} ${error.message}`)
  })
  process.exit(1)
}

// -----------------------------------------------------------------------------

function toAbsolutePath (relativePath = '') {
  return toAbs(expand(relativePath), { cwd: FOLDER })
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

module.exports = { toAbsolutePath, log, args, config }
