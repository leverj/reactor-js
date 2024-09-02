import axios from 'axios'
import 'dotenv/config'

const apiUrl = 'https://backend.buildbear.io'
const headers = {
  Authorization: `Bearer ${process.env.BUILDBEAR_API_KEY}`,
  'Content-Type': 'application/json',
}

export async function getNetworks() {
  const response = await axios.get(`${apiUrl}/chains`, {headers}).then(_ => _.data)
  const results = {}
  Object.values(response).forEach(({options}) => {
    options.forEach(_ => results[_.label] = {name: _.label, chainId: parseInt(_.value), rpc: _.networkRpc})
  })
  return results
}

export async function getSandbox(chainId) {
  return axios.get(`${apiUrl}/v1/buildbear-sandbox/${chainId}`, {headers}).then(_ => _.data)
}

export async function createSandbox(chainId, blockNumber) {
  const data = JSON.stringify({chainId, blockNumber})
  return axios.post(`${apiUrl}/v1/buildbear-sandbox`, data, {headers}).then(_ => _.data)
}
