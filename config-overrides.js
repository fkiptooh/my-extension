const { override } = require('customize-cra');
const Dotenv = require('webpack-dotenv-plugin');

const overrideEntry = (config) => {
  config.entry = {
    main: './src/popup/', // the extension UI
    background: './src/background/',
    content: './src/content/',
  }
  return config;
}

const overrideOutput = (config) => {
  config.output = {
    ...config.output,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].js',
  }
  // config.module.rules.push({
  //   test: /\.css$/,
  //   use: ['style-loader', 'css-loader'], // Loaders for CSS processing
  // });
  return config;
}

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
    };

    config.plugins = [
      ...config.plugins,
      new Dotenv({
        path: './.env',
        safe: true,
        systemvars: true,
        silent: true, // hide errors
        defaults: false, // load default .env
      })
    ];

    return override(overrideEntry, overrideOutput)(config);
  }
}
// const { override } = require('customize-cra');
// const Dotenv = require('webpack-dotenv-plugin');
// const path = require('path');

// const overrideEntry = (config) => {
//     config.entry = {
//       main: './src/popup/', // the extension UI
//       background: './src/background/',
//       content: './src/content/',
//     }
  
//     return config
// }

// const overrideOutput = (config) => {
//     config.output = {
//       ...config.output,
//       filename: 'static/js/[name].js',
//       chunkFilename: 'static/js/[name].js',
//     }
//     // config.module.rules.push({
//     //   test: /\.css$/,
//     //   use: ['style-loader', 'css-loader'], // Loaders for CSS processing
//     // });
//     return config
// }

// module.exports = {
//   webpack: (config) => {
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       path: require.resolve('path-browserify'),
//     };

//     config.plugins = [
//       ...config.plugins,
//       new Dotenv({
//         path: '.env',
//         safe: false,    // Load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
//         systemvars: true, // Load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
//         silent: true    // Hide any errors
//       })
//     ];

//     return override(overrideEntry, overrideOutput)(config);
//   }
// }

// webpack: (config) => override(overrideEntry, overrideOutput)(config),
// plugins: [
//   new Dotenv({
//     path: '.env', 
//     safe: false,    // Load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
//     systemvars: true, // Load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
//     silent: true    // Hide any errors
//   })
// ],