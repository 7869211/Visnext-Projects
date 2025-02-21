import { Datum } from "../models";

export interface FileData extends Datum {
    path: string;
    url: string;
    contentType: string;
    mediaType: MediaTypeData;
    originalName: string;
    urlExpiration: Date;
    reference?: FileReferenceData;
    usage: FileUsageData;
}

export type MediaTypeData = "audio" | "video"| "image"| "document"| "other";

export interface FileReferenceData {
    conversationId?: string;
}

export type FileOperationTypeData = "upload";
export type FileUsageData = "conversationAttachment";

export type FileUploadStatusData = "pending" | "inProgress"| "completed"| "cancelled";


export interface FileOperationData extends Datum {
    operationType: FileOperationTypeData;
    upload?: UploadFileOperationData;
}

export interface UploadFileOperationData {
    name: string;
    contentType: string;
    status: FileUploadStatusData;
    fileId?: string;
    uploadUrl: string;
    uploadUrlExpiration: Date;
    reference?: FileReferenceData;
    usage: FileUsageData;
    mediaType: MediaTypeData;
}

export interface CreateFileOperationRequestData {
    operationType: FileOperationTypeData;
    upload?: CreateUploadFileOperationRequestData;
}

export interface CreateUploadFileOperationRequestData {
    name: string;
    contentType: string;
    reference?: FileReferenceData;
    usage: FileUsageData;
}

export interface UpdateFileOperationRequestData {
    upload?: UpdateUploadFileOperationRequestData;
}

export interface UpdateUploadFileOperationRequestData {
    status: FileUploadStatusData;
}
