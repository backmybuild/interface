import { Address, createPublicClient, getAddress, http, zeroAddress } from "viem"
import { normalize } from "viem/ens"
import { base, mainnet } from "viem/chains"
import axios from "axios";

export interface UserInfo {
  displayName: string;
  address: Address;
  description: string;
  avatar: string;
  socials?: string[];
}

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

const getUserInfoFromWeb3Bio = async (identify: string): Promise<UserInfo | null> => {
  try {
    const { data } = await axios.get(
      `https://api.web3.bio/profile/${identify}`
    );

    const allLinks: string[] = [];
    for (const item of data) {
      if (!item.links) continue;
      for (const [, val] of Object.entries(item.links)) {
        const handle = val as any;
        if (handle?.link) allLinks.push(handle.link);
      }
    }
    const uniqueLinks = Array.from(
      new Map(allLinks.map((l) => [l, l])).values()
    );

    const userInfo: UserInfo = {
      address: (data[0].address as Address) || identify,
      displayName: (data[0].displayName as string) || identify,
      avatar: data[0].avatar || `https://effigy.im/a/${data[0].address}.png`,
      description: data[0].description as string,
      socials: uniqueLinks.splice(0, 3),
    };
    return userInfo
  } catch (error) {
    console.error("Error fetching user info from web3.bio:", error)
    return null
  }
}


export const getUserPrimaryName = async (address: string): Promise<string | null> => {
  const baseClient = createPublicClient({
    chain: base,
    transport: http(),
  })
  try {
    const name = await baseClient.getEnsName({ address: address as Address })
    return name
  } catch (error) {
    console.error("Error fetching ENS name:", error)
    return null
  }
}

export const getUserInfo = async (identify: string): Promise<UserInfo | null> => {
  if (identify.endsWith(".eth")) {
    const normalizeIdentify = normalize(identify)
    const res = await Promise.all([
      mainnetClient.getEnsAddress({ name: normalizeIdentify }),
      mainnetClient.getEnsAvatar({ name: normalizeIdentify }),
      mainnetClient.getEnsText({
        name: normalizeIdentify,
        key: 'description',
      }),
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
    ])
    const twitter = res[3] ? `https://twitter.com/${res[3]}` : null
    const website = res[4] || null
    const farcaster = res[5] ? `https://farcaster.xyz/${res[5]}` : null
    const github = res[6] ? `https://github.com/${res[6]}` : null

    const address = res[0]
    if (address === zeroAddress) {
      return null
    }
    const avatar = res[1] || `https://effigy.im/a/${address}.png`
    const socials = [twitter, website, farcaster, github].filter((item): item is string => !!item)
    const description = res[2] || ''
    const userInfo: UserInfo = {
      displayName: identify,
      address: getAddress(address as Address),
      description,
      avatar,
      socials
    }
    return userInfo
  } else {
    const res = await getUserInfoFromWeb3Bio(identify)
    return res
  }
}
