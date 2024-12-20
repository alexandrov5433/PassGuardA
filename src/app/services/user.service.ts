import { Injectable } from '@angular/core';
import { AccountData } from '../types/accountData';
import { Preloads } from '../types/preloads';
import { WindowNew } from '../types/windowNew';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private preloads: Preloads = (window as unknown as WindowNew).preloads;

  async accountExists() {
    return this.preloads.accExists();
  }
  
  async login(loginData: AccountData): Promise<true | Error> {
    return this.preloads.login(loginData);
  }

  async register(registerData: AccountData): Promise<true | Error> {
    return this.preloads.register(registerData);
  }

  async logout(): Promise<true | Error> {
    return this.preloads.logout();
  }
}
