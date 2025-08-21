import {  Component, OnInit, Output, EventEmitter} from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Event } from 'src/app/shared/models/events.model';
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


  evetList: Event[] = [];
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
  eventId!: string;

  /**
     * Constructor
     */
  constructor(
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private storageService: StorageService,
    private paramService:paramService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  )
  {

  }

  ngOnInit(): void {
    this.generateSearchForm();
    this.getEventList(this.communityId, this.current);
    
  }

  generateSearchForm() {
    this.filterForm = new FormGroup({
      status: new FormControl('')
    });

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  getEventList(id:any, page : Number){
    const searchData = this.activatedRoute.snapshot.paramMap.get("value") ? this.activatedRoute.snapshot.paramMap.get("value") : ''
    const params:any = {};
    params['data'] = {
      communityId: id,
      page: page,
      // limit: this.limit,
      //eventType: "Past",
      isActive: null
    }

    if(searchData){
      params['data'].search = searchData.trim();
    }
    
    if(this.searchForm.value.search && this.searchForm.value.search!=''){
     params['data'].search = this.searchForm.value.search.trim();
    }
    //console.log(this.filterForm);
   
    if(this.filterForm.value.status && this.filterForm.value.status!=''){
      // if(this.filterForm.value.status === "1"){
      //   params['data'].isActive = true;
      // }
      // else{
      //   params['data'].isActive = false;
      // }

      params['data'].isActive = this.filterForm.value.status;
     }   

    this.loaderService.show();


    this.apolloClient.setModule('getMyCommunityEvents').queryData(params).subscribe((response: GeneralResponse) => {
    
      if(response.error) {
        this.alertService.error(response.message);
        return;
      } else {

        //console.log('-------------', response);
          this.evetList = response.data.events;
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

  public onGoTo(page: number): void {
    this.current = page
    this.getEventList(this.communityId, this.current);
  }

  public onNext(page: number): void {
    this.current = page + 1;
    this.getEventList(this.communityId, this.current);
  }

  public onPrevious(page: number): void {
    this.current = page - 1;
    this.getEventList(this.communityId, this.current);
  }

  public back()
  {
    this.paramService.updatecurrentRoute('/dashboard');
    this.router.navigateByUrl('/dashboard');
  }

  changeStatus(eventId:any,index:any){
    const params:any= {};
    params['myCommunityEventStatusChangeId'] = eventId;

    this.loaderService.show();

    this.apolloClient.setModule('myCommunityEventStatusChange').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        //this.evetList[index].isActive = !this.evetList[index].isActive;
        if(this.evetList[index].isActive === 'active')
        {
           this.evetList[index].isActive = 'inactive';
        }
        else if(this.evetList[index].isActive === 'inactive')
        {
           this.evetList[index].isActive = 'active';
        }
        this.alertService.success(response.message);
      }
    });
  }


  editEvent(eventId:any,status:any)
  {
      if(status === 'past')
      {
            Swal.fire({
              title: 'You cant edit past event',
              text: '',
              icon: 'warning',
              showCancelButton: false,
              // confirmButtonText: 'Ok'
            }).then((result)=>{

              //console.log('================>',result.value);

            })
      }
      else
      {
          this.router.navigateByUrl(`events/edit/${eventId}`);
      }
  }

  deleteEvent(eventId:any,index:any){
    Swal.fire({
      title: 'Are you sure you want to delete this event?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value){
        this.removeRow(eventId, index);
      }
    })
  }

  removeRow(eventId:any,index:any){
    const params:any= {};
    params['myCommunitydeleteEventId'] = eventId;

    this.loaderService.show();
    this.apolloClient.setModule('myCommunitydeleteEvent').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.evetList.splice(index,1);
        this.alertService.success(response.message);
        if(this.evetList.length === 0){
          this.onPrevious(this.current);
        }
        else{
          this.getEventList(this.communityId,this.current);
        }
      }
    });
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

  clearDateFilter() {
    this.filterForm.controls['status'].setValue('');
    this.searchForm.controls['search'].setValue('');
    this.current = 1;
    this.getEventList(this.communityId,this.current);
  }

  displayEventDetail(eventId : string){

    this.eventId = eventId;   

      this.$modal = new window.bootstrap.Modal(
        document.getElementById("displayEvent")
      );
      this.$modal.show();
    
  }

  restrictSpecialCharacter(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32 || (charCode >= 48 && charCode <= 57))
    {
        return true;
    }
    else 
    {
        return false;
    }

      
    
  }

}
