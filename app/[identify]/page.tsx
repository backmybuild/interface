"use server";
import { Metadata, NextPage, ResolvingMetadata } from "next";
import axios from "axios";
import { headers } from "next/headers"; // added
import { DonationInfo } from "./info";
import WalletProvider from "./wallet-provider";

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
    const { data } = await axios.get(
      `https://api.web3.bio/profile/${identify}`
    );
    if (data.error) {
      return {
        title: "Back",
        description: "Everything you are. In one, simple link in bio.",
        icons: {
          icon: "/back-square-logo.png",
        },
      };
    }

    return {
      title: data[0].displayName as string,
      description: data[0].description as string,
      icons: {
        icon: data[0].avatar as string,
      },
    };
  } catch (error) {
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
