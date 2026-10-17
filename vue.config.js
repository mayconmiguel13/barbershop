module.exports = {
    lintOnSave: false,
    transpileDependencies: ["@vueform"],
    devServer: {
        port: 8085,
        historyApiFallback: true
    },
    chainWebpack: config => {
        config.resolve.extensions.add('.ts');
        config.module
            .rule('ts')
            .test(/\.ts$/)
            .use('babel-loader')
                .loader('babel-loader')
                .end();
    }
}