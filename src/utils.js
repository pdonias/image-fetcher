import chalk from 'chalk'
import createValidate from 'is-my-json-valid/require'
import expand from 'expand-tilde'
import moment from 'moment'
import toAbs from 'to-absolute-glob'
import { argv } from 'yargs'
import {
  forEach
} from 'lodash'

import pkg from '../package.json'

// -----------------------------------------------------------------------------

const FOLDER = process.cwd()
const isConfigValid = createValidate('../schema.json')

const configOpt = argv.config || argv.c || argv._[0] // argv._[0]: first unnamed arg
const destinationOpt = argv.destination || argv.dest || argv.d
const help = argv.help || argv.h

export const args = {
  configPath: configOpt && toAbsolutePath(configOpt),
  destinationPath: (destinationOpt && toAbsolutePath(destinationOpt)) || FOLDER
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
module.exports.config = config // TODO: ES6

if (!isConfigValid(config)) {
  console.log('Invalid config:')
  forEach(isConfigValid.errors, error => {
    console.log(`\t${error.field} ${error.message}`)
  })
  process.exit(1)
}

// -----------------------------------------------------------------------------

export function toAbsolutePath (relativePath = '') {
  return toAbs(expand(relativePath), { cwd: FOLDER })
}

export function log (message, time = true, error = false) {
  if (time) {
    message = `[${getDate()}] ${message}`
  }

  (error ? console.error : console.log)(message)
}

export function logError (message, time) {
  log(message, time, true)
}

export function showUsage () {
  console.log(
    chalk.yellow.underline('Usage:') +
    chalk.yellow('\n\n$ file-fetcher <config file> [-d <destination folder>]') +
    chalk.yellow(`\n\n${pkg.name} ${pkg.version}`)
  )
}

export function getDate () {
  return moment().format('YYYY-MM-DD ss:mm:hh')
}
