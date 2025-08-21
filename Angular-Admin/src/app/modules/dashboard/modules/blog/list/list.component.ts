import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { blog } from 'src/app/shared/models/blog.model';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
declare var window:any;
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit,OnDestroy {
  private blogSubscriber!: Subscription;
  private blogsStatusSubscriber!: Subscription;
  private paymentStatusSubscriber!: Subscription;
  getBlogs: blog[] = [];
  current: number = 1;
  limit: number = 10;
  totalPageNo!: number;
  totalData!:Number;
  from!: Number;
  to!: Number;
  searchForm!: FormGroup;
  filterForm!: FormGroup;
  seachFilter: boolean = false;
  toggleFilter:boolean = false;
  constructor(
    private storageService: StorageService,
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute : ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.getAllBlogs(this.current);
    this.generateSearchForm();
  }

  ngOnDestroy(): void {
    if(this.blogSubscriber){
      this.blogSubscriber.unsubscribe();
    }
    if(this.blogsStatusSubscriber){
      this.blogsStatusSubscriber.unsubscribe();
    }
    if(this.paymentStatusSubscriber){
      this.paymentStatusSubscriber.unsubscribe();
    }
  }

  /**Using for declare the search form */
  generateSearchForm(){
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });

    this.filterForm = new FormGroup({
      blogCategory: new FormControl('')
    });
  }

  /**Using for clear search data */
  clear(){
    this.searchForm.controls['search'].setValue('');
    this.getAllBlogs(this.current);
  }

  /**Using for get blog list */
  getAllBlogs(page:number){
    const params:any = {};
    params['data'] = {
      communityId: this.storageService.getLocalStorageItem('communtityId'),
      page: page,
    }
    if(this.searchForm?.value.search && this.searchForm?.value.search!=''){
      params['data'].search = this.searchForm?.value.search.trim();
    }
    if(this.filterForm?.value.blogCategory && this.filterForm?.value.blogCategory!=''){
      if(this.filterForm.value.blogCategory === "Public"){
        params['data'].blogCategory = "Public";
      }
      else if(this.filterForm.value.blogCategory === "Private"){
        params['data'].blogCategory = "Private";
      }
      else if(this.filterForm.value.blogCategory === "Fan"){
        params['data'].blogCategory = "Fan";
      }
    }
    this.loaderService.show();
    this.blogSubscriber = this.apolloClient.setModule('getAllBlogs').queryData(params).subscribe({
      next:(response: GeneralResponse)=>{
        if(response.error){
          this.alertService.error(response.message);
          return;
        }
        else{
          this.getBlogs = response.data?.blogs;
          this.totalData = response.data?.total;
          this.from = response.data?.from;
          this.to = response.data?.to;
          if(response.data.total !== 0) {
            this.totalPageNo = Math.ceil(response.data.total / this.limit);
          }else {
            this.totalPageNo = 0;
          }
          //console.log("getBlogs......",this.getBlogs);
        }
      },
      error: err=>{
        console.log(err);
      }
    });  
    this.loaderService.hide();  
  }

  

   /**Using for current page */
    onGoTo(page: number): void {
    this.current = page;
    this.getAllBlogs(this.current);
    }
  
    /**Using for move to next page */
    onNext(page: number): void {
    this.current = page + 1;
    this.getAllBlogs(this.current);
    }
  
    /**Using for move to current page */
    onPrevious(page: number): void {
    this.current = page - 1;
    this.getAllBlogs(this.current);
    }

    /**Using for blog status change */
    toggleBlogStatus(event: any, index:number, blogId:any){
      const params:any={};
      params['data'] = {
        blogId: blogId
      };
      this.loaderService.show();
      this.blogsStatusSubscriber = this.apolloClient.setModule('blogStatusChange').mutateData(params).subscribe({
        next: (response: GeneralResponse)=> {
          if(response.error) {
            this.alertService.error(response.message);
            return;
          }
          else{
            if(this.getBlogs[index].blogStatus === true)
            {
               this.getBlogs[index].blogStatus = false;
            }
            else if(this.getBlogs[index].blogStatus === false)
            {
               this.getBlogs[index].blogStatus = true;
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

    /**Using for payment status change */
    togglePaymentStatus(event: any, index:number, blogId:any){
      const params:any={};
      params['data'] = {
        blogId: blogId
      };
      this.loaderService.show();
      this.paymentStatusSubscriber = this.apolloClient.setModule('blogPaymentStatusChange').mutateData(params).subscribe({
        next: (response: GeneralResponse)=> {
          if(response.error) {
            this.alertService.error(response.message);
            return;
          }
          else{
            if(this.getBlogs[index].paymentStatus === true)
            {
               this.getBlogs[index].paymentStatus = false;
            }
            else if(this.getBlogs[index].paymentStatus === false)
            {
               this.getBlogs[index].paymentStatus = true;
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

    /** Using for blog delete */
    deleteBlog(blogId:any,index:any){
    Swal.fire({
      title: 'Are you sure you want to delete this blog?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if(result.value){
        this.removeRow(blogId, index);
      }
    })
    }
  
    /**Using for remove row after delete */
    removeRow(blogId:any,index:any){
      const params:any= {};
      params['data'] = {
        blogId : blogId,
      }
      this.loaderService.show();
      this.apolloClient.setModule('deleteBlogs').mutateData(params).subscribe((response: any) => {
        this.loaderService.hide();
        if(response.error) {
          this.alertService.error(response.message);
        } 
        else {
          this.alertService.success(response.message);
          this.getBlogs.splice(index,1);
          if(this.getBlogs.length === 0){
            this.onPrevious(this.current);
          }
          else{
            this.getAllBlogs(this.current);
          }
        }
      });
    }
}
