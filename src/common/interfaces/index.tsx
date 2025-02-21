
// created_at
// : 
// "2025-01-21T16:16:55.161224"
// exchange_id
// : 
// 312
// handle_later
// : 
// false
// id
// : 
// 11
// jobs
// : 
// [{id: 102, human_intervention_id: 11, job: {job_type: "REFERRAL",…},…}]
// reasons : ["Default human intervention."]
// request
// : 
// {context: {campaign_id: 264, documents: [],…},…}


export interface JobRes {
  id: number;
  human_intervention_id: number;
  job: JobObject;
  last_updated: string;

}
export interface JobObject {
  job_type: string;
  referrals: Referral[];
  contact_email: Contactemail;
  // eslint-disable-next-line
  [key: string]: any;
}
interface Contactemail {
  threadId: string;
  inReplyToMessageId: string;
  // eslint-disable-next-line
  references?: any;
  subject: string;
  body: Body;
  from_: From;
  to: From[];
  cc: From[];
  // eslint-disable-next-line
  bcc: any[];
  // eslint-disable-next-line
  attachments: any[];
  messageId: string;
  // eslint-disable-next-line
  date?: any;
  labels: string[];
  starred: boolean;
}
interface Referral {
  contact: Contact;
  email: Email;
}
interface Email {
  threadId: string;
  inReplyToMessageId: string;
  // eslint-disable-next-line
  references?: any;
  subject: string;
  body: Body;
  from_: From;
  to: From[];
  // eslint-disable-next-line
  cc: any[];
  // eslint-disable-next-line
  bcc: any[];
  // eslint-disable-next-line
  attachments: any[];
  messageId: string;
  // eslint-disable-next-line
  date?: any;
  labels: string[];
  starred: boolean;
}

export interface Interventions {
  id: number;
  created_at: string;
  job_types: string[];
  reasons: string[];
  handle_later: boolean;
  isActive?: boolean;
  exchange_id: number;
  jobs: JobRes[];
  request: Request;
  organisation_name?: string;
  organisation_id?: number;
  issues?: Issue[];
}

export interface Issue {
  id: number;
  created_at: string;
  job_types: string[];
  reasons: string[];
  handle_later: boolean;
}

export interface InterventionsDetails {
  request: Request;
  suggested_jobs: SuggestedJob[];
  reasons: string[];
}
export interface SuggestedJob {
  job_type: string;
  follow_up: string;
  // eslint-disable-next-line
  [key: string]: any;
}
export interface Request {
  context: Context;
  bot: Bot;
  contact: Contact;
  users: User[];
}
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  timezone: string;
  meeting_link: string;
  availability: Availability[];
  credentials?: unknown;
}
export interface Availability {
  start: string;
  end: string;
  day: string;
}
export interface Contact {
  timezone: string;
  custom_data: Customdata2;
  email: string;
  first_name: string;
  last_name: string;
  id: number;
  email_address: string;
}
export interface Customdata2 {
  city: string;
  title: string;
  company: string;
  country: string;
  job_function: string;
}
export interface Bot {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  organisation: string;
  credentials?: unknown;
  custom_data: unknown;
  cool_off?: unknown;
  cname_record: Cnamerecord;
}
export interface Cnamerecord {
  alias: string;
  valid_record: boolean;
  valid_ssl: boolean;
}
export interface Context {
  email_chain: Emailchain;
  meeting?: unknown;
  documents: unknown[];
  follow_up: boolean;
  frequently_asked_questions: unknown[];
  meeting_duration: number;
  scheduled_reconnect: boolean;
  campaign_id: number;
  exchange_id: number;
  unsuccessful_delivery: boolean;
  status: number;
  fine_tuning_obj_id?: unknown;
}
export interface Emailchain {
  chain: Chain[];
}
export interface Chain {
  messageId: string;
  threadId: string;
  inReplyToMessageId: string;
  date: string;
  subject: string;
  body: Body;
  from_: From;
  to: From[];
  cc: unknown[];
  bcc: unknown[];
  attachments: unknown[];
  labels: string[];
  starred: boolean;
  job_type?: string;
  // eslint-disable-next-line
  references?: any;
}
export interface From {
  name: string;
  address: string;
}
export interface Body {
  text: string;
  html: string;
}

export interface Job {
  [key: string]: JobTypes;
}
export interface JobTypes {
  key: string;
  value: string;
  id: number;
  type: string;
  isEnabled: boolean;
  title: string;
  valueTwo?: string;
  isButton?: boolean;
}

export interface Recipient {
  email: string;
  firstName?: string;
  lastName?: string;
}
export interface EmailRecipient {
  address: string;
  name: string;
}

export interface DocumentObject {
  description: string;
  id: number;
  filename: string;
  last_updated: string;
  isSelected?: boolean;
}
export interface FaqObject {
  id?: number;

  question?: string;

  directAnswer?: string;

  description?: string;

  files?: FileList | null;
}
