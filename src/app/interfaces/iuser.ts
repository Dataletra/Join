export interface IUser {
    id: number;
    created_at: string;
    name: string;
    email: string;
    phone: string | undefined;
    uid: string | undefined;
}
