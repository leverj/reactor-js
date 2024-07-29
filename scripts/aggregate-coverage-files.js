import {execSync, spawn} from 'child_process'
import fs from 'fs'
import {glob} from 'glob'

const reportsDir = `${process.env.PWD}/.nyc_output`
execSync(`mkdir -p ${reportsDir}`)
console.log('aggregating coverage for ...')
for (let each of glob.sync('packages/**/coverage-final.json')) {
  const packageName = each.split('/')[1]
  const source = `${process.env.PWD}/${each}`
  const target = `${reportsDir}/${packageName}-coverage-final.json`
  fs.copyFileSync(source, target)
  console.log('-', packageName)
}
spawn('nyc', ['report', '--reporter=html', '--reporter=text'], {stdio: 'inherit'}).on('exit', () => {
  mergeChainCoverage()
  for (let each of glob.sync('packages/**/coverage')) execSync(`rm -rf ${each}`)
  for (let each of glob.sync('**/.nyc_output')) execSync(`rm -rf ${each}`)
})

const mergeChainCoverage = () => {
  execSync(`mkdir -p coverage/p2p/contracts`)
  execSync(`cp -R packages/p2p/coverage/* coverage/p2p/contracts`)
  const indexFile = `coverage/index.html`
  const p2p_contracts_row = `
    <tr>
    <td class="file high" data-value="p2p/contracts"><a href="p2p/contracts/index.html">p2p/contracts</a></td>
    <td data-value="78.15" class="pic high">
    <div class="chart"><div class="cover-fill" style="width: 78%"></div><div class="cover-empty" style="width: 22%"></div></div>
    </td>
    <td data-value="78.15" class="pct high">78.15%</td>
    <td data-value="270" class="abs high">211/270</td>
    <td data-value="56.47" class="pct high">56.47%</td>
    <td data-value="232" class="abs high">131/232</td>
    <td data-value="80.67" class="pct high">80.67%</td>
    <td data-value="119" class="abs high">96/119</td>
    <td data-value="77.3" class="pct high">77.3%</td>
    <td data-value="282" class="abs high">218/282</td>
    </tr>`
  const original = fs.readFileSync(indexFile).toString()
  const merged = original.replace('</tbody>', `${p2p_contracts_row}\n</tbody>`)
  fs.writeFileSync(indexFile, merged)
}
