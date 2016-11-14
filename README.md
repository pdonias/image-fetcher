File fetcher
============

## Installation

```sh
$ npm install -g file-fetcher
```

## Usage

- Create a config file with your configuration (See documentation and example below)
- Run file-fetcher:

```sh
$ file-fetcher <config file> [<destination folder>]
```

## Config file JSON schema

```json
{
  "type": "array",
  "items": {
    "type": "object",
    "description": "An object describing how, when and where the file will be downloaded",
    "properties": {
      "url": {
        "type": "string",
        "description": "The complete URL from which to download the file"
      },
      "path": {
        "type": "string",
        "description": "The relative local path where to save the file"
      },
      "name": {
        "type": "string",
        "description": "The name pattern of the destination file (e.g.: my-file-number-#.jpg)"
      },
      "cron": {
        "type": "string",
        "description": "The cron pattern that determines the download frequence (delay can be used instead)",
        "optional": "true"
      },
      "delay": {
        "type": [ "number", "string" ],
        "description": "The delay in minutes that determines the download frequence (cron can be used instead)",
        "optional": "true"
      },
      "description": {
        "type": "string",
        "description": "The string used to represent the file in log messages",
        "optional": "true"
      }
    }
  }
}
```

## File name pattern

The file name needs to be a pattern in order to not overwrite the same file after each download.
Pattern substitutions:
  - `#` → index of the download iteration
  - `{date}` → a string representing the current time

## `delay` vs `cron`

To determine the download frequence of each file, you can use either the `delay` property or the `cron` property.
- `delay` is simply a number of minutes between each download
- `cron` is a [cron expression](https://en.wikipedia.org/wiki/Cron)

## Config example

```json
[
  {
    "url": "http://www.my-site.com/path/to/file.jpg",
    "name": "file_nb_#({date}).jpg",
    "path": "relative/path/to",
    "cron": "0 0/2 7-18 * * *",
    "description": "my file"
  },
  {
    "url": "http://www.my-site.com/path/to/other/file.jpg",
    "name": "file_nb_#.jpg",
    "path": "relative/path/to/other/file",
    "delay": "3",
    "description": "my other file"
  }
]
```
