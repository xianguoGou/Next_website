const withCss = require('@zeit/next-css')
// const withTypescript = require('@zeit/next-typescript')

if(typeof require !== 'undefined'){
    require.extensions['.css']=file=>{}
}

module.exports = withCss({})
// module.exports = withTypescript({
//     webpack(config, options) {
//     //  这里面还可以再配置哦 最后一个要return
//         // if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())
//         return config
//     }
// })