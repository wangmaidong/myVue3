// 这个文件会帮我们打包 packages 目录下的所有包, 然后生成一个 index.ts 文件, 这个文件会帮我们导出所有的包, 然后我们就可以在根目录下使用这些包了
// node dev.js 要打包的包名 -f 要打包的格式
// minimist 是一个命令行参数解析库
import minimist from 'minimist'
// 获取路径
import { resolve, dirname } from 'path'
// 获取文件路径
import { fileURLToPath } from 'url'
// 获取 require 函数
import { createRequire } from 'module'
// 引入 esbuild 打包工具
import  esbuild from 'esbuild'
// 获取命令行参数
const args = minimist(process.argv.slice(2))
//  import.meta.url ---->  file:///E:/study/vue3Study/scripts/dev.js
// 获取文件路径  E:\study\vue3Study\scripts\dev.js
const _filename = fileURLToPath(import.meta.url)
// 获取文件所在目录 E:\study\vue3Study\scripts
const _dirname = dirname(_filename)  
// 获取 require 函数
const require = createRequire(import.meta.url)


const target = args._[0] || 'reactivity'
const format = args.f || 'iife'

// 获取入口文件 根据命令行提供的参数获取入口文件
const entry = resolve(_dirname, `../packages/${target}/src/index.ts`)
const pkg = require(resolve(_dirname, `../packages/${target}/package.json`))

esbuild.context({
    entryPoints: [entry], // 入口文件
    outfile: resolve(_dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true, // 作用是如果入口文件有依赖其他文件, 会自动将依赖的文件打包到一起
    globalName: pkg.buildOptions?.name, // iife 模式下, 全局变量名
    platform: 'browser', // 浏览器平台
    sourcemap: true, // 生成 sourcemap 文件
    format, // 打包格式
}).then((ctx) => {
    console.log('start dev')
    return ctx.watch()
})

