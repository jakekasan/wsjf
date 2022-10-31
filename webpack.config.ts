import * as path from "path";
import { Configuration, Compiler, PathData, AssetInfo, Compilation } from "webpack";
import HtmlWebpackPlugin, { HtmlTagObject } from "html-webpack-plugin";
import createStyledComponentsTransformer from "typescript-plugin-styled-components";

class InlineAssetsPlugin {
    modifyFactory(publicPath: string | ((arg0: PathData, arg1: AssetInfo) => string), compilation: Compilation) {
        return (tag: HtmlTagObject): HtmlTagObject => {
            if (tag.tagName !== "script" || !(tag.attributes && (typeof tag.attributes.src === "string"))) {
                return tag;
            }

            if (typeof publicPath !== "string") {
                return tag;
            }

            if (typeof tag.attributes.src !== "string") {
                return tag;

            }
            const assets = compilation.assets;
            const scriptName = publicPath ? tag.attributes.src.replace(publicPath, "") : tag.attributes.src;
            const asset = assets[scriptName];

            if (asset == null) {
                return tag;
            }
            const innerHtml = asset.source()
            return {
                tagName: "script",
                innerHTML: asset.source() as string,
                attributes: tag.attributes,
                voidTag: tag.voidTag,
                meta: tag.meta
            }

        }
    }

    apply(compiler: Compiler): void {
        let publicPath = compiler.options.output.publicPath || '';
        if (typeof publicPath === "string" && !publicPath.endsWith("/")) {
            publicPath += "/";
        }

        compiler.hooks.compilation.tap("InlineAssetsPlugin", compilation => {
            const hooks = HtmlWebpackPlugin.getHooks(compilation);
            const modify = this.modifyFactory(publicPath, compilation);
            hooks.alterAssetTagGroups.tap("InlineAssetsPlugin", assets => {
                assets.headTags = assets.headTags.map(modify);
                assets.bodyTags = assets.bodyTags.map(modify);
                return assets;
            })
            
        })
    }
}

const styledComponentsTransformer = createStyledComponentsTransformer();

const config: Configuration = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "output.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(ts|tsx)$/,
                loader: "ts-loader",
                options: {
                    getCustomTransformers: () => ({ before: [styledComponentsTransformer]})
                }
            },
        ]
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"],
        alias: {
            "react": "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat"
        }
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new InlineAssetsPlugin()
    ]
}

export default config;
