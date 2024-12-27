import { Injectable } from '@angular/core';
import { AccountData } from '../types/accountData';
import { Preloads } from '../types/preloads';
import { WindowNew } from '../types/windowNew';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private preloads: Preloads = (window as unknown as WindowNew).preloads;

  private _isUserLoggedIn: boolean = false;

  get isUserLoggedIn(): boolean {
    return this._isUserLoggedIn;
  }

  async accountExists() {
    return this.preloads.accExists();
  }
  
  async login(loginData: AccountData): Promise<true | Error> {
    const res = await this.preloads.login(loginData);
    this._isUserLoggedIn = res === true ? true : false;
    return res;
  }

  async register(registerData: AccountData): Promise<true | Error> {
    const res = await this.preloads.register(registerData);
    this._isUserLoggedIn = res === true ? true : false;
    return res;
  }

  async logout(): Promise<true | Error> {
    const res = await this.preloads.logout();
    this._isUserLoggedIn = false;
    return res;
  }
}
