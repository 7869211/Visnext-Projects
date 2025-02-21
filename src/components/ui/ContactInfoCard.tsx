import { Clock, MapPin, Mail, Building2, User, Briefcase } from "lucide-react";

interface ContactInfoProps {
  name: string;
  location: string;
  timeZone: string;
  email: string;
  company: string;
  jobTitle: string;
}

export function ContactInfoCard({
  name,
  location,
  timeZone,
  email,
  company,
  jobTitle,
}: ContactInfoProps) {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div>
        <h3 className="text-lg font-medium text-black">Contact Information</h3>
      </div>
      <div className="grid gap-6 border-2 rounded-lg mt-4">
        <div className="grid gap-4 p-4 md:grid-cols-2 overflow-hidden break-all">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <User className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-800">{name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <MapPin className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-800">{location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Clock className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Time Zone</p>
                <p className="text-sm font-medium text-gray-800">{timeZone}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Mail className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Building2 className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Company</p>
                <p className="text-sm font-medium text-gray-800">{company}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Briefcase className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="text-sm font-medium text-gray-800">{jobTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
