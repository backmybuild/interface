"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Avatar } from "@components/ui/avatar";
import { Separator } from "@components/ui/separator";
import { Badge } from "@components/ui/badge";
import { NavBar } from "@components/nav";
import {
  Wallet,
  Download,
  Settings,
  Copy,
  ExternalLink,
  Twitter,
  Github,
  Globe,
  Mail,
  Plus,
  Edit3,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { CreatePageModal } from "./create-page-modal";
import { ProfileEditor } from "./profile-editor";
import { NextPage } from "next";

// Mock data - in real app this would come from backend
const mockUser = {
  hasPage: true,
  profile: {
    name: "Alex Chen",
    bio: "Building the future of DeFi. Previously at Uniswap. Passionate about open-source and decentralized finance.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      twitter: "alexchen_dev",
      github: "alexchen",
      website: "https://alexchen.dev",
      email: "alex@example.com",
    },
    pageUrl: "back.crypto/alexchen",
  },
  balance: {
    total: 2.847,
    currency: "ETH",
    usdValue: 8542.15,
    recentDonations: [
      {
        amount: 0.1,
        currency: "ETH",
        timestamp: "2 hours ago",
        anonymous: true,
      },
      {
        amount: 0.25,
        currency: "ETH",
        timestamp: "1 day ago",
        anonymous: false,
        from: "builder_123",
      },
      {
        amount: 0.05,
        currency: "ETH",
        timestamp: "3 days ago",
        anonymous: true,
      },
      {
        amount: 0.5,
        currency: "ETH",
        timestamp: "1 week ago",
        anonymous: false,
        from: "crypto_fan",
      },
    ],
  },
};

// interface AppPageProps {
//   onBackToLanding?: () => void;
// }

const DashboardPage: NextPage = () => {
  const [user] = useState(mockUser);
  const [showCreateModal, setShowCreateModal] = useState(!user.hasPage);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "profile" | "donations"
  >("dashboard");

  const handleWithdraw = () => {
    // Implement withdrawal logic
    console.log("Withdrawing funds...");
  };

  const copyPageUrl = () => {
    navigator.clipboard.writeText(`https://${user.profile.pageUrl}`);
  };

  if (!user.hasPage) {
    return <CreatePageModal onClose={() => setShowCreateModal(false)} />;
  }

  return (
    <div className="min-h-screen">
      <NavBar>
        <div>
          <appkit-button size="sm" />
        </div>
      </NavBar>

      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="p-8 bg-[#baad93] text-black">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className=" mb-2">Total Received</p>
                  <div className="flex items-baseline space-x-3">
                    <span className="text-4xl">{user.balance.total}</span>
                    <span className="text-xl ">
                      {user.balance.currency}
                    </span>
                  </div>
                  <p className=" mt-1">
                    ${user.balance.usdValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="bg-white text-black hover:bg-gray-100 flex-1"
                  onClick={handleWithdraw}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Withdraw Funds
                </Button>
                <Button
                  variant="outline"
                  className="text-black bg-white flex-1"
                  onClick={copyPageUrl}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Page URL
                </Button>
              </div>
            </Card>

            {/* Recent Donations */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">Recent Donations</h3>
                <Badge variant="secondary">
                  {user.balance.recentDonations.length} donations
                </Badge>
              </div>

              <div className="space-y-4">
                {user.balance.recentDonations.map((donation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💎</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {donation.amount} {donation.currency}
                        </p>
                        <p className="text-sm text-gray-600">
                          {donation.anonymous
                            ? "Anonymous"
                            : `From ${donation.from}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {donation.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Your Page</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProfileEditor(true)}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>

              <div className="text-center space-y-4">
                <Avatar className="w-20 h-20 mx-auto">
                  <img src={user.profile.avatar} alt={user.profile.name} />
                </Avatar>
                <div>
                  <h4 className="text-lg">{user.profile.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {user.profile.bio}
                  </p>
                </div>

                <div className="flex justify-center space-x-3">
                  {user.profile.socialLinks.twitter && (
                    <Button variant="outline" size="sm">
                      <Twitter className="h-4 w-4" />
                    </Button>
                  )}
                  {user.profile.socialLinks.github && (
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {user.profile.socialLinks.website && (
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Your Page
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Page Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {showProfileEditor && (
        <ProfileEditor
          profile={user.profile}
          onClose={() => setShowProfileEditor(false)}
          onSave={(updatedProfile) => {
            // Update profile logic
            setShowProfileEditor(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
