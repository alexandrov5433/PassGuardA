import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  async accountExists() {
    return (window as any).preloads.accExists();
  }
}
