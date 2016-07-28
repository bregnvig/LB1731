import { Injectable } from '@angular/core';

@Injectable()
export class LoggerService {

  constructor() { }

  public log(message:any, ...optionalMessages: any[]):void {
    console.log(message, ...optionalMessages);
  }

}
