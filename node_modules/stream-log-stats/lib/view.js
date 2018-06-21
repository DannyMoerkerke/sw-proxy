'use strict'
const ansi = require('ansi-escape-sequences')
const Table = require('table-layout')

exports.render = render

let visible = false
let previouslyRenderedLines = 0

function render (stats) {
  const clientsTable = new Table([
    {
      one: ansi.format('Clients', ['underline']),
      two: ansi.format('Requests', ['underline']),
      three: ansi.format('Transferred', ['underline'])
    },
    {
      one: stats.clientCount,
      two: stats.requests,
      three: stats.transferred
    }
  ])

  const extensionTable = new Table([
    {
      type: ansi.format('Extension', ['underline']),
      requests: ansi.format('Requests', ['underline']),
      bytes: ansi.format('Transferred', ['underline'])
    }
  ].concat(stats.topTypes))

  stats.topResources = stats.topResources.map(resourceLine => {
    const availableSpace = process.stdout.columns - 37
    if (resourceLine.resource.length > availableSpace) {
      const split = resourceLine.resource.split(/\s+/)
      resourceLine.resource = split[0] + ' ' + split[1] + ' ...' + split[2].substr(-(availableSpace))
    }
    return resourceLine
  })

  const resourceTable = new Table(
    [
      {
        resource: ansi.format('Resource', ['underline']),
        requests: ansi.format('Requests', ['underline']),
        bytes: ansi.format('Transferred', ['underline'])
      }
    ].concat(stats.topResources),
    {
      columns: [{ name: 'resource', break: true }]
    }
  )

  const output = clientsTable + '\n' + extensionTable + '\n' + resourceTable

  if (visible) {
    process.stderr.write(
      ansi.cursor.up(previouslyRenderedLines + (process.platform === 'win32' ? 1 : 0))
    )
  } else {
    visible = true
  }
  process.stderr.write(ansi.erase.display())
  const lines = output.split('\n')

  previouslyRenderedLines = 0
  for (let i = 0; i < lines.length && i < (process.stdout.rows - 2); i++) {
    console.error(lines[i])
    previouslyRenderedLines++
  }
}
