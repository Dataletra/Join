import { computed, inject, Service, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { Session, User } from '@supabase/supabase-js';
import { ContactService } from './contact-service';
import { User as Contact } from '../components/models/user';
import { Toast, ToastType } from './toast';
import { IUser } from '../interfaces/iuser';
import { TrackableNavigate } from './trackable-navigate';
@Service()
export class Authentication {
    client = inject(SupabaseService);
    contactService = inject(ContactService);
    toastService = inject(Toast);
    navService = inject(TrackableNavigate);
    dbService = inject(ContactService);

    readonly initialized = signal<boolean>(false);
    readonly session = signal<Session | null>(null);
    readonly currentUser = signal<IUser | undefined>(undefined);

    readonly isSignedIn = computed<boolean>(() => {
        return false === (null === this.session());
    });

    /**
     * Register onAuthStateChange event, that will never be stopped, as session must be observed all the time.
     * This will update the session and current user.
     */
    constructor() {
        this.client.supabase.auth.onAuthStateChange((event, session) => {
            this.setSession(session);
        });
    }

    /**
     * Sign up a new user, or update existing contact (in case a contact exists but was not signed up).
     * After successfull sign-up, the user still is not logged in.
     * @param name {string} - Name of user. Must be non-empty and should be validated before.
     * @param email {string} - Email of user. Must be non-empty and should be validated before.
     * @param password {string} - Password of user. Must be validated before.
     * @returns {boolean} - true on success, false on failure or already existing user.
     */
    async signUpNewUser(name: string, email: string, password: string): Promise<boolean> {
        if (!name || !email) {
            return false;
        }
        const contact = await this.contactService.getUserByApiEmail(email);
        if (contact && contact.uid) {
            return false;
        }
        const { data, error } = await this.client.signUp.auth.signUp({
            email: email,
            password: password,
        });
        if (!error) {
            await this.createOrEditContact(contact, data.user, name, email);
            this.toastService.showToast('Signed up successfully.', ToastType.signedUp);
        }
        return error ? false : true;
    }

    /**
     * Sign in a user by email.
     * @param email {string} - Email credential to sign in with.
     * @param password {string} - Password credential to sign in with.
     * @returns {boolean} - true on success
     */
    async signInWithEmail(email: string, password: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        this.initialized.set(false);
        const { data, error } = await this.client.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) {
            this.initialized.set(true);
            return false;
        }
        await this.isInitializing();
        return true;
    }

    /**
     * Sign in anonymously (as Guest).
     * @returns {boolean} - true on success
     */
    async signInAnonymously(): Promise<boolean> {
        this.initialized.set(false);
        const { data, error } = await this.client.supabase.auth.signInAnonymously();
        if (error) {
            this.initialized.set(true);
        }
        await this.isInitializing();
        return error ? false : true;
    }

    /**
     * Sign out.
     * @returns {boolean} - true on success
     */
    async signOut(): Promise<boolean> {
        this.initialized.set(false);
        const { error } = await this.client.supabase.auth.signOut();
        if (error) {
            this.initialized.set(true);
        }
        this.navService.goTo('login');
        this.dbService.selectedUserID.set(null);
        await this.isInitializing();
        return error ? false : true;
    }

    /**
     * Create a new user, or update existing contact, if email already exists.
     * This writes the uid into the contact.
     * @param user {User | null} - Supabase User
     * @param name {string} - name of user to be created or updated
     * @param email {string} - email of user to be searched for - then updated or created
     */
    private async createOrEditContact(contact: IUser | null, user: User | null, name: string, email: string) {
        if (null === contact) {
            this.contactService.addUser(new Contact({ name: name, email: email, uid: user?.id }));
            this.toastService.setTypeMatch(ToastType.signedUp);
        } else if (contact && user && contact.uid !== user.id) {
            contact.uid = user.id;
            contact.name = name;
            this.contactService.editUser(new Contact(contact));
            this.toastService.setTypeMatch(ToastType.signedUp);
        }
    }

    /**
     * Sets new session after user was updated. Important to wait for user update, as we otherwise will see Guest
     * temporarily in other signals
     * @param session {Session | null} - supabase auth session
     */
    private async setSession(session: Session | null) {
        await this.udpateUser(session?.user?.id);
        this.session.set(session);
        this.initialized.set(true);
    }

    /**
     * Get the user from API and update currentUser.
     * @param uid {string | undefined} - uid from registered user
     */
    private async udpateUser(uid: string | undefined) {
        const user = uid ? await this.contactService.getUserByApiUid(uid) : undefined;
        this.currentUser.set(user ?? undefined);
    }

    /**
     * Helper method to wait for initialization. When navigating URL through browser, a reload happens so that auth will
     * possibly return false on initialization -> the router canActivateFn will not work properly. So wait.
     */
    async isInitializing(): Promise<void> {
        let escape: boolean = false;
        setTimeout(() => {
            escape = true;
        }, 1000);
        while (!this.initialized() && !escape) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
    }
}
