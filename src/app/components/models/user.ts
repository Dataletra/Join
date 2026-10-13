import { IUser } from '../../interfaces/iuser';

export class User implements IUser {
    id: number = 0;
    created_at: string = '0000-00-00T00:00:00.000Z';
    name: string = 'Erika Mustermann';
    email: string = 'erika-mustermann@mail.com';
    phone: string = '+49 1234 112233';
    password: string = '';

    constructor(user: Partial<IUser> = {}) {
        this.id = user.id ?? 0;
        this.created_at = user.created_at ?? new Date().toISOString();
        this.name = user.name ?? 'Erika Mustermann';
        this.email = user.email ?? 'erika-mustermann@mail.com';
        this.phone = user.phone ?? '+49 1234 112233';
        this.password = user.password ?? '';
    }

    getCleanAddJson() {
        return {
            created_at: this.created_at,
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: this.password,
        };
    }
}
