import { computed, inject, Service, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { Session, User } from '@supabase/supabase-js';

@Service()
export class Authentication {
    supabase = inject(SupabaseService).supabase;

    readonly session = signal<Session | null>(null);

    readonly user = computed<User | null>(() => {
        return this.session()?.user ?? null;
    });

    readonly isSignedIn = computed<boolean>(() => {
        return false === (null === this.session());
    });

    constructor() {
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('session state changed');

            this.session.set(session);
        });
    }

    async signUpNewUser() {
        const { data, error } = await this.supabase.auth.signUp({
            email: 'svenprimus@gmail.com',
            password: 'example-password',
        });

        if (data) {
            console.log(data);
        }
        if (error) {
            console.log(error);
        }
    }

    async signInWithEmail() {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: 'svenprimus@gmail.com',
            password: 'example-password',
        });

        if (data) {
            console.log(data);
        }
        if (error) {
            console.log(error);
        }
    }

    async signInAnonymously() {
        const { data, error } = await this.supabase.auth.signInAnonymously();

        if (data) {
            console.log(data);
        }
        if (error) {
            console.log(error);
        }
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
            console.log(error);
        } else {
            console.log('Logged out.');
        }
    }
}
