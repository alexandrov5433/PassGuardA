import { Injectable } from "@angular/core";
import { Preloads } from "../types/preloads";
import { WindowNew } from "../types/windowNew";
import { PassGenOptions } from "../types/passwordGenerationOptions";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private preloads: Preloads = (window as unknown as WindowNew).preloads;

    async generateRandomPassword(passGenOptions?: PassGenOptions) {
        return await this.preloads.generatePassword(passGenOptions);
    }
}