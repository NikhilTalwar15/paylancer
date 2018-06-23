import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AuthService } from '../core/auth.service';

@Injectable()
export class SendNotifyService {

  constructor(public auth: AuthService , public db: AngularFirestore) { }

  sendNotification(title: string , body: string , toWhom: string ,cid: string, url: string){
    var title = title;
    var message = body;
    var today = new Date()
    var notifyObj = {
      title: title,
      message: message,
      uid: toWhom,
      seen: 0,
      time: today,
      url: url,
      cid: cid
    }
    return this.db.collection(`notify`).add(notifyObj);
  }

  sendStatusChangeNotification(cid: string , oldStatus : number , newStatus: number , toWhom: string ,toEmail: string , contract: any){
    var title ="Update Update";
    var message =`This message is a placeholder for oldStatus ${oldStatus} and new status ${newStatus}`;
    var url = "https://dev.paylancer.net/econtract/" + cid;

    if(oldStatus == 0 && newStatus == 1){
      title = "Contract is being Accepted";
      message = "Contract is being accept, Waiting for payment.";
    }
    if(oldStatus == 0 && newStatus == 2){
      title = "Contract is being Edited"; 
      message = "Contract is being edited, Please Review is it.";
    }
    if(oldStatus == 0 && newStatus == 3){
      title = "Contract is being Rejected";
      message = "Contract is being rejected by the Service Consumer";
    } 
    if(oldStatus == 1 && newStatus == 18){
      title = "Contract is being cancalled";
      message = "Contract is being called before the payment by Service Consumer";
    }
    //-----------------
    if(oldStatus == 16 && newStatus == 17){
      title = "Contract Accepted!";
      message = contract.spName + " has accepted your request, proceed to pay.";
    }
    if(oldStatus == 17 && newStatus == 4){
      title = "Payment Done!";
      message = `Payment has been done by ${contract.scName}.`;
    }
    if(oldStatus == 11 && newStatus == 11){
      title = "Contact Canceled!";
      message = `The contract was cancelled by ${contract.scName}.`;
    }
    if(oldStatus == 16 && newStatus == 3){
      title = "Contract Rejected!";
      message = `The contract was rejected by ${contract.spName}.`;
    }
    if(oldStatus == 19 && newStatus == 17){
      title = "Contract Accpeted!";
      message = `${contract.spName} has accepted your request, proceed to pay`;
    }
    if(oldStatus == 17 && newStatus == 3){
      title = "Payment Rejected!";
      message = "The contract has been rejected.";
    } 
     if(oldStatus == 0 && newStatus == 15){
      title = "Contract Accepted!";
      message = "Contract has been accepted, review the Dispute rules.";
    } 
     if(oldStatus == 1 && newStatus == 4){
      title = "Payment Done!";
      message = "Payment has been successfully done.";
    } 
     if(oldStatus == 4 && newStatus == 5){
      title = "Session Started!";
      message = "Session has been started.";
    } 
     if(oldStatus == 5 && newStatus == 6){
      title = "Session End Awaited!";
      message = "Session has been ended, Review it. ";
    } 
     if(oldStatus == 6 && newStatus == 8){
      title = "Session End Confirmed!";
      message = "Payment will be received within 2-3 working days.";
    }
    if(oldStatus == 15 && newStatus == 3){
      title = "Contract Rejected! ";
      message = "The contract has been rejected.";
    }
    if( newStatus == 9){
      title = "Dispute is created";
      message = "Dispute is being created ! Please Review";
    }
    if( oldStatus == 9){
      title = "Dispute is resolved";
      message = "Dispute is being resolved ! Please Review";
    }
    

    console.log(title)
    if(title){
          return this.sendNotification(title,message,toWhom,cid,url);
    }
  }

  sendEmailSMS(userData: any , contract: any) {
    var notifyObj = {
      userData: userData,
      contract: contract
    }
    return this.db.collection('mainNotify').add(notifyObj)
  }

  sendSMS() {

  }

  sendEmail(sub: string, toWhom: string, message: string) {
    var subject = sub;
    var emailObj = {
      subject: subject,
      toWhom: toWhom,
      message: message
    }
    return this.db.collection('sendEmail').add(emailObj);
  }

}
