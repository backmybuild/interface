"use server";
import { Metadata, NextPage, ResolvingMetadata } from "next";
import { headers } from "next/headers"; // added
import { DonationInfo } from "./info";
import WalletProvider from "./wallet-provider";
import { getUserInfo } from "./get-user-info";

type Props = {
  params: Promise<{ identify: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const generateMetadata = async (
  { params }: Props,
  _: ResolvingMetadata
): Promise<Metadata> => {
  try {
    const { identify } = await params;
    const userInfo = await getUserInfo(identify);
    if (!userInfo) {
      return {
        title: "Back",
        description: "Everything you are. In one, simple link in bio.",
        icons: {
          icon: "/back-square-logo.png",
        },
      }
    }

    return {
      title: userInfo.displayName || identify,
      description: userInfo.description || "Everything you are. In one, simple link in bio.",
      icons: {
        icon: userInfo.avatar || "/back-square-logo.png",
      },
    };
  } catch (_) {
    return {
      title: "Back",
      description: "Everything you are. In one, simple link in bio.",
      icons: {
        icon: "/back-square-logo.png",
      },
    };
  }
};

const DonationPage: NextPage = async () => {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return <WalletProvider cookies={cookies}>{<DonationInfo />}</WalletProvider>;
};

export default DonationPage;
