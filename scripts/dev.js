import minimist from 'minimist';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild'
const args = minimist(process.argv.slice(2));
const format = args.f || 'iife';
const target = args._[0] || 'reactivity';
const __dirname = dirname(fileURLToPath(import.meta.url));
const IIFENamesMap = {
  'reactivity': 'VueReactivity'
}
esbuild.context({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile: resolve(
    // 输出的文件
    __dirname,
    `../packages/${target}/dist/${target}.js`
  ),
  bundle: true,
  sourcemap: true,
  format: format,
  globalName: IIFENamesMap[target],
  platform: 'browser',
}).then(ctx => ctx.watch())
