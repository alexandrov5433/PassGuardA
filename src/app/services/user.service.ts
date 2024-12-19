import { Injectable } from '@angular/core';
import { LoginData } from '../types/loginData';
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
  
  async login(loginData: LoginData): Promise<true | Error> {
    return this.preloads.login(loginData);
  }
}
