import React from 'react';

import { useRouter } from 'next/router';
import Button from '@/components/ui/Button';
import Layout from '@/pages/layouts/AccountSettingLayout';


const GoogleAuthPage: React.FC = () => {

    const router = useRouter();

    const handleGoogleAuth = () => {
        router.push('/auth/register/account-setup');
    };

    return (
        <Layout>
            <div className="flex flex-col gap-6">
                <div className="text-[40px] font-bold">
                    Welcome to ChaseLabs, Hannah!
                </div>
                <div className="text-[32px]">
                    Before we start, let’s get to know you.
                </div>
                <div className="py-6">
                    <Button
                        width="230px"
                        height="56px"
                        color="DarkGray"
                        text="Let's Get Start!"
                        textColor="white"
                        onClick={() => handleGoogleAuth()}  // Optional click handler
                    />
                </div>
            </div>
        </Layout>
    );
};

export default GoogleAuthPage;
