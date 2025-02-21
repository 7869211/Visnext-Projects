import React, { useEffect, useMemo, useState } from 'react';
import Input from '@/components/ui/Input';
import EmailItem from '@/components/ui/campaign/EmailItem';
import Editor from '@/components/ui/RichText/editor';
import useCampaignStore from '@/store/campaignStore';

import { FaClone } from "react-icons/fa";
import { FaEyeSlash, FaTrash, FaEye } from "react-icons/fa6";
import apiClient from '@/services/apiClient';
import { debounce } from 'lodash'
import useUserStore from '@/store/userStore';

function useDebounce<Args extends unknown[], R>(
    callback: (...args: Args) => R,
    delay: number
): (...args: Args) => void {
    const debouncedFn = useMemo(() => {
        return debounce((...args: Args) => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    useEffect(() => {
        return () => {
            debouncedFn.cancel();
        };
    }, [debouncedFn]);

    return debouncedFn;
}

const EmailPage: React.FC = () => {
    const { campaign, setEmails } = useCampaignStore();
    const { user } = useUserStore();

    const organisationId = user?.organisations[1]?.id;

    const [selectedEmailId, setSelectedEmailId] = useState<number | null>(campaign?.sequences[0]?.id || null);
    
    const selectedEmail = campaign?.sequences.find((email) => email.id === selectedEmailId) ?? null;
    const [localSubject, setLocalSubject] = useState(selectedEmail?.subject || '');
    
    useEffect(() => {
        setLocalSubject(selectedEmail?.subject || '');
      }, [selectedEmail]);

    const handleUpdateSelectedEmail = async (key: 'subject' | 'email_html', value: string) => {
        if (selectedEmail && campaign) {
            const endpoint =
                key === 'subject'
                    ? `/organisations/${organisationId}/campaigns/${campaign.id}/sequences/${selectedEmail.id}/subject`
                    : `/organisations/${organisationId}/campaigns/${campaign.id}/sequences/${selectedEmail.id}/email-html`;

            try {
                await apiClient.put(endpoint, { [key]: value });
                const updatedEmails = campaign.sequences.map((email) =>
                    email.id === selectedEmail.id
                        ? { ...email, [key]: value }
                        : email
                );
                setEmails(updatedEmails);
            } catch (error) {
                console.error(`Error updating ${key}:`, error);
                setEmails(campaign.sequences);
            }
        }
    };

    const debouncedUpdateSelectedEmail = useDebounce(handleUpdateSelectedEmail, 1000);

    const handleLocalSubjectChange = (value: string) => {
        setLocalSubject(value);
        if (selectedEmailId !== null) {
            debouncedUpdateSelectedEmail('subject', value);
        }
    };

    const handleEmailHtmlChange = (value: string) => {
        if (selectedEmailId !== null) {
            debouncedUpdateSelectedEmail('email_html', value);
        }
    };


    const handleSelectEmail = (id: number) => {
        setSelectedEmailId(id);
    };

    const handleDayChange = async (id: number, newDay: number) => {
        try {
            await apiClient.put(
                `/organisations/${organisationId}/campaigns/${campaign.id}/sequences/${id}/delay`,
                {
                    delay_minutes: newDay
                }
            );
            const updatedEmails = campaign?.sequences.map((email) =>
                email.id === id ? { ...email, delay_minutes: newDay } : email
            );
            setEmails(updatedEmails);
        } catch (error) {
            console.error("Error toggling FAQ selection:", error);
        }
    };

    const handleActiveChange = (id: number) => {
        const updatedEmails = campaign?.sequences.map((email) =>
            email.id === id ? { ...email, isActive: !email.isActive } : email
        );
        setEmails(updatedEmails);
    };

    const handleDelete = (id: number) => {
        const updatedEmails = campaign?.sequences.filter((email) => email.id !== id);
        setEmails(updatedEmails);

        if (id === selectedEmailId) {
            setSelectedEmailId(updatedEmails.length > 0 ? updatedEmails[0].id! : null);
        }
    };

    return (
        <div className="flex gap-6 h-full">
            <div className="flex-1 flex flex-col border rounded-lg py-6 min-h-full bg-white">
                <div className="flex justify-between mb-[9px] px-6">
                    <span className="text-[#30343E]">Email {selectedEmail?.position || 0 + 1}</span>
                    {selectedEmail?.id && <div className="flex flex-row items-center text-[#8C268C]">
                        <button className="w-9 h-9 justify-items-center">
                            <FaClone className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 justify-items-center"
                            onClick={() => handleActiveChange(selectedEmail?.id || 0)}
                        >
                            {selectedEmail?.isActive ? <FaEye className="w-4 h-4" /> : <FaEyeSlash className="w-4 h-4" />}
                        </button>
                        <button className="w-9 h-9 justify-items-center"
                            onClick={() => handleDelete(selectedEmail?.id || 0)}
                        >
                            <FaTrash className="w-4 h-4" />
                        </button>
                    </div>}
                </div>
                <div className="py-3 px-6">
                    <Input
                        label="SUBJECT"
                        value={localSubject}
                        onChange={handleLocalSubjectChange}
                    />
                </div>
                <Editor
                    content={selectedEmail?.email_html || ""}
                    onChange={handleEmailHtmlChange}
                    editorFeaturesFlages={{
                        bold: true,
                        italic: true,
                        unOrderedList: true,
                        link: true,
                      }}
                />
            </div>

            <div className="flex-none flex flex-col w-[202px] gap-2 h-full overflow-y-auto overflow-hidden">
                {campaign?.sequences.map((email, index) => (
                    <EmailItem
                        key={index}
                        id={email.id!}
                        position={email.position!}
                        day={email.delay_minutes}
                        title={email.subject}
                        selected={email.id === selectedEmailId}
                        onDayChange={handleDayChange}
                        onClick={() => handleSelectEmail(email.id!)}
                    />
                ))}
            </div>
        </div>
    );
};

export default EmailPage;
