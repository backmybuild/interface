"use server";
import { Metadata, NextPage, ResolvingMetadata } from "next";
import axios from "axios";
import { DonationInfo } from "./info";

type Props = {
  params: Promise<{ identify: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const generateMetadata = async (
  { params }: Props,
  _: ResolvingMetadata
): Promise<Metadata> => {
  const { identify } = await params;
  const { data } = await axios.get(`https://api.web3.bio/profile/${identify}`);
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
};

const DonationPage: NextPage = () => {
  return <DonationInfo />;
};

export default DonationPage;
