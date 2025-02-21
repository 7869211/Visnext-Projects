import { Megaphone, BotMessageSquare, Mail } from "lucide-react";

interface AiSdrProps {
  name: string;
  email: string;
  campaignName: string;
}

export function AiSdrDetailsCard({ name, email, campaignName }: AiSdrProps) {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-lg font-medium text-black">AI SDR Details</h3>
      </div>
      <div className="grid gap-6 rounded-lg border-2 mt-4">
        <div className="grid gap-4 p-4 md:grid-cols-2 overflow-hidden break-all">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <BotMessageSquare className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-sm font-medium text-gray-800">{name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg">
                <Megaphone className="h-5 w-5 text-[#8C268C]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Campaign Name</p>
                <p className="text-sm font-medium text-gray-800">
                  {campaignName}
                </p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
