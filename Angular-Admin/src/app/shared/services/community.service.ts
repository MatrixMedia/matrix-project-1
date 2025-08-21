import { Injectable, OnInit } from '@angular/core';
import { User } from '../typedefs/custom.types';
import { StorageService } from './storage.service';
import { LoaderService } from './loader.service';
import { ApolloClientService } from './apollo-client.service';
import { AlertService } from './alert.service';
import {Router} from "@angular/router";
import { GeneralResponse } from '../interfaces/general-response.ineterface';

@Injectable({
  providedIn: 'root'
})
export class CommunityService implements OnInit {

  constructor(
    private storage: StorageService,
    private loader: LoaderService,
    private apollo: ApolloClientService,
    private alertService: AlertService,
    private router: Router
  ) { }


  ngOnInit(): void {
    
  }
  
  switchCommunity(id:any){
    const data = {
      data: {
        id: id
      }
    };
    this.loader.show();
    this.apollo.setModule("switchOrganiztionPortal").mutateData(data)
      .subscribe((response:GeneralResponse) => {
        //console.log("response.........",response);
        
        if(response.error) {
          // Sow toaster
          this.alertService.error(response.message);
        } else {
          this.setToken(id);
          this.alertService.success(response.message);
          this.router.navigate(["/dashboard"]);
        }
      });
      this.loader.hide();
  }

  private setToken(token:string) {
    this.storage.setLocalStorageItem("communtityId", token);
  }
}
