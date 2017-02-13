File fetcher
============

[![npm version](https://badge.fury.io/js/file-fetcher.svg)](https://badge.fury.io/js/file-fetcher)
[![GitHub version](https://badge.fury.io/gh/pdonias%2Ffile-fetcher.svg)](https://badge.fury.io/gh/pdonias%2Ffile-fetcher)

file-fetcher is a simple tool that lets you download files recurrently.

## Installation

```sh
$ npm install -g file-fetcher
```

## Usage

- Create a config file with your configuration (See documentation and example below)
- Quick use:

```sh
$ file-fetcher <config file>
```

- Pro use:

```sh
$ file-fetcher
    [ --config | -c ]      <config file>
    [ --destination | -d   <destination folder>  ]
    [ --log | -l           <log file>            ]
```

Default destination folder is [cwd](https://en.wikipedia.org/wiki/Working_directory).
<br />
Default log output is [stdout](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29).

## Config file properties

The config file must contain an array of objects.
Each object corresponds to a file and can/must have the following properties:

| Property | Type | Required? | Default | Description |
|:---|:---|:---:|:---:|:---|
| url | String | ✓ |  | The complete URL from which to download the file |
| path | String | ✓ |  | The relative local path where to save the file |
| name | String | ✓ |  | The name pattern of the destination file (e.g.: my-file-number-#.jpg) |
| description | String |  | `name` | The string used to represent the file in log messages |
| firstIndex | Number |  | 1 | The first number used as index (#) in name pattern |
| digits | Number |  | 3 | The minimum number of digits for the index (#) in name pattern. Smaller numbers will be padded with 0s on the left. |
| cron | String | ✓ or `delay` |  | The cron pattern that determines the download frequence |
| delay | Number | ✓ or `cron` |  | The delay in minutes that determines the download frequence |

## File name pattern

The file name needs to be a pattern in order to not overwrite the same file after each download.

Pattern substitutions:

| String | Replaced by |
|:---|:---|
| # | Index of the download iteration |
| {date} | A string representing the current time |

## `delay` vs `cron`

To determine the download frequence of each file, you can use either the `delay` property or the `cron` property.
- `delay` is simply a number of minutes between each download<br/>
__N.B.:__ due to the cron implementation, using a number like **29** will trigger a download at **00:00**, **00:29**, **00:58**, **01:00**, **01:29**, ...
- `cron` is a [cron expression](https://en.wikipedia.org/wiki/Cron)

## Config example

```json
[
  {
    "url": "http://www.my-site.com/path/to/file.jpg",
    "name": "file_nb_#({date}).jpg",
    "path": "relative/path/to/file",
    "cron": "0 0/2 7-18 * * *",
    "description": "my file"
  },
  {
    "url": "http://www.my-site.com/path/to/other/file.jpg",
    "name": "file_nb_#.jpg",
    "firstIndex": "42",
    "digits": "4",
    "path": "relative/path/to/other/file",
    "delay": "3",
    "description": "my other file"
  }
]
```
*A functional `.sample.config.json` file is provided in the sources.*
