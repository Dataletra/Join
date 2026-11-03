import { IUser } from '../../interfaces/iuser';

export class User implements IUser {
    id: number = 0;
    created_at: string = '0000-00-00T00:00:00.000Z';
    name: string = 'Erika Mustermann';
    email: string = 'erika-mustermann@mail.com';
    phone: string | undefined = undefined;
    uid: string | null = null;

    constructor(user: Partial<IUser> | null = {}) {
        this.id = user?.id ?? 0;
        this.created_at = user?.created_at ?? new Date().toISOString();
        this.name = user?.name ?? 'Erika Mustermann';
        this.email = user?.email ?? 'erika-mustermann@mail.com';
        this.phone = user?.phone ?? undefined;
        this.uid = user?.uid ?? null;
    }

    getCleanAddJson() {
        return {
            created_at: this.created_at,
            name: this.name,
            email: this.email,
            phone: this.phone,
            uid: this.uid,
        };
    }
}
