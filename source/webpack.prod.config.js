const path = require("path");

module.exports = {
    watch: true,
    mode: "production",
    devtool: "source-map",
    entry: {
        index: ["@babel/polyfill", "./src/index.js"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../"),
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    plugins: [
                        "@babel/plugin-syntax-dynamic-import",
                        "@babel/plugin-proposal-class-properties",
                    ],
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
        ],
    },
    externals: {
        react: "react",
        react: "React",
        React: "React",
        "window.react": "React",
        "window.React": "React",
        "react-dom": "ReactDOM",
        jquery: "jQuery",
        $: "jQuery",
        moment: "moment",
        "react-bootstrap": "ReactBootstrap", // needs to be this exact spelling -- ReactBootstrap
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: "all",
    //     },
    // },
};
