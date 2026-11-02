import { computed, inject, Service, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { Session, User } from '@supabase/supabase-js';
import { ContactService } from './contact-service';
import { User as Contact } from '../components/models/user';

@Service()
export class Authentication {
    supabase = inject(SupabaseService).supabase;
    contactService = inject(ContactService);

    readonly session = signal<Session | null>(null);

    readonly user = computed<User | null>(() => {
        return this.session()?.user ?? null;
    });

    readonly isSignedIn = computed<boolean>(() => {
        return false === (null === this.session());
    });

    constructor() {
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.session.set(session);
        });
    }

    async signUpNewUser(name: string, email: string, password: string): Promise<boolean> {
        if (!name || !email) {
            return false;
        }
        const { data, error } = await this.supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (null === error) {
            const existsContact = await this.contactService.getUserByEmail(email);
            if (null === existsContact) {
                this.contactService.addUser(new Contact({ name: name, email: email, uid: data.user?.id }));
                console.log('added contact on signup');
            }
        }
        return error ? false : true;
    }

    async signInWithEmail(email: string, password: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (!error) {
            const existsContact = await this.contactService.getUserByEmail(email);
            if (existsContact && data.user && existsContact.uid !== data.user.id) {
                console.log('updated uid on signup');
                existsContact.uid = data.user.id;
                this.contactService.editUser(new Contact(existsContact));
            } else {
                console.log('success, but nothing to edit');
            }
        }
        return error ? false : true;
    }

    async signInAnonymously(): Promise<boolean> {
        const { data, error } = await this.supabase.auth.signInAnonymously();
        return error ? false : true;
    }

    async signOut(): Promise<boolean> {
        const { error } = await this.supabase.auth.signOut();
        return error ? false : true;
    }
}
