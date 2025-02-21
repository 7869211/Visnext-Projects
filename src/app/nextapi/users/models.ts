import { Datum } from "../models";

export interface UserInfoData extends Datum {
    lastName?: string;
    firstName?: string;
    imageUrl?: string;
}
