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
  "plugins": ["transform-decorators-legacy", "transform-regenerator"],
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
const test = new RegExp(`^${__dirname}`);

const config = {
    entry: {
      "app": "./module1.js",
    },
    output: {
        path: path.join(__dirname,'dist'),
        libraryTarget:"commonjs2",
        libraryExport:"default",
        filename: "bundle.js"
    },
    externals: function(...args) {
        if(test.test(args[0])) return args[2]();
        const p=path.join.apply(null,path.resolve(path.join(args[0],args[1])).split('/').reduce((a,s)=>{if (a.length) a.push(s);else if(s==='node_modules') a.push('');return a},[]).slice(1));
        console.log("external:",p);
        return args[2](null,'commonjs2 '+p);
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.jsx?$/, loader: "babel-loader", query:babelConfig }
        ]
    },
    plugins: [
        new SystemJSRegisterPublicModules({
          // automatically configure SystemJS to load webpack chunks (defaults to true)
          bundlesConfigForChunks: true,

          // select which modules to expose as public modules
          registerModules: [
            // "default" filters provided are "local" and "public"
            { filter: 'public' },

            // keyname allows a custom naming system for public modules
            {
              filter: (m)=>m.relPath.match(/src/),
              keyname: (module)=>'src/'+module.id
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
        })
        // new webpack.optimize.CommonsChunkPlugin({
        //   name: "common",
        //   path: path.join(__dirname,'dist'),
        //   filename:"common.js"
        // })
      ]
};

module.exports=config;