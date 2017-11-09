import SystemJSRegisterPublicModules from 'systemjs-webpack-plugin';
import webpack from 'webpack';
import path from 'path';

const babelConfig={
  "presets": [
    ["es2015"],
    "es2016",
    "react",
    "stage-1"
  ],
  "plugins": ["transform-decorators-legacy", "transform-regenerator","add-module-exports"],
  "env": {
    "dev": {
      "plugins": ["transform-decorators-legacy", "transform-regenerator"]
    },
    "test": {
      "plugins": [
        "transform-decorators-legacy",
        "transform-regenerator",
        ["__coverage__", {"ignore": "*.+(test|stub).*"}]
      ]
    },
    "prod": {
      "plugins": ["transform-decorators-legacy", "transform-regenerator"]
    }
  }
};

const hasExtension=/\.\w+$/;

const config = {
    entry: {
      "app": "./src/app.js",
      "common": [
        "react",
        "react-dom",
        "react-router",
        "redux",
        "redux-saga",
        "rxjs"
      ]
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname,'dist'),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { 
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: "babel-loader",
              query:babelConfig
            }
        ]
    },
    plugins: [
        new SystemJSRegisterPublicModules({
          // automatically configure SystemJS to load webpack chunks (defaults to true)
          bundlesConfigForChunks: true,

          // select which modules to expose as public modules
          registerModules: [
            // "default" filters provided are "local" and "public"
            // { filter: 'public' },

            // keyname allows a custom naming system for public modules
            {
              filter: (m)=>m.relPath.match(/src/),
              keyname: (...args)=>{
                return path.relative(__dirname,args[0].path);
              }
            },
            {
              filter: (m)=>{
                return m.relPath.match(/node_modules/);
              },
              keyname: (m)=>{
                // console.log("Map:",m);
                const req=m.request.substring(m.request.lastIndexOf('/')+1);
                const file=path.relative(__dirname,m.path).split("/").slice(1);
                if (!hasExtension.test(m.request)&&(req+".js")!==file[file.length-1]) file.pop();
                return file.join('/');
              }
            }
          ]
        }),
        // new webpack.NamedModulesPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
          name: "common",
          path: path.join(__dirname,'dist'),
          filename:"common.js"
        })
      ]
};

module.exports=config;