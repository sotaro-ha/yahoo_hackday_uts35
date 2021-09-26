module.exports = {
    devServer: {
      port: 3000,
      disableHostCheck: true,
      proxy: {
        '/api': {
          target: 'http://localhost:15050',
          timeout: 6000,
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api/': '/'
          }
        }
      }
    },
    transpileDependencies: ['vuetify']
};