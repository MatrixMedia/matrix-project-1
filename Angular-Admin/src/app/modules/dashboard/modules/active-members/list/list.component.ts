import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMemberList } from 'src/app/shared/typedefs/custom.types';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { paramService } from 'src/app/shared/params/params';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  // activeMemberList!: Array<ActiveMemberList>;
  activeMemberList: any
  communityId!: string;
  searchForm!: FormGroup;
  isSelected:boolean= true;
  current: number = 1;
  total!: number;
  date:any;
  toggleFilter:boolean = false;
  seachFilter:boolean = false;
  totalData!:Number;
  from!: Number;
  to!: Number;
  comName!: string;
  type!: any;
  constructor(
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private datePipe: DatePipe,
    private paramService: paramService
  ){}
  ngOnInit(): void {
    this.communityId = this.storageService.getLocalStorageItem('communtityId');
    this.comName = this.storageService.getLocalStorageItem('communityName');
    this.generateSearchForm();
    this.getActiveMembersList(this.communityId, this.current);
  }

  generateSearchForm() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
      status: new FormControl(''),
      roles: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
  }

  getActiveMembersList(id:any, page : Number){
   this.type = this.activatedRoute.snapshot.paramMap.get("type") ? this.activatedRoute.snapshot.paramMap.get("type") : '';
    const params:any = {};
    params['data'] = {
      communityId: id,
      page: page,
      isTrack: false
      // limit: this.row_limit
    }
    if(this.searchForm.value.search && this.searchForm.value.search!=''){
     params['data'].search = this.searchForm.value.search.trim();
    }
    if(this.searchForm.value.status && this.searchForm.value.status!=''){
      if(this.searchForm.value.status === "1"){
        params['data'].isActiveMember = true;
      }
      else{
        params['data'].isActiveMember = false;
      }
     }
     if(this.searchForm.value.roles && this.searchForm.value.roles!=''){
      params['data'].roles = this.searchForm.value.roles;
     }
     if(this.searchForm.value.startDate!=''){
      if(this.searchForm.value.endDate === '' || null){
        this.alertService.error("End date is missing");
        return;
      }
      // console.log(this.datePipe.transform(this.searchForm.value.startDate,'yyyy-MM-dd'));
      // console.log(this.datePipe.transform(this.searchForm.value.endDate,'yyyy-MM-dd'));
      if(this.datePipe.transform(this.searchForm.value.startDate,'yyyy-MM-dd') === this.datePipe.transform(this.searchForm.value.endDate,'yyyy-MM-dd')){
        this.alertService.error("Start date and end date are not same");
        return;
      }
      params['data'].startDate = this.searchForm.value.startDate;
      params['data'].endDate = this.searchForm.value.endDate;
     }
     if(this.type){
      //console.log("this.type......",this.type);
      params['data'].roles = this.type;
    }
    this.loaderService.show();
    this.apolloClient.setModule('communityActivePassiveMemberList').queryData(params).subscribe((response: GeneralResponse) => {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      } else {
          this.activeMemberList = response.data.members;
          this.totalData = response.data.total;
          this.from = response.data?.from;
          this.to = response.data?.to;
          //this.total = 0;
          if(response.data.total !== 0) {
            this.total = Math.ceil(response.data.total / 10);
          }else {
            this.total = 0;
          }
        }
    });
    this.loaderService.hide();
  }

  onGoTo(page: number): void {
    this.current = page
    this.getActiveMembersList(this.communityId, this.current);
  }

  public onNext(page: number): void {
    this.current = page + 1;
    this.getActiveMembersList(this.communityId, this.current);
  }

  public onPrevious(page: number): void {
    this.current = page - 1;
    this.getActiveMembersList(this.communityId, this.current);
  }

  viewDetails(id:any){
    this.router.navigateByUrl('active-members/view/'+id);
  }

  changeStatus(memberId:any,index:any){
    const params:any= {};
    params['data'] = {
      communityId : this.communityId,
      memberId : memberId
    }
    this.loaderService.show();
    this.apolloClient.setModule('communityMemberStatusChange').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      // console.log("response......",response);
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.alertService.success(response.message);
        //console.log("isActive.....",this.activeMemberList[index].members.isActive);
        this.activeMemberList[index].members.isActive = this.activeMemberList[index].members.isActive === false ?  true : false
        //this.activeMemberList.splice(index,1);
      }
    });
  }

  deleteMember(memberId:any,index:any){
    Swal.fire({
      title: 'Are you sure you want to delete this member?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value){
        this.removeRow(memberId, index);
      }
    })
  }

  removeRow(memberId:any,index:any){
    const params:any= {};
    params['data'] = {
      communityId : this.communityId,
      memberId : memberId
    }
    this.loaderService.show();
    this.apolloClient.setModule('deleteCommunityMember').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.alertService.success(response.message);
        this.activeMemberList.splice(index,1);
        if(this.activeMemberList.length === 0){
          this.onPrevious(this.current);
        }
        else{
          this.getActiveMembersList(this.communityId,this.current);
        }
        
      }
    });
  }

  // clear(): void {
  //   this.searchForm.controls['search'].setValue('');
  //   this.getActiveMembersList(this.communityId,1);
  // }

  clearDateFilter() {
    this.searchForm.controls['status'].setValue('');
    this.searchForm.controls['roles'].setValue('');
    this.searchForm.controls['search'].setValue('');
    this.searchForm.controls['startDate'].setValue('');
    this.searchForm.controls['endDate'].setValue('');
    // this.toggleFilter = false;
    // this.seachFilter = false;
    this.getActiveMembersList(this.communityId,1);
  }

  toggle(){
    if( this.toggleFilter === false){
      this.clearDateFilter();
      this.seachFilter = false;
      this.toggleFilter = true;
    }
    else{
      this.toggleFilter = false;
    }
  }

  toggleSearch(){
    if( this.seachFilter === false){
      this.clearDateFilter()
      this.toggleFilter = false;
      this.seachFilter = true;
    }
    else{
      this.seachFilter = false;
    }
  }

  track(){
    this.router.navigateByUrl('/active-members/track');
  }

  onboardUser(){
    this.paramService.updatecurrentRoute('/active-members/passive-users');
    this.router.navigateByUrl('/active-members/passive-users');
  }

  back(){
    this.paramService.updatecurrentRoute('/dashboard');
    this.router.navigateByUrl('/dashboard');
  }
}
