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

const config = {
    entry: {
      "app": "./src/app.js",
      "common": /node_modules/
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

          publicModuleChunks: [],
          // select which modules to expose as public modules
          registerModules: [
            // "default" filters provided are "local" and "public"
            // { filter: 'public' },

            // keyname allows a custom naming system for public modules
            // {
            //   filter: (m)=>m.relPath.match(/src/),
            //   keyname: (...args)=>{
            //     // console.log("Map:",args);
            //     return 'src/'+args[0].name;
            //   }
            // },
            {
              filter: (m)=>{
                console.log("Filter:",m);
                return m.relPath.match(/node_modules/);
              },
              keyname: (...args)=>{
                console.log("Map:",args);
                return 'src/'+args[0].name;
              }
            },

            // keyname can be a function
            // {
            //   filter: 'public',
            //   keyname: (module) => 'publicModule-' + module.id
            // },

            // filter can also be a function
            // {
            //   filter: (m) => m.relPath.match(/src/),
            //   keyname: 'random-naming-system-[id]'
            // }
          ]
        }),
        // new webpack.DllPlugin({
        //   context: __dirname,
        //   name: "[name]_[hash]",
        //   path: path.join(__dirname,"dist", "manifest.json"),
        // })
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: "common",
        //   path: path.join(__dirname,'dist'),
        //   filename:"common.js"
        // })
      ]
};

module.exports=config;