export interface ICampaign {
  id?: number;
  name: string;
  email_tracking: boolean;
  auto_pilot: boolean;
  link_tracking: boolean;
  test_mode: boolean;
  meeting_duration: number;
  status: string;
  members: IMember[];
  documents: IDocument[];
  faqs: IFAQ[];
  sequences: ISequences[];
}

export interface IMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  valid_oauth?: boolean;
}

export interface ISequences {
  id?: number;
  position?: number;
  subject: string;
  email_html: string;
  delay_minutes: number;
  isActive: boolean;
  selected: boolean;
}

export interface IDocument {
  id: number;
  filename: string;
  description: string;
  size: string;
  campaign: string;
  isNew?: boolean;
}

export interface IFAQ {
  id: number;
  question: string;
  answer: string;
  campaign: string;
  isNew?: boolean;
}

export const INITIAL_EMAIL: ISequences = {
  position: 0,
  subject: "{{ contact.first_name }}, quick question...",
  email_html: `<p>Hi {{ contact.first_name }},</p><p>My name is {{ bot.first_name }}. How are things at {{ contact.company }} going?</p><p>Have you heard of {{ bot.company }} yet?</p>`,
  delay_minutes: 1,
  isActive: true,
  selected: false,
};

export const INITIAL_MEMBER: IMember = {
  id: 0,
  email: "example@domain.com",
  first_name: "John",
  last_name: "Doe",
  role: "User",
  valid_oauth: false,
};

export const INITIAL_DOCUMENT: IDocument = {
  id: Date.now(),
  filename: "New Document",
  description: "This is a default document description.",
  size: "1MB",
  campaign: "Knowledge Base",
};

export const INITIAL_FAQ: IFAQ = {
  id: Date.now(),
  question: "New FAQ",
  answer: "Please add your FAQ description here.",
  campaign: "Campaign",
};

export const INITIAL_CAMPAIGN: ICampaign = {
  name: "New Campaign Template",
  email_tracking: false,
  auto_pilot: false,
  link_tracking: false,
  test_mode: false,
  meeting_duration: 30,
  status: "PENDING",
  members: [],
  documents: [],
  faqs: [],
  sequences: [
    {
      ...INITIAL_EMAIL,
      selected: true,
    },
  ],
};

export interface ContextualError extends Error {
  context?: string;
}

export interface AvailableHours {
  day: string;
  end: string;
  start: string;
}
export interface WeekDays {
  name: string;
  key: string;
  hoursInterval: HoursInterval[];
  isActive: boolean;
  isEditable: boolean;
}
export interface HoursInterval {
  start: string;
  end: string;
  subInterval?: boolean;
}

export interface Calendar {
  id: string;
  title: string;
  description?: string;
  is_primary: boolean;
  isSelected?: boolean;
  is_included: boolean;
}

export interface MeetingDetails {
  meetingDate: string;
  startTime: string;
  endTime: string;
  selectedUsers: string[];
  allMeetingAttendees: string[];
}
export interface EditorFeatureConfiguration {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  unOrderedList?: boolean;
  alignLeft?: boolean;
  alignCenter?: boolean;
  orderedList?: boolean;
  undo?: boolean;
  redo?: boolean;
  link?: boolean;
}
export interface DropDownOption {
  label: string;
  value?: string;
  icon?: string | React.JSX.Element;

}
