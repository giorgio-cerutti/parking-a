import { Injectable } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class LibService {
  @BlockUI() blockUI!: NgBlockUI
  constructor() { }

  lockPage = (message: string) => {
    setTimeout(() => {
      console.log(message)
      this.blockUI.start(message);
    })
  }

  unlockPage = () => {
    setTimeout(() => {
      this.blockUI.stop();
    })
  }
}
