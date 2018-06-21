'use strict'
const Stack = require('../stack')
const arrayify = require('array-back')

class ServeCommand {
  partialDefinitions () {
    return [
      {
        name: 'port',
        alias: 'p',
        type: Number,
        description: 'Web server port.',
        section: 'server'
      },
      {
        name: 'hostname',
        type: String,
        description: 'The hostname (or IP address) to listen on. Defaults to 0.0.0.0 (any host).',
        section: 'server'
      },
      {
        name: 'max-connections',
        type: Number,
        description: 'The maximum number of concurrent connections supported by the server.',
        section: 'server'
      },
      {
        name: 'keep-alive-timeout',
        type: Number,
        description: 'The period (in milliseconds) of inactivity a connection will remain open before being destroyed. Set to `0` to keep connections open indefinitely.',
        section: 'server'
      },
      {
        name: 'https',
        type: Boolean,
        description: 'Enable HTTPS using a built-in TLS certificate registered to the hosts 127.0.0.1 and localhost.',
        section: 'tls'
      },
      {
        name: 'http2',
        type: Boolean,
        description: 'Enable HTTP2 using a built-in TLS certificate registered to the hosts 127.0.0.1 and localhost.',
        section: 'tls'
      },
      {
        name: 'key',
        type: String,
        typeLabel: '{underline file}',
        description: 'Private key. Supply along with --cert to launch a https server.',
        section: 'tls'
      },
      {
        name: 'cert',
        type: String,
        typeLabel: '{underline file}',
        description: 'Certificate chain. Supply along with --key to launch a https server.',
        section: 'tls'
      },
      {
        name: 'pfx',
        type: String,
        typeLabel: '{underline file}',
        description: 'Optional PFX or PKCS12 encoded private key and certificate chain. An alternative to providing --key and --cert.',
        section: 'tls'
      },
      {
        name: 'ciphers',
        type: String,
        description: 'Optional cipher suite specification, replacing the default.',
        section: 'tls'
      },
      {
        name: 'secure-protocol',
        type: String,
        description: 'Optional SSL method to use, default is "SSLv23_method".',
        section: 'tls'
      },
      {
        name: 'stack',
        type: String,
        multiple: true,
        description: 'Construct a middleware stack using the modules provided.',
        typeLabel: '{underline path} {underline ...}',
        section: 'extension'
      },
      {
        name: 'server',
        type: String,
        typeLabel: '{underline path}',
        description: 'Custom server factory, e.g. lws-http2',
        section: 'extension'
      },
      {
        name: 'websocket',
        type: String,
        typeLabel: '{underline path}',
        description: 'A path to a websocket module',
        section: 'extension'
      },
      {
        name: 'view',
        type: String,
        description: 'A path to a custom view module',
        typeLabel: '{underline path}',
        section: 'extension'
      },
      {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print these usage instructions.',
        section: 'core'
      },
      {
        name: 'version',
        type: Boolean,
        description: 'Print the version number.',
        section: 'core'
      },
      {
        name: 'config-file',
        alias: 'c',
        type: String,
        description: 'Config filename to use, defaults to "lws.config.js".',
        typeLabel: '{underline file}',
        section: 'core'
      },
      {
        name: 'config',
        type: Boolean,
        description: 'Print the active config.',
        section: 'core'
      }
    ]
  }

  usage () {
    const sections = [
      {
        header: 'lws',
        content: 'The modular web server for productive full-stack development.'
      },
      {
        header: 'Synopsis',
        content: [
          '$ lws <options>',
          '$ lws {underline command} <options>'
        ]
      },
      {
        header: 'Server Options',
        content: 'Options set on the server.'
      },
      {
        optionList: this.partialDefinitions().filter(def => def.section === 'server'),
        reverseNameOrder: true
      },
      {
        content: 'HTTPS/TLS specific options.'
      },
      {
        optionList: this.partialDefinitions().filter(def => def.section === 'tls'),
        reverseNameOrder: true
      },
      {
        header: 'Extension Options'
      },
      {
        optionList: this.partialDefinitions().filter(def => def.section === 'extension'),
        reverseNameOrder: true
      },
      {
        header: 'Middleware stack',
        content: this.stack.length
          ? this.stack.map(mw => ({
            name: '↓ ' + mw.constructor.name,
            desc: mw.description && mw.description()
          }))
          : '{italic Stack empty, supply one or more middlewares using --stack.}'
      }
    ]
    const stackOptionDefinitions = this.stack.getOptionDefinitions()
    if (stackOptionDefinitions.length) {
      sections.push({
        header: 'Middleware options',
        optionList: stackOptionDefinitions,
        reverseNameOrder: true
      })
    }
    const viewOptionDefinitions = this.view.optionDefinitions()
    if (viewOptionDefinitions.length) {
      sections.push({
        header: 'View options',
        optionList: viewOptionDefinitions,
        reverseNameOrder: true
      })
    }
    sections.push(
      {
        header: 'Misc Options'
      },
      {
        optionList: this.partialDefinitions().filter(def => def.section === 'core'),
        reverseNameOrder: true
      }
    )
    const commands = Array.from(this._commands)
      .filter(([name, command]) => name)
    if (commands.length) {
      sections.push(
        {
          header: 'Commands',
          content: commands
            .map(([name, command]) => ({ name: name, desc: command.description && command.description() }))
        }
      )
    }
    sections.push({
      content: 'Project home: {underline https://github.com/lwsjs/lws}'
    })
    return sections
  }

  /**
   * Load and merge options
   */
  getOptions (initialOptions, argv) {
    const util = require('../util')
    initialOptions = Object.assign({ port: 8000 }, initialOptions)
    initialOptions.stack = arrayify(initialOptions.stack)
    const commandLineArgs = require('command-line-args')
    /* get builtIn command-line options */
    let cliOptions = commandLineArgs(this.partialDefinitions(), { argv, partial: true, camelCase: true })
    /* load stored config */
    const storedOptions = getStoredConfig(initialOptions.configFile || cliOptions.configFile)

    let options = util.deepMerge({}, initialOptions, storedOptions, cliOptions)

    /* establish the feature stack */
    const firstDefinedStack = [
      cliOptions.stack,
      storedOptions.stack,
      initialOptions.stack
    ].find(s => s && s.length)
    const stack = Stack.create(firstDefinedStack, options)
    this.stack = stack // required by usage()
    const stackDefinitions = stack.getOptionDefinitions()

    /* establish the view */
    const firstDefinedView = cliOptions.view || storedOptions.view || initialOptions.view
    const View = require('../view-base')
    const viewModule = View.load(firstDefinedView) || require('../cli-view')
    const ViewClass = viewModule(View)
    const view = new ViewClass()
    this.view = view // required by usage()
    const viewDefinitions = view.optionDefinitions ? view.optionDefinitions() : []

    /* now we have the stack and view definitions, parse command-line */
    const allDefinitions = [ ...this.partialDefinitions(), ...viewDefinitions, ...stackDefinitions ]
    cliOptions = commandLineArgs(allDefinitions, { argv, camelCase: true })
    options = util.deepMerge({}, initialOptions, storedOptions, cliOptions)
    options.stack = stack
    options.view = view
    return options
  }

  /**
   * @returns {HTTPServer}
   */
  execute (options, argv) {
    options = this.getOptions(options, argv)
    if (options.help) {
      this.showUsage()
    } else if (options.config) {
      this.showConfig(options)
    } else if (options.version) {
      this.showVersion()
    } else {
      const Lws = require('../lws')
      const lws = new Lws()

      lws.on('verbose', (key, value) => {
        options.view.write(key, value, options)
      })

      const server = lws.listen(options)
      return server
    }
  }

  showConfig (options) {
    options = Object.assign({}, options)
    delete options.config
    delete options.moduleDir
    delete options.modulePrefix
    console.log(require('util').inspect(options, { depth: 2, colors: true }))
  }

  showVersion () {
    const path = require('path')
    const pkg = require(path.resolve(__dirname, '..', '..', 'package.json'))
    console.log(pkg.version)
  }

  showUsage () {
    const commandLineUsage = require('command-line-usage')
    console.log(commandLineUsage(this.usage()))
  }
}

/**
 * Return stored config object.
 * @return {object}
 * @ignore
 */
function getStoredConfig (configFilePath) {
  const walkBack = require('walk-back')
  const configFile = walkBack(process.cwd(), configFilePath || 'lws.config.js')
  return configFile ? require(configFile) : {}
}

module.exports = ServeCommand
