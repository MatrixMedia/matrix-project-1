import { Component,OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import {tasks} from 'src/app/shared/models/event-task-management-list.module'
import { FormControl, FormGroup } from '@angular/forms';
import {taskCountResult} from 'src/app/shared/models/task-count-details.model';
import {acceptRejectSupplier} from 'src/app/shared/models/accept-reject-supplier.model'
import Swal from 'sweetalert2';
declare var window:any;
//import * as $ from 'jquery';
@Component({
  selector: 'app-task-management-list',
  templateUrl: './task-management-list.component.html',
  styleUrls: ['./task-management-list.component.css']
})
export class TaskManagementListComponent implements OnInit,OnDestroy  {
  private eventIdSubscriber!: Subscription;
  private getTaskSubscriber!: Subscription;
  private statusSubscriber!: Subscription;
  private countingSubscriber!: Subscription;
  private eventDetailsSubscriber!: Subscription;
  private getUserSubscriber!: Subscription;
  private deleteSubscriber!: Subscription;
  private saveMemberSubscriber!: Subscription;
  private getAcceptRejectDetailsSubscriber!: Subscription;
  eventId: any;
  current: number = 1;
  limit: number = 10;
  totalPageNo!: number;
  totalData!:Number;
  from!: Number;
  to!: Number;
  getTaskDetails: tasks[] = [];
  searchForm!: FormGroup;
  filterForm!: FormGroup;
  getCountData: taskCountResult = {};
  seachFilter: boolean = false;
  toggleFilter:boolean = false;
  $taskModal: any;
  $taskIdModal: any;
  $modal: any;
  getTeamDetails: any;
  eventData: any;
  getEventValue: any;
  taskId!:string;
  hideTaskModal: boolean = false;
  typeVal!:string;
  taskIdVal: any;
  getUserData: any;
  assignData: any = [];
  isSave: boolean = false;
  getAssignMembersDetails:any = [];
  isAssignDisabled: boolean = false;
  taskLogId: any;
  isAccepted: boolean = false;
  getAcceptRejectDetails: acceptRejectSupplier[] = [];
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
    this.getList(this.current);
    //this.countNum();
    this.generateSearchForm();
    this.getCountingValue();
  }

  ngAfterViewInit(): void {
    $('#taskAdd_modal').on('hidden.bs.modal', () => {
     this.typeVal = "";
    });
    
    $('#assignMemberListModal').on('hidden.bs.modal', () => {
      this.typeVal = "";
     });
  }

  ngOnDestroy(): void {
    if(this.eventIdSubscriber){
      this.eventIdSubscriber.unsubscribe();
    }
    if(this.getTaskSubscriber){
      this.getTaskSubscriber.unsubscribe()
    }
    if(this.statusSubscriber){
      this.statusSubscriber.unsubscribe();
    }
    if(this.countingSubscriber){
      this.countingSubscriber.unsubscribe();
    }
    if(this.eventDetailsSubscriber){
      this.eventDetailsSubscriber.unsubscribe();
    }
    if(this.getUserSubscriber){
      this.getUserSubscriber.unsubscribe();
    }
    if(this.deleteSubscriber){
      this.deleteSubscriber.unsubscribe();
    }
    if(this.saveMemberSubscriber){
      this.saveMemberSubscriber.unsubscribe();
    }
    if(this.getAcceptRejectDetailsSubscriber){
      this.getAcceptRejectDetailsSubscriber.unsubscribe();
    }
  }

  /**Using for declare the search form */
  generateSearchForm() {
    this.filterForm = new FormGroup({
      status: new FormControl('')
    });

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

//  countNum(){
//  const counters = document.querySelectorAll(".counter");
//  counters.forEach((counter :any) => {
//      counter.innerText = "0";
//      const updateCounter = () => {
//        const target = +counter.getAttribute("data-target");
//        const count = +counter.innerText;
//        const increment = target / 2000;
//        if (count < target) {
//          counter.innerText = `${Math.ceil(count + increment)}`;
//          setTimeout(updateCounter, 100);
//        } else counter.innerText = target;
//      };
//      updateCounter();
//    });
//  }

 /**Using for redirect to create task */
 redirectToTask(){
  this.router.navigateByUrl('events/create-task/'+this.eventId);
 }

 /**Using for get the task management details */
 getList(page:number){
  const searchData = this.activatedRoute.snapshot.paramMap.get("value") ? this.activatedRoute.snapshot.paramMap.get("value") : '';
  const params:any = {};
  params['data'] = {
    eventId: this.eventId,
    page: page,
  }
  if(searchData){
    params['data'].search = searchData.trim();
  }
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
  this.getTaskSubscriber = this.apolloClient.setModule('getAllEventTask').queryData(params).subscribe({
    next: (response: GeneralResponse)=> {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      }
      else{
        this.getTaskDetails = response.data.tasks;
        this.totalData = response.data.total;
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

 /**Using for change status*/
 changeStatus(taskId:any, index:number){
  const params:any={};
  params['eventTaskStatusChangeId'] = taskId;
  this.loaderService.show();
  this.statusSubscriber = this.apolloClient.setModule('eventTaskStatusChange').mutateData(params).subscribe({
    next: (response: GeneralResponse)=> {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      }
      else{
        if(this.getTaskDetails[index].isDone === true)
        {
           this.getTaskDetails[index].isDone = false;
        }
        else if(this.getTaskDetails[index].isDone === false)
        {
           this.getTaskDetails[index].isDone =true;
        }
        this.alertService.success(response.message);
      }
    },
    error: err=> {
      console.log(err);
    }
  });
  this.loaderService.hide();
 }

 /**Using for clear search data */
 clearDateFilter() {
  this.searchForm.controls['search'].setValue('');
  this.getList(this.current);
 }

 /**Using for get the count value */
 getCountingValue(){
  const params:any={};
  params['data'] = {
    eventId: this.eventId
  }
  this.countingSubscriber = this.apolloClient.setModule('getTaskStatusCounting').queryData(params).subscribe({
    next: (response: GeneralResponse) =>{
      if(response.error) {
        this.alertService.error(response.message);
        return;
      }
      else{
        this.getCountData = response.data;
        //this.countNum();
      }
    },
    error: err=>{
      console.log(err);
    }
  })
 }

  /** Using for task delete */
  deleteTask(taskId:any,index:any){
  Swal.fire({
    title: 'Are you sure you want to delete this task?',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if(result.value){
      this.removeRow(taskId, index);
    }
  })
  }

  /**Using for remove row after delete */
  removeRow(taskId:any,index:any){
    const params:any= {};
    params['data'] = {
      taskId : taskId,
    }
    this.loaderService.show();
    this.apolloClient.setModule('deleteEventTask').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {
        this.alertService.success(response.message);
        this.getTaskDetails.splice(index,1);
        if(this.getTaskDetails.length === 0){
          this.onPrevious(this.current);
        }
        else{
          this.getList(this.current);
        }
      }
    });
  }

  /**Using toggle for search button */
  searchToggle(){
    if(!this.seachFilter){
      this.toggleFilter = false;
      this.seachFilter = true;
      this.clearDateFilter();
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
      this.clearDateFilter();
    }
    else{
      this.toggleFilter = false;
    }
  }

  /** modal for click on Task ID in table list --- show in modal*/
  taskIdModal(getData:any,taskId:string){
    this.$taskIdModal = new window.bootstrap.Modal(
      document.getElementById("taskId_modal")
    );
    this.$taskIdModal.show();
    this.getEventValue = getData;
    this.taskId = taskId;
  }


  /** modal for click on Task add in table list --- show in modal*/
  taskAddModal(teamSize:any,taskId:any){
    this.isAssignDisabled = false;
    this.taskIdVal = taskId;
    this.getTeamDetails = teamSize;
    this.$taskModal = new window.bootstrap.Modal(
      document.getElementById("taskAdd_modal")
    );
    this.$taskModal.show();
    this.getEventDetail();
  }

  /** task add modal " + Assign Member " button click -- modal open  */
  assignMemberModal(){
    this.$taskModal.hide();
    this.typeVal = "";
    this.$modal = new window.bootstrap.Modal(
      document.getElementById("assignMemberListModal")
    );
    this.$modal.show();
  }

  /**Using for get the event name*/
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
      }
    });
  }

  /**Using for redirect to the edit page */
  editTask(taskId: any){
    this.router.navigateByUrl('events/edit-task/'+this.eventId+'/'+taskId);
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
    const params:any = {};
    params['data'] = {
      eventId: this.eventId,
      taskId: this.taskIdVal ? this.taskIdVal : null,
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
          this.getUserData = response.data;
          this.getUserData.forEach((element:any,index:number) => {
            if(element.isAssigned === true){
              element.showAssign = true;
              element.isSave = true;
              this.assignData.push({
                UserId: element.id,
                type: element.type,
                taskId: this.taskIdVal ? this.taskIdVal : null
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

  /** Using for the user assign toggle button*/
  userAssignButton(getDetails:any,index:number){
    this.getUserData[index].showAssign = true;
  }

  /**Using for save the selected assign member*/
  saveAssignedMember(index:number){
    const params: any = {};
    params['data']= {
      UserId: this.getUserData[index].id,
      type: this.getUserData[index].type,
      taskId: this.taskIdVal ? this.taskIdVal : null
    };
    this.assignData.push({
      UserId: this.getUserData[index].id,
      type: this.getUserData[index].type,
      taskId: this.taskIdVal ? this.taskIdVal : null
    })
    this.getUserData[index].isSave = true;
    this.getUserData[index].showAssign = true;
    this.loaderService.show();
    this.saveMemberSubscriber = this.apolloClient.setModule('assignMembers').mutateData(params).subscribe({
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
      taskId: this.taskIdVal ? this.taskIdVal : null
    }
    this.deleteSubscriber = this.apolloClient.setModule('deleteAssignMember').mutateData(params).subscribe({
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
    //console.log("assignData........",this.assignData); 
    const params: any = {};
    params['data']= this.assignData;
    // params['data']={
    //   UserId: this.assignData.UserId,
    //   type: this.assignData.type,
    //   taskId: this.assignData.taskId
    // }
    //console.log("assignData........",params); 
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

  /**Using for modal open assign mebers list*/
  assignMembersModal(members:[]){
  this.getAssignMembersDetails = members;
  this.$modal = new window.bootstrap.Modal(
    document.getElementById("assignMemberModal")
  );
  this.$modal.show();
}

/** Log modal -- button click -- modal open */
taskLogModal(id:any){
  this.taskLogId = id;
  this.$modal = new window.bootstrap.Modal(
    document.getElementById("taskLogModal")
  );
  this.$modal.show();
  this.getAcceptedRejectedList(id,"Accepted");
}

 /**Using for get the supplier accepted or rejected list */
 getAcceptedRejectedList(id:any,getStatus:any){
  if(getStatus === 'Accepted'){
    this.isAccepted = true;
  }
  else{
    this.isAccepted = false;
  }
  const params:any = {};
  params['data'] = {
    taskId: id,
    status: getStatus ? getStatus : "Accepted",
  }
  this.loaderService.show();
  this.getAcceptRejectDetailsSubscriber = this.apolloClient.setModule('acceptOrRejectUserList').queryData(params).subscribe({
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
 

}


