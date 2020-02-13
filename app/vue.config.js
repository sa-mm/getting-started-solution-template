const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '^/api': {
        changeOrigin: true,
        logLevel: 'debug',
        xfwd: false,
        toProxy: false,
        target: process.env.MURANO_PRODUCT
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'static/*/*',
          ignore: ['.*']
        },
        {
          from: 'vendor/*',
          ignore: ['.*']
        }
      ])
    ]
  }
}
