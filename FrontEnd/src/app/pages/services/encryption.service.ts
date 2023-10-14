import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  
  public enCrypt = (id : any) => {
    const enc = window.btoa(`${this.makeid(5)}^${id}^${this.makeid(5)}`);
    return enc;
  };
  public deCrypt = (str : any) => {
    const dec = window.atob(str);
    const data = dec.split("^");
    return data[1];
  };
  private makeid(length : any) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
