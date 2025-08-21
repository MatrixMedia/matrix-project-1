import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMemberDetails } from 'src/app/shared/typedefs/custom.types';
import { StorageService } from 'src/app/shared/services/storage.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  activeMemberDetails!: any;
  addActiveMemberDetails!:any
  current: number = 1;
  total!: number;
  totalData!:number;
  comName!: string;
  constructor(
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService
  ){}
  ngOnInit(): void {
    this.comName = this.storageService.getLocalStorageItem('communityName');
    this.getActiveMemberDetails(this.current);
  }

  getActiveMemberDetails(page:number){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const params = {
      data:{
        id: id,
        page: page,
      }
    }
    this.loaderService.show();
    this.apolloClient.setModule('communityActivePassiveMemberDetails').queryData(params).subscribe((response: GeneralResponse) => {    
      this.loaderService.hide();
      
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.activeMemberDetails = response.data.user;
        console.log(this.activeMemberDetails);
        
        this.addActiveMemberDetails = response.data;
        this.totalData = response.data.totalFamilyMembers;
        if(response.data.totalFamilyMembers !== 0) {
          this.total = Math.ceil(response.data.totalFamilyMembers / 10);
        }else {
          this.total = 0;
        }
      }
    });
  }

  back(){
    this.router.navigateByUrl('active-members');
  }

  track(){
    this.router.navigateByUrl('active-members/track');
  }

  onboardUser(){
    this.router.navigateByUrl('/active-members/passive-users');
  }

  onGoTo(page: number): void {
    this.current = page
    this.getActiveMemberDetails(this.current);
  }

  public onNext(page: number): void {
    this.current = page + 1;
    this.getActiveMemberDetails(this.current);
  }

  public onPrevious(page: number): void {
    this.current = page - 1;
    this.getActiveMemberDetails(this.current);
  }
}
