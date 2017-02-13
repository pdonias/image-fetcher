const argv = require('yargs').argv
const chalk = require('chalk')
const createValidate = require('is-my-json-valid/require')
const expand = require('expand-tilde')
const fs = require('fs')
const pkg = require('../package.json')
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
const help = argv.help || argv.h

const args = {
  configPath: configOpt && toAbsolutePath(configOpt),
  destinationPath: destinationOpt && toAbsolutePath(destinationOpt) || FOLDER,
  logPath: logOpt && toAbsolutePath(logOpt)
}

if (help) {
  showUsage()
  process.exit(0)
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

function showUsage () {
  console.log(
    chalk.yellow.underline('Usage:') +
    chalk.yellow('\n\n$ file-fetcher <config file> [-d <destination folder>] [-l <log file>]') +
    chalk.yellow(`\n\n${pkg.name} ${pkg.version}`)
  )
}

module.exports = { toAbsolutePath, log, args, config, showUsage }
