const path = require('path'),
  fs = require('fs'),
  { merge } = require('webpack-merge'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  camelCase = require('camelcase'),
  packageJson = require(path.resolve(process.cwd(), 'package.json')),
  webpack = require('webpack'),
  miniCssExtractPlugin = require('mini-css-extract-plugin'),
  copyWebpackPlugin = require('copy-webpack-plugin'),
  duplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin'),
  devMode = process.env.build === 'dev',
  Dotenv = require('dotenv-webpack'),
  legacyMode = process.env.legacy === 'true',
  swidgetMode = process.env.build === 'swidget',
  multiBuildMode = process.env.build === 'multi',
  exposedMode = process.env.exposed === 'true',
  devOrSwidgetMode = devMode || swidgetMode,
  legacyConfig = require('./legacyConfig'),
  packageName = camelCase(packageJson.name.replace(/@/, '-').replace(/\//, '-')),
  version = packageJson.version.toLowerCase().trim(),
  NodePolyfillPlugin = require('node-polyfill-webpack-plugin'),
  title = packageJson.config.title || packageName;
ESLintPlugin = require('eslint-webpack-plugin');

const base = {
  name: 'devConfig',
  target: 'web',
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../../dist/app'),
    filename: `${packageName}_${version}_[name].[fullhash].js`,
    chunkFilename: `${packageName}_${version}_[name].[fullhash].bundle.js`,
  },
  module: {
    rules: [
      {
        test: /\.(eot|woff2|woff|svg|otf)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'fonts/[name]-[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: 'images/[name]-[contenthash].[ext]',
            },
          },
        ],
      },
      // project css
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: devOrSwidgetMode ? 'style-loader' : miniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: devMode,
              importLoaders: 1,
              modules: {
                auto: (resourcePath) => !resourcePath.includes('uilab'),
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: devMode,
            },
          },
        ],
        include: path.resolve(__dirname, path.join('..', '..', 'src')),
      },
      // for switchui css
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: swidgetMode ? 'style-loader' : miniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
        ],
        exclude: path.resolve(__dirname, path.join('..', '..', 'src')),
      },
    ],
  },
  plugins: [
    // new webpack.WatchIgnorePlugin({ paths: [/css\.d\.ts$/] }),
    new webpack.DefinePlugin({
      __DEV__: devMode,
      'process.env.REDUX_TOOLS': process.env.REDUX_TOOLS ? JSON.stringify(process.env.REDUX_TOOLS) : false,
      'process.env.NODE_ENV': devMode ? JSON.stringify('development') : JSON.stringify('production'),
    }),
    new NodePolyfillPlugin(),
    new Dotenv({
      path: path.resolve(__dirname, '../../', process.env.ENV_FILE ? process.env.ENV_FILE : '.env'),
      safe: false,
    }),
    new ESLintPlugin({
      extensions: ['tsx'],
      fix: true,
    }),
  ],
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.png', '.svg', '.jpg', '.gif'],
    fallback: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  },
};

// copy public files
if (fs.existsSync(path.join(process.cwd(), 'public'))) {
  base.plugins.push(
    new copyWebpackPlugin({ patterns: [{ from: 'public', toType: 'dir', globOptions: { ignore: ['README.md'] } }] }),
  );
}

// only for prod and swidget mode
if (!devMode) {
  base.plugins.push(new webpack.ids.HashedModuleIdsPlugin(), new duplicatePackageCheckerPlugin());
}

// only for dev and prod not for swidget mode
if (!swidgetMode) {
  base.plugins.push(
    new htmlWebpackPlugin({
      prodMode: !devMode,
      legacyMode,
      inject: devMode,
      lang: 'en',
      title: (devMode ? 'DEV | ' : '') + title,
      favicon: packageJson.config.AppIcon,
      template: path.join(
        __dirname,
        '..',
        '..',
        'src',
        'assets',
        'templates',
        multiBuildMode ? 'multi.ejs' : 'default.ejs',
      ),
      appMountId: 'root',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        minifyCSS: true,
        minifyJS: true,
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'application-name', content: packageName },
        { name: 'application-version', content: version },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { content: 'ie=edge', 'http-equiv': 'x-ua-compatible' },
      ],
      chunksSortMode: function (chunk1, chunk2) {
        var orders = ['polyfill', 'app'];
        var order1 = orders.indexOf(chunk1.names[0]);
        var order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        } else if (order1 < order2) {
          return -1;
        } else {
          return 0;
        }
      },
    }),
    new miniCssExtractPlugin({
      filename: `${packageName}_${version}_[name].[fullhash].css`,
      chunkFilename: `${packageName}_${version}_[name].[fullhash].bundle.css`,
    }),
    //async await support in es6
    new webpack.ProvidePlugin({
      regeneratorRuntime: 'regenerator-runtime/runtime',
      Promise: ['es6-promise', 'Promise'],
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );
}

// only for exposed mode
if (exposedMode) {
  base.module.rules.push({
    test: require.resolve('react'),
    loader: 'expose-loader?ExposedReact',
  });
  base.module.rules.push({
    test: require.resolve('react-dom'),
    loader: 'expose-loader?ExposedReactDOM',
  });
  base.module.rules.push({
    test: require.resolve('inversify'),
    loader: 'expose-loader?ExposedInversify',
  });
  base.module.rules.push({
    test: require.resolve('urijs'),
    loader: 'expose-loader?ExposedUrijs',
  });
  base.module.rules.push({
    test: require.resolve('xml2js'),
    loader: 'expose-loader?ExposedXml2js',
  });
  base.module.rules.push({
    test: require.resolve('route-parser'),
    loader: 'expose-loader?ExposedRouteParser',
  });
}

if (legacyMode) {
  module.exports = merge(base, legacyConfig);
} else {
  module.exports = base;
}
