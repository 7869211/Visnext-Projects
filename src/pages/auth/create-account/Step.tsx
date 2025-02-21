import dynamic from 'next/dynamic'
import AccountSetupForm from '@/components/create-account/AccountSetupForm';
import AvailableHoursForm from '@/components/create-account/AvailableHoursForm';
import CalendarsForm from '@/components/create-account/CalendarsForm';

const MeetingSoftwareForm = dynamic(
  () => import('@/components/create-account/MeetingSoftwareForm'),
  { ssr: false }
)

interface StepProps {
    stepName: string;
  }

const Step: React.FC<StepProps> = ({ stepName }) => {
  switch (stepName) {
    case 'AccountSetup':
      return <AccountSetupForm />;
    case 'MeetingSoftware':
      return <MeetingSoftwareForm />;
    case 'AvailableHours':
      return <AvailableHoursForm />;
    case 'Calendars':
      return <CalendarsForm />;
    default:
      return null;
  }
};

export default Step;
