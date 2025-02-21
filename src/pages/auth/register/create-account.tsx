import React from 'react';
import Layout from '@/pages/layouts/AccountSettingLayout';
import { MdLaunch } from "react-icons/md";
import Link from 'next/link';

const CreateAccount: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <Header />
        <Instructions />
        <NextStep />
      </div>
    </Layout>
  );
};

const Header: React.FC = () => (
  <>
    <h1 className="text-2xl font-bold">Create a new email account.</h1>
    <p className="text-lg text-gray-700">
      Let’s set up a Gmail account under your organization. Pick a name, any name! ChaseLabs will use this account as your AI Sales Development Representative (SDR) email and calendar connection.
    </p>
  </>
);

const Instructions: React.FC = () => (
  <div className="flex flex-row bg-[#EDF0F7] p-4 rounded-md gap-4">
    <div className="flex flex-col gap-1.5">
      <h2 className="text-[18px] font-bold">Google Workspace Setup Instructions</h2>
      <p className="text-sm">
        To get you set up, we’ll guide you through the Google Workspace setup process and other configurations. Don’t worry; we’ve laid out the instructions clearly!
      </p>
    </div>
    <MdLaunch className="text-gray-600 transition-transform w-8 h-6" aria-hidden="true" />
  </div>
);

const NextStep: React.FC = () => (
  <div className="flex bg-[#F7F9FC] rounded p-2 text-[18px] items-center justify-between">
    <span className="font-semibold">
      Already set that up? <span className="font-normal">Great! Proceed to the next step.</span>
    </span>
    <Link href="/auth/register/invite-account" className="text-[#34AFF7] px-5 py-2">
      Next Step
    </Link>
  </div>
);

export default CreateAccount;
