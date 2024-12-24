import { Injectable } from "@angular/core";
import { Preloads } from "../types/preloads";
import { WindowNew } from "../types/windowNew";
import { PassGenOptions } from "../types/passwordGenerationOptions";
import { CredentialsData } from "../types/credentialsData";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private preloads: Preloads = (window as unknown as WindowNew).preloads;

    async generateRandomPassword(passGenOptions?: PassGenOptions) {
        return await this.preloads.generatePassword(passGenOptions);
    }

    async getCredentialsOverviewData(): Promise<Array<CredentialsData> | []> {
        return await this.preloads.credOverviewReq();
    }

    async getPasswordInPlaintext(credentialsId: string): Promise<string | Error> {
        return await this.preloads.fetchPassPlainText(credentialsId);
    }
}