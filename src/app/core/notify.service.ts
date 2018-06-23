import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

/// Notify users about errors and other helpful stuff
export interface Msg {
  title: string;
  body : string;
  cid : string;
  style: string;
}

@Injectable()
export class NotifyService {

  private _msgSource = new Subject<Msg | null>();

  msg = this._msgSource.asObservable();

  update(title: string, body: string , cid: string , style: 'error' | 'info' | 'success') {
    const msg: Msg = { title , body , cid , style };
    this._msgSource.next(msg);
  }

  clear() {
    this._msgSource.next(null);
  }
}
