import { Component, inject } from '@angular/core';
import { Supabase } from '../../../services/supabase';
import { JsonPipe } from '@angular/common';
@Component({
    imports: [JsonPipe],
    selector: 'app-namelist',
    styleUrl: './namelist.scss',
    templateUrl: './namelist.html',
})
export class Namelist {
    dbService = inject(Supabase);

    async startapi() {
        await this.dbService.getUsers();
    }
}
