import React from 'react';
import Layout from '@/pages/layouts/AccountSettingLayout';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const InviteAccount: React.FC = () => {
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
    <h1 className="text-2xl font-bold">Invite your new ‘employee’.</h1>
    <p className="text-lg text-gray-700">
        Now that you created a Gmail account, let’s get it up and running by inviting it. Once you hit ‘invite’, your new account will be ready to go! You will have an opportunity to add more accounts later.
    </p>
  </>
);

const Instructions: React.FC = () => (
  <div className="flex flex-row py-6">
    <Button width="100%" height="56px" color="Gray" text="Connect to Google" textColor="#2D3648" />
  </div>
);

const NextStep: React.FC = () => (
  <div className="flex bg-[#F7F9FC] rounded p-2 text-[18px] items-center justify-between">
    <span className="font-semibold">
      Not ready? <span className="font-normal">No worries, you can add anytime.</span>
    </span>
    <Link href="/app/organisation-settings" className="text-[#34AFF7] px-5 py-2">
      Skip Setup
    </Link>
  </div>
);

export default InviteAccount;
