import { EventEmitter, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  callBindFunction = new EventEmitter();
  subsVar: Subscription;

  constructor() { }

  onSelectGridRecord(id: number) {
    this.callBindFunction.emit(id);
  }
}
