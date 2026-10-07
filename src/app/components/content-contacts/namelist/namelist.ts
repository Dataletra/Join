import { Component, inject } from '@angular/core';
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
    }

    sortUsers() {
        if (!this.userList) {
            return;
        }
        this.userList.sort((a, b) => a.name.localeCompare(b.name));
    }
}
