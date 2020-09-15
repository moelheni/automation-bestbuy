module.exports = {
    src_folders: ['tests'],
  
    webdriver: {
      start_process: true,
      port: 4444,
      server_path: require('chromedriver').path
    },
  
    test_settings: {
      default: {
        launch_url: 'ttps://www.bestbuy.com/',
        desiredCapabilities : {
          browserName : 'chrome'
        }
      }
    }
  }