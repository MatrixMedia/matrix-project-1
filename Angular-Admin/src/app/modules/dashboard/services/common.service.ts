import { Injectable } from '@angular/core';
import { log } from 'console';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private obj = new BehaviorSubject<string | null>(null);
  private val = this.obj.asObservable();
  private imgObj = new BehaviorSubject<string | null>(null);
  private imgVal = this.imgObj.asObservable();
  private booleanObj= new BehaviorSubject<boolean | null>(null); 
  private booleanVal = this.booleanObj.asObservable();
  private sendObj = new BehaviorSubject(null);
  private getObj = this.sendObj.asObservable();
  private sendSubject = new Subject();
  private getSubject = this.sendSubject.asObservable();
  constructor(
    private StorageService: StorageService,
  ) { }

  sendValue(value:string){
    this.obj.next(value);
  }

  getValue(){
    return this.val;
  }

  send(){
    this.sendSubject.next("");
  }

  get(){
    return this.getSubject;
  }

  sendData(value:any){
    //console.log("value.............",value);
    this.sendObj.next(value);
  }

  getData(){
    return this.getObj;
  }

  sendBooleanValue(value:any){
    //console.log("value from home tab.....",value);
    this.booleanObj.next(value);
  }

  getBooleanValue(){
    //console.log("hiiii"); 
    return this.booleanVal;
  }

  sendImage(data:string){
    if(data === null || data === "" || data === undefined){
      this.StorageService.setLocalStorageItem('communitylogo','assets/images/header-user.png')
    }
    else{
      this.StorageService.setLocalStorageItem('communitylogo',data)
    }
   
    this.imgObj.next(data)
  }
  getImage(){
    return this.imgVal;
  }


}
