import { createPublicClient, http } from "viem"
import { normalize } from "viem/ens"
import { mainnet } from "viem/chains"

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})


export const getUserInfo = async (identify: string) => {
  const normalizeIdentify = normalize(identify)
  const res = await Promise.all([
    mainnetClient.getEnsAddress({ name: normalizeIdentify }),
    mainnetClient.getEnsAvatar({ name: normalizeIdentify }),
    mainnetClient.getEnsText({
      name: normalizeIdentify,
      key: 'com.twitter',
    }),
    mainnetClient.getEnsText({
      name: normalizeIdentify,
      key: 'url',
    }),
    mainnetClient.getEnsText({
      name: normalizeIdentify,
      key: 'xyz.farcaster',
    }),
    mainnetClient.getEnsText({
      name: normalizeIdentify,
      key: 'com.github',
    }),
    mainnetClient.getEnsText({
      name: normalizeIdentify,
      key: 'description',
    })
  ])

  console.log("res", res)
}
