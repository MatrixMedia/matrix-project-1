import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { Supplier } from 'src/app/shared/models/supplier-list.model';
import {acceptRejectSupplier} from 'src/app/shared/models/accept-reject-supplier.model'
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import {supplierCountResult} from 'src/app/shared/models/supplier-count-details.modal';
declare var window:any;
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,OnDestroy {
  private eventIdSubscriber!: Subscription;
  private getSupplierSubscriber!: Subscription;
  private volunteeredSaveSubscriber!: Subscription;
  private getAcceptRejectDetailsSubscriber!: Subscription;
  private deleteSupplierSubscriber!: Subscription;
  private eventDetailsSubscriber!: Subscription;
  private getUserSubscriber!: Subscription;
  private deleteSubscriber!: Subscription;
  private saveMemberSubscriber!: Subscription;
  private doneSubscriber!: Subscription;
  private countingSubscriber!: Subscription;

  $modal: any;
  $taskModal: any;
  $taskIdModal: any;
  $supplierModal: any;
  eventId: any;
  getSupplierDetails: Supplier[] = [];
  getPreviousSupplierDetails: any;
  current: number = 1;
  limit: number = 10;
  totalPageNo!: number;
  totalData!:Number;
  from!: Number;
  to!: Number;
  getAssignMembersDetails:any = [];
  volunteerCount: number = 0;
  countIndex:any = [];
  getAcceptRejectDetails: acceptRejectSupplier[] = [];
  getSupplierId: any;
  isAccepted: boolean = false;
  seachFilter: boolean = false;
  toggleFilter:boolean = false;
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  isAssignDisabled: boolean = false;
  supplierIdVal: any;
  eventData: any;
  typeVal!:string;
  getUserData: any;
  assignData: any = [];
  isSave: boolean = false;
  getVolunteeredValue: any;
  getPreviousData:any;
  supplierId: any;
  getSupplierValue: any;
  getCountData: supplierCountResult = {};

  constructor(
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private StorageService: StorageService,
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,

  ){}

  ngOnInit(): void {
    this.eventIdSubscriber = this.activatedRoute.paramMap.subscribe({
      next: params=>{
        this.eventId = params.get('id');
      },
      error: err=>{}
    });
    if(this.eventId){
      this.getList(this.current);
    }
    this.generateSearchForm();
    this.getCountingValue();
  }

  ngOnDestroy(): void {
    if(this.eventIdSubscriber){
      this.eventIdSubscriber.unsubscribe();
    }
    if(this.getSupplierSubscriber){
      this.getSupplierSubscriber.unsubscribe();
    }
    if(this.volunteeredSaveSubscriber){
      this.volunteeredSaveSubscriber.unsubscribe();
    }
    if(this.deleteSupplierSubscriber){
      this.deleteSupplierSubscriber.unsubscribe();
    }
    if(this.getAcceptRejectDetailsSubscriber){
      this.getAcceptRejectDetailsSubscriber.unsubscribe();
    }
    if(this.eventDetailsSubscriber){
      this.eventDetailsSubscriber.unsubscribe();
    }
    if(this.getUserSubscriber){
      this.getUserSubscriber.unsubscribe();
    }
    if(this.deleteSubscriber){
      this.getUserSubscriber.unsubscribe();
    }
    if(this.saveMemberSubscriber){
      this.saveMemberSubscriber.unsubscribe();
    }
    if(this.doneSubscriber){
      this.doneSubscriber.unsubscribe();
    }
    if(this.countingSubscriber){
      this.countingSubscriber.unsubscribe()
    }
  }

  ngAfterViewInit(): void {
    $('#taskAdd_modal').on('hidden.bs.modal', () => {
     this.typeVal = "";
    });

    $('#assignMemberListModal').on('hidden.bs.modal', () => {
      this.typeVal = "";
     });
  }

  /**Using for declare the search form */
  generateSearchForm(){
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      status: new FormControl('')
    });
  }

  /**Using for search Toggle */
  searchToggle(){
    if(!this.seachFilter){
      this.toggleFilter = false;
      this.seachFilter = true;
      this.clear();
    }
    else{
      this.seachFilter = false;
    }
  }

  /**Using toggle for filter */
  filterToggle(){
    if(!this.toggleFilter){
      this.toggleFilter = true;
      this.seachFilter = false;
      this.clear();
    }
    else{
      this.toggleFilter = false;
    }
  }

  /**Using for clear search data */
  clear(){
    this.searchForm.controls['search'].setValue('');
    this.getList(this.current);
  }

  /** task add modal " + Assign Member " button click -- modal open  */
  taskIdModal(){
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("taskId_modal")
    );
    this.$modal.show();
  }

  /**Using for modal open assign mebers list*/
  assignMembersModal(members:[]){
    this.getAssignMembersDetails = members
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("assignMemberModal")
    );
    this.$modal.show();
  }

 /**Using for get the supplier management list */
 getList(page:number){
  const searchData = this.activatedRoute.snapshot.paramMap.get("value") ? this.activatedRoute.snapshot.paramMap.get("value") : '';
  const params:any = {};
  params['data'] = {
    eventId: this.eventId,
    page: page,
  }
  // if(searchData){
  //   params['data'].search = searchData.trim();
  // }
  if(this.searchForm?.value.search && this.searchForm?.value.search!=''){
    params['data'].search = this.searchForm?.value.search.trim();
  }
  if(this.filterForm?.value.status && this.filterForm?.value.status!=''){
    if(this.filterForm.value.status === "1"){
      params['data'].isDone = true;
    }
    else{
      params['data'].isDone = false;
    }
  }
  this.loaderService.show();
  this.getSupplierSubscriber = this.apolloClient.setModule('getAllEventSupplierManagement').queryData(params).subscribe({
    next: (response: GeneralResponse)=> {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      }
      else{
        this.getSupplierDetails = response.data?.orders;          
        this.getSupplierDetails.forEach((element:any,index:number)=> {
          element.isDonee = false;
          element.previous = element.alreadyTaken
        });
        this.totalData = response.data?.total;
        this.from = response.data?.from;
        this.to = response.data?.to;
        if(response.data.total !== 0) {
          this.totalPageNo = Math.ceil(response.data.total / this.limit);
        }else {
          this.totalPageNo = 0;
        }
      }
    },
    error: err=> {
      console.log(err);

    }
  })
  this.loaderService.hide();
 }

/**Using for save volunteered data*/
 saveVolunteerData(value:any,id:any,quantity:any){
  if(value > quantity){
    this.alertService.error("Quaintity limit exceeded!");
    return;
  }
  if(value < 0){
    this.alertService.error("Negative number is not allowed!");
    return;
  }
  
  this.getVolunteeredValue = value;
  this.hasCompleted(id,1);
 }

 /**Using for save previous volunteered data*/
 savePreviousVolunteerData(id:any,i:any){
  this.getVolunteeredValue = this.getSupplierDetails[i].previous;
  this.hasCompleted(id,2);
 }

 /**Using for volunteered count increment*/
 countIncrement(index:any,id:any){

  console.log(this.getSupplierDetails[index].alreadyTaken);
  
    let temp: any = this.getSupplierDetails[index].alreadyTaken;
    this.getSupplierDetails[index].alreadyTaken = temp + 1;
    if(this.getSupplierDetails[index].alreadyTaken === this.getSupplierDetails[index].quantity){
      Swal.fire({
        title: 'Are you sure you want to Submit this Volunteered?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.value){
          this.getSupplierDetails[index].isDonee = true;
          this.getVolunteeredValue = this.getSupplierDetails[index].alreadyTaken;
          this.hasCompleted(id,1);
        }
      })
    }
 }

 /**Using for volunteered count decrement*/
 countDecrement(index:any,id:any){
    let temp: any = this.getSupplierDetails[index].alreadyTaken;
    this.getSupplierDetails[index].alreadyTaken = temp - 1;
    if(this.getSupplierDetails[index].alreadyTaken === this.getSupplierDetails[index].quantity){
      Swal.fire({
        title: 'Are you sure you want to Submit this Volunteered?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if(result.value){
          this.getSupplierDetails[index].isDonee = true;
          this.getVolunteeredValue = this.getSupplierDetails[index].alreadyTaken;
          this.hasCompleted(id,2);
        }
      })
    }
    else{
      this.getSupplierDetails[index].isDonee = false
    }
  }

  /**Using for save total volunteered count*/
    saveVolunteeredCount(finalCountValue:any,supplierId:any){
      const params:any={};
      params['data']={
        supplierId: supplierId,
        status: "Accepted",
        quantity: finalCountValue
      }
      this.loaderService.show();
      this.volunteeredSaveSubscriber = this.apolloClient.setModule('acceptOrRejectSupplierManagement').mutateData(params).subscribe({
        next:(response: GeneralResponse)=>{
          if(response.error){
            this.loaderService.hide();
            this.alertService.error(response.message);
          }
          else{
            this.loaderService.hide();
            this.alertService.error(response.message);
          }
        },
        error: err =>{
          console.log(err);        
        }
      })
      this.loaderService.hide();
    }

 /**Using for get the supplier accepted or rejected list */
  getAcceptedRejectedList(supplierId:any,getStatus:any){
    if(getStatus === 'Accepted'){
      this.isAccepted = true;
    }
    else{
      this.isAccepted = false;
    }
    const params:any = {};
    params['data'] = {
      supplierId: supplierId,
      status: getStatus ? getStatus : "Accepted",
    }
    this.loaderService.show();
    this.getAcceptRejectDetailsSubscriber = this.apolloClient.setModule('acceptOrRejectSupplierUserList').queryData(params).subscribe({
      next: (response: GeneralResponse)=> {
        if(response.error) {
          this.alertService.error(response.message);
          return;
        }
        else{
          this.getAcceptRejectDetails = response.data;
        }
      },
      error: err=> {
        console.log(err);

      }
    })
    this.loaderService.hide();
 }

  /** Log modal -- button click -- modal open */
  taskLogModal(supplierId:any){
    this.getSupplierId = supplierId;
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("logsModal")
    );
    this.$modal.show();
    this.getAcceptedRejectedList(supplierId,"Accepted");
  }

    /**Using for delete the supplier*/
   
  /** Using for supplier delete */
  deleteSupplier(EventSupplierId:any,index:any){
    Swal.fire({
      title: 'Are you sure you want to delete this supplier?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value){
        this.removeRow(EventSupplierId, index);
      }
    })
    }
  
    /**Using for remove row after delete */
    removeRow(EventSupplierId:any,index:any){
      const params:any= {};
      params['data'] = {
        EventSupplierId : EventSupplierId,
      }
      this.loaderService.show();
      this.deleteSupplierSubscriber = this.apolloClient.setModule('deleteEventSupplierManagement').mutateData(params).subscribe((response: any) => {
        this.loaderService.hide();
        if(response.error) {
          this.alertService.error(response.message);
        } else {
          this.alertService.success(response.message);
          this.getSupplierDetails.splice(index,1);
          if(this.getSupplierDetails.length === 0){
            this.onPrevious(this.current);
          }
          else{
            this.getList(this.current);
          }
        }
      });
    }

    /**Using for current page */
    public onGoTo(page: number): void {
    this.current = page;
    this.getList(this.current);
    }
  
    /**Using for move to next page */
    public onNext(page: number): void {
    this.current = page + 1;
    this.getList(this.current);
    }
  
    /**Using for move to current page */
    public onPrevious(page: number): void {
    this.current = page - 1;
    this.getList(this.current);
    }

    /** modal for click on Supplier add in table list --- show in modal*/
    supplierAddModal(supplierId:any){
      this.isAssignDisabled = false;
      this.supplierIdVal = supplierId;
      this.$taskModal = new window.bootstrap.Modal(
        document.getElementById("supplierAdd_modal")
      );
      this.$taskModal.show();
      this.getEventDetail();
    }

    /**Using for get the event Details*/
    getEventDetail()
    {
      const params:any= {};
      params['getMyCommunityEventByIdId'] = this.eventId;

      this.loaderService.show();

      this.eventDetailsSubscriber = this.apolloClient.setModule('getMyCommunityEventByID').mutateData(params).subscribe((response: any) => {
        this.loaderService.hide();
        if(response.error) {
          this.alertService.error(response.message);
        } else {
          this.eventData = response.data;
          //console.log("eventData.........",this.eventData);
          
        }
      });
    }

  /**Using for get user details depends on user type */  
  getUser(val:number){ 
    this.isAssignDisabled = true;
    if(val === 1){
      this.typeVal = "adult";
    }
    if(val === 2){
      this.typeVal = "teenager";
    }
    if(val === 3){
      this.typeVal = "children";
    }
    console.log("typeVal.......",this.supplierIdVal);
    const params:any = {};
    params['data'] = {
      eventId: this.eventId,
      supplierId: this.supplierIdVal ? this.supplierIdVal : null,
      type: this.typeVal
    }
    this.loaderService.show();
    this.getUserSubscriber = this.apolloClient.setModule('getUserVisibility').queryData(params).subscribe({
      next:(response: GeneralResponse)=>{
        if(response.error){
          this.alertService.error(response.message);
          return;
        }
        else{
          this.getUserData = response?.data;
          //console.log("getUserData......",this.getUserData);
          this.getUserData.forEach((element:any,index:number) => {
            if(element.isAssigned === true){
              element.showAssign = true;
              element.isSave = true;
              this.assignData.push({
                UserId: element.id,
                type: element.type,
                supplierId: this.supplierIdVal ? this.supplierIdVal : null
              });
            }
            else{
              element.showAssign = false;
              element.isSave = false;
            }
          });
        }
      },
      error: err=>{
        console.log(err);
      }
    });  
    this.loaderService.hide();   
  }

  /**Using for save the selected assign member*/
  saveAssignedMember(index:number){
    const params: any = {};
    params['data']= {
      UserId: this.getUserData[index].id,
      type: this.getUserData[index].type,
      supplierId: this.supplierIdVal ? this.supplierIdVal : null
    };
    this.assignData.push({
      UserId: this.getUserData[index].id,
      type: this.getUserData[index].type,
      supplierId: this.supplierIdVal ? this.supplierIdVal : null
    })
    this.getUserData[index].isSave = true;
    this.getUserData[index].showAssign = true;
    this.loaderService.show();
    this.saveMemberSubscriber = this.apolloClient.setModule('assignSupplierMembers').mutateData(params).subscribe({
      next: (response: GeneralResponse) =>{
        if(response.error){
          this.alertService.error(response.message);
          return;
        }
        else{
          this.alertService.success(response.message);
          // this.$taskIdModal.hide();
          // this.$taskModal.show();
        }
      },
      error: err=>{
        console.log(err);
      }
    });
    this.loaderService.hide();
  }

   /**Using for delete the assigned member*/
   deleteAssignedMember(index:number,UserId:string){
    const params: any = {};
    params['data']={
      UserId: UserId,
      supplierId: this.supplierIdVal ? this.supplierIdVal : null
    }
    this.deleteSubscriber = this.apolloClient.setModule('deleteAssignSupplierMembers').mutateData(params).subscribe({
      next: (response: GeneralResponse) =>{
        if(response.error){
          this.alertService.error(response.message);
          return;
        }
        else{
          this.alertService.success(response.message);
          this.getUserData[index].showAssign = false;
          let findPos = this.assignData.findIndex((val:any) => (val.UserId === UserId));
          this.assignData.splice(findPos,1);
          this.getUserData[index].isSave = false;
        }
      },
      error: err=>{
        console.log(err);
      }
    });
  }

   /**Using for save the assigned member data */
   saveAssignData(){
    const params: any = {};
    params['data']= this.assignData; 
    this.loaderService.show();
    this.apolloClient.setModule('assignMembers').mutateData(params).subscribe({
      next: (response: GeneralResponse) =>{
        if(response.error){
          this.alertService.error(response.message);
          return;
        }
        else{
          this.alertService.success(response.message);
          this.$taskIdModal.hide();
          this.$taskModal.show();
        }
      },
      error: err=>{
        console.log(err);
      }
    });
  }

  /** supplier add modal " + Assign Member " button click -- modal open  */
  assignMemberModal(){
    this.$taskModal.hide();
    this.typeVal = "";
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("assignMemberListModal")
    );
    this.$modal.show();
  }

  /** Using for the user assign toggle button*/
  userAssignButton(getDetails:any,index:number){
  this.getUserData[index].showAssign = true;
  }

  /** Using for submit volunteered after done*/
  hasCompleted(id:any,num:Number){
    const params:any={};
    params['data']={
      id: id,
      //isDone: true,
      alreadyTaken: this.getVolunteeredValue
    }
    this.doneSubscriber = this.apolloClient.setModule('updateEventSupplierManagement').mutateData(params).subscribe({
      next:(response: GeneralResponse)=>{
        if(response.error){
          this.loaderService.hide();
          this.alertService.error(response.message);
        }
        else{
          if(num === 1){
            this.loaderService.hide();
            this.alertService.error(response.message);
            this.getList(this.current);
          }
          if(num === 2){
            this.loaderService.hide();
            this.getList(this.current);
          }
          
        }
      },
      error: err =>{
        console.log(err);        
      }
    })
  }

  editSpplier(supplierId:any){
    this.router.navigateByUrl('events/supply-management/edit-supplier/'+this.eventId+'/'+supplierId);
  }

  /** modal for click on supplier ID in table list --- show in modal*/
  supplierModal(getData:any,supplierId:string){
    this.$supplierModal = new window.bootstrap.Modal(
      document.getElementById("supplierId_modal")
    );
    this.$supplierModal.show();
    this.supplierId = supplierId;
    this.getSupplierValue = getData;
  }

  /**Using for get the count value */
  getCountingValue(){
    const params:any={};
    params['data'] = {
      eventId: this.eventId
    }
    this.countingSubscriber = this.apolloClient.setModule('getSupplierStatusCounting').queryData(params).subscribe({
      next: (response: GeneralResponse) =>{
        if(response.error) {
          this.alertService.error(response.message);
          return;
        }
        else{
          this.getCountData = response.data;
          console.log("getCountData........",this.getCountData);
          
        }
      },
      error: err=>{
        console.log(err);
      }
    })
  }
}
