import React, { useState } from 'react';
import AuthButton from '@/components/ui/Auth/AuthButton';
import GoogleIcon from '@/assets/images/google.svg';
import MicrosoftIcon from '@/assets/images/microsoft.svg';
import AuthPageLayout from '@/pages/layouts/AuthPageLayout';

const LoginPage: React.FC = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  const actions = (
    <>
      <span className="text-xl">{isLoginPage ? "Sign in below." : "Sign up below."}</span>
      <div className="flex gap-6">
        <AuthButton label={isLoginPage ? "Sign in with Google" : "Sign up with Google"} iconSrc={GoogleIcon} altText="Google Icon" provider="google" />
        <AuthButton label={isLoginPage ? "Sign in with Microsoft" : "Sign up with Microsoft"} iconSrc={MicrosoftIcon} altText="Microsoft Icon" provider="outlook" />
      </div>

      {/* <AuthDivider />      

      <div className="flex flex-col gap-4">
        <AuthInput label="USERNAME" onChange={(value) => setUsername(value)} />
        <AuthInput label="PASSWORD" type="password" onChange={(value) => setPassword(value)} />
      </div>
      
      <Button
        width="100%"
        height="56px"
        color="#A732A7"
        text="Login"
        textColor="white"
        onClick={handleLogin}
      /> */}
    </>
  );

  const bottomText = (
    <>
      {isLoginPage ? "Don't have an account?" : "Already have an account?"}
      <span
        className="text-[#EBC1EB] !font-medium underline underline-offset-2 cursor-pointer"
        onClick={() => setIsLoginPage(!isLoginPage)} // Toggle between login and register
      >
        {isLoginPage ? "Sign up." : "Sign in."}
      </span>
    </>
  );

  return (
    <AuthPageLayout
      title="Welcome!"
      subtitle=" Have an account?"
      actions={actions}
      bottomText={bottomText}
    />
  );
};

export default LoginPage;
