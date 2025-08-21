import {  Component, OnInit, Output, EventEmitter} from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Group } from 'src/app/shared/models/groups.model';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { paramService } from 'src/app/shared/params/params';
import { ActivatedRoute, Router } from '@angular/router';

declare var window:any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit  {

  groupList: Group[] = [];
  communityId: string = this.storageService.getLocalStorageItem('communtityId');
  current: number = 1;
  limit: number = 10;
  totalPageNo!: number;
  totalData!:Number;
  from!: Number;
  to!: Number;
  searchForm!: FormGroup;
  filterForm!: FormGroup;
  seachFilter:boolean = false;
  toggleFilter:boolean = false;

  $modal: any;
  groupId!: string;
  @Output() updategroupId: EventEmitter<string> = new EventEmitter<string>();
  

  /**
     * Constructor
     */
  constructor(
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    //private authService: AuthService,
    //private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private paramService:paramService,
    private router: Router,
    //private datePipe: DatePipe
  )
  {

  }

  ngOnInit(): void {    
    this.generateSearchForm();
    this.getGroupList(this.communityId, this.current);
  }

  generateSearchForm() {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      status: new FormControl('')
    });
  }


  getGroupList(id:any, page : Number){
    const searchData = this.activatedRoute.snapshot.paramMap.get("value") ? this.activatedRoute.snapshot.paramMap.get("value") : '';
    const params:any = {};
    params['data'] = {
      communityId: id,
      page: page,
      limit: this.limit,
      isActive: null
    }

    if(searchData){
      params['data'].search = searchData.trim();
    }
    
    if(this.searchForm.value.search && this.searchForm.value.search!=''){
     params['data'].search = this.searchForm.value.search.trim();
    }

   
    if(this.filterForm.value.status && this.filterForm.value.status!=''){
      if(this.filterForm.value.status === "1"){
        params['data'].isActive = true;
      }
      else{
        params['data'].isActive = false;
      }
     }   

    this.loaderService.show();


    this.apolloClient.setModule('getMyCommunityGroup').queryData(params).subscribe((response: GeneralResponse) => {
    
      if(response.error) {
        this.alertService.error(response.message);
        return;
      } else {
        //console.log('-------------', response);
          this.groupList = response.data.groups;
          this.totalData = response.data.total;
          this.from = response.data?.from;
          this.to = response.data?.to;
          
          if(response.data.total !== 0) {
            this.totalPageNo = Math.ceil(response.data.total / this.limit);
          }else {
            this.totalPageNo = 0;
          }     
        }
    });

    this.loaderService.hide();



  }

  changeStatus(groupId:any,index:any){
    const params:any= {};
    params['groupStatusChangeId'] = groupId;

    this.loaderService.show();

    this.apolloClient.setModule('groupStatusChange').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.groupList[index].isActive = !this.groupList[index].isActive;
        this.alertService.success(response.message);
      }
    });
  }

  deleteGroup(groupId:any,index:any){
    Swal.fire({
      title: 'Are you sure you want to delete this group?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value){
        this.removeRow(groupId, index);
      }
    })
  }


  removeRow(groupId:any,index:any){
    const params:any= {};
    params['data'] = {
      id : groupId
    }
    this.loaderService.show();
    this.apolloClient.setModule('deleteMyCommunityGroup').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.groupList.splice(index,1);
        this.alertService.success(response.message);
        if(this.groupList.length === 0){
          this.onPrevious(this.current)
        }
      }
    });
  }

  onGoTo(page: number): void {
    this.current = page
    this.getGroupList(this.communityId, this.current);
  }

  public onNext(page: number): void {
    this.current = page + 1;
    this.getGroupList(this.communityId, this.current);
  }

  public onPrevious(page: number): void {
    this.current = page - 1;
    this.getGroupList(this.communityId, this.current);
  }

  clearDateFilter() {
    this.filterForm.controls['status'].setValue('');
    this.searchForm.controls['search'].setValue('');
    this.current = 1;
    this.getGroupList(this.communityId,this.current);
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

  back()
  {
    this.paramService.updatecurrentRoute('/dashboard');
    this.router.navigateByUrl('/dashboard');
  }


  displayGroupDEtail(groupId : string){

    this.groupId = groupId;   console.log('parent : ', this.groupId);
     // this.updategroupId.emit(groupId);

      this.$modal = new window.bootstrap.Modal(
        document.getElementById("displayGroup")
      );
      this.$modal.show();
    
  }


}
