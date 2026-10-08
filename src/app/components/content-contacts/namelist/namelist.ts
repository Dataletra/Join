import { Component, computed, inject } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { JsonPipe } from '@angular/common';
import { IUser } from '../../../interfaces/iuser';
@Component({
    imports: [JsonPipe],
    selector: 'app-namelist',
    styleUrl: './namelist.scss',
    templateUrl: './namelist.html',
})
export class Namelist {
    dbService = inject(Supabase);
    userList: IUser[] | null = [];

    async startapi() {
        await this.dbService.getUsers();
        this.userList = this.dbService.users();
        console.log(this.userList);
        this.sortUsers();
        console.warn(this.groupedUsers());
    }

    sortUsers() {
        if (!this.userList) {
            return;
        }
        this.userList.sort((a, b) => a.name.localeCompare(b.name));
    }

    groupedUsers = () => {
        if (!this.userList) {
            return;
        }

        const userMap = new Map<string, IUser[]>();
        for (const user of this.userList) {
            const firstLetter = user.name.charAt(0).toUpperCase();
            if (!userMap.has(firstLetter)) {
                userMap.set(firstLetter, []);
            }
            userMap.get(firstLetter)?.push(user);
        }
        return userMap.entries();
    };
}
