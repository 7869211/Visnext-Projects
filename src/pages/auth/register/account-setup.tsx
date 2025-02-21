import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/pages/layouts/AccountSettingLayout';
import Button from '@/components/ui/Button';
import InputWithDropdown from '@/components/ui/InputWithDropdown';
import TextInput from '@/components/ui/TextInput';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const options = [
  'Apple', 'Banana', 'Cherry', 'Grape', 'Mango',
  'Orange', 'Peach', 'Pineapple', 'Strawberry', 'Watermelon',
];

const AccountSetupPage: React.FC = () => {
  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [isPrimaryOwner, setIsPrimaryOwner] = useState(false);

  const handleAccountSetup = () => {
    router.push('/auth/register/create-account');
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <Header />
        <Instructions
          companyName={companyName}
          setCompanyName={setCompanyName}
          companyWebsite={companyWebsite}
          setCompanyWebsite={setCompanyWebsite}
          isPrimaryOwner={isPrimaryOwner}
          setIsPrimaryOwner={setIsPrimaryOwner}
        />
        <AccountSetup handleAccountSetup={handleAccountSetup} />
      </div>
    </Layout>
  );
};

const Header: React.FC = () => (
  <>
    <h1 className="text-2xl font-bold">Tell us about yourself.</h1>
    <p className="text-lg text-gray-700">
      Let’s set up a Gmail account under your organization. Pick a name, any name! ChaseLabs will use this account as your AI Sales Development Representative (SDR) email and calendar connection.
    </p>
  </>
);

interface InstructionsProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  companyWebsite: string;
  setCompanyWebsite: (value: string) => void;
  isPrimaryOwner: boolean;
  setIsPrimaryOwner: (value: boolean) => void;
}

const Instructions: React.FC<InstructionsProps> = ({
  setCompanyName,
  setCompanyWebsite,
  isPrimaryOwner,
  setIsPrimaryOwner,
}) => (
  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <TextInput label="Your Company Name" placeholder="Company name" onChange={setCompanyName} />
    <TextInput label="Your Company Website" placeholder="Website" onChange={setCompanyWebsite} />
    <InputWithDropdown label="Business Type" options={options} placeholder="Select" />
    <div className="col-span-3 flex gap-3 text-[#717D96] items-center">
      <ToggleSwitch enabled={isPrimaryOwner} onToggle={setIsPrimaryOwner} />
      <span>Primary Account Owner (Admin Access)</span>
    </div>
  </div>
);

interface AccountSetupProps {
  handleAccountSetup: () => void;
}

const AccountSetup: React.FC<AccountSetupProps> = ({ handleAccountSetup }) => (
  <div className="py-6">
    <Button width="230px" height="56px" color="DarkGray" text="Setup Account" textColor="white" onClick={handleAccountSetup} />
  </div>
);

export default AccountSetupPage;
