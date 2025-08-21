import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import * as S3 from 'aws-sdk/clients/s3';
import {environment} from 'src/environments/environment';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { ValidatorService } from 'src/app/shared/services/validator.service';
import { param } from 'jquery';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import {viewBlog} from 'src/app/shared/models/view-blog.module';
import { Event } from 'src/app/shared/models/events.model';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit,OnDestroy {
  @ViewChild('fileImage') fileImage!: ElementRef;
  @ViewChild('fileThumbnail') fileThumbnail!: ElementRef;
  @ViewChild('filePdf') filePdf!: ElementRef;
  blogDeatilsSaveSubscriber!: Subscription;
  blogIdSubscriber!: Subscription;
  getBlogsSubscriber!: Subscription;
  blogEditIdSubscriber!: Subscription;
  thumbnailImage!: String;
  mainImage!: any;
  getFileName!: string;
  imageSrc: any;
  thumbnailCroppedImage: any;
  thumbnailOpenCropImageModal: boolean= false;
  thumbnailImageChangedEvent: any;
  CroppedImage: any;
  OpenCropImageModal: boolean= false;
  ImageChangedEvent: any;
  blogForm!: FormGroup;
  pdfs: any;
  blogId: any;
  blogEditId: any;
  blogDetails: any;
  getPdfFile!: string;
  evetList: Event[] = [];
  hasevent: boolean = false;
  selectedFiles: any = [];
  uploadedImages: any = [];
  selectedPdfs: any = [];
  uploadPdf: any = [];
  uploadpdfs: any = [];
  pdfFile:any = [];
  totalImageCount: number = 0;
  totalPdfCount: number = 0;
  constructor(
    private formBuilder : FormBuilder,
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private validator: ValidatorService,
  ){}
  ngOnInit(){
    this.blogIdSubscriber = this.activatedRoute.paramMap.subscribe({
      next: params => {
        this.blogId = params.get('id');
      },
      error: err => {}
    });
    this.blogEditIdSubscriber = this.activatedRoute.paramMap.subscribe({
      next: params => {
        this.blogEditId = params.get('blogId');
      },
      error: err => {}
    });
    if(this.blogId){
      this.getBlogDetails();
    }
    if(this.blogEditId){
      this.getBlogDetails();
    }
    this.initForm();
    this.getPublicEvent();
  }

  ngOnDestroy(){
    if(this.blogDeatilsSaveSubscriber){
      this.blogDeatilsSaveSubscriber.unsubscribe();
    }
    if(this.blogIdSubscriber){
      this.blogIdSubscriber.unsubscribe();
    }
    if(this.getBlogsSubscriber){
      this.getBlogsSubscriber.unsubscribe();
    }
    if(this.blogEditIdSubscriber){
      this.blogEditIdSubscriber.unsubscribe();
    }
  }

  /**Using for  intialize task form */
  initForm(){
    this.blogForm = this.formBuilder.group({
      eventId: [''],
      blogTitle: ['',[Validators.required, this.validator.isEmpty]],
      blogCategory: ['',[Validators.required, this.validator.isEmpty]],
      blogDescription: ['',[Validators.required, this.validator.isEmpty]],
    })
  }

  /**Using For thumbnail image preview */
  previewImage(event: any, imageName: String) {
    const val = event.target.value.split("\\").pop();
    this.getFileName = val;
    if(imageName === 'thumbnailImage'){
      this.thumbnailOpenCropImageModal = true;
      this.thumbnailImageChangedEvent = event;
    }
    else if(imageName === 'mainImage'){
      this.OpenCropImageModal = true;
      this.ImageChangedEvent = event;
    }
    if (event.target.files && event.target.files[0]) {
      let size = event.target.files[0].size / 1024;
      if (size > 5120) { //size < 2048
        this.alertService.error("Size shouldn't be greater than 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageSrc = event.target?.result;
      }
      if(imageName === 'pdfs'){
        this.uploadFileToS3Bucket(event, imageName);
      }
    }
  }

  /**Using for image upload in s3 bucket */
  uploadFileToS3Bucket(fileName: any,imageName: any) {
    if(imageName === 'pdfs'){
      const file = fileName.target.files[0] ? fileName.target.files[0] : '';
      const files = fileName.target.files ? fileName.target.files : '';
      const extension = file.name.substr(file.name.lastIndexOf('.'));
        if((extension.toLowerCase() === '.exe') || (extension.toLowerCase() === '.gif') || (extension.toLowerCase() === '.twbx') || (extension.toLowerCase() === '.xlsx') || (extension.toLowerCase() === '.doc') || (extension.toLowerCase() === '.xls') ||(extension.toLowerCase() === '.docx') || (extension.toLowerCase() === '.ppt') || (extension.toLowerCase() === '.pptx') || (extension.toLowerCase() === '.txt') ||
        (extension.toLowerCase() === '.jpg') || (extension.toLowerCase() === '.jpeg') ||
        (extension.toLowerCase() === '.png')){
          this.alertService.error("Could allow to upload only .pdf files");
          return;
        }
        if (file && files) {
          const bucket = new S3(
            {
              accessKeyId: environment.AWS_ACCESS_KEY,
              secretAccessKey: environment.AWS_SECRET_KEY,
              region: 'ap-south-1'  //Asia Pacific (Mumbai)
            }
          );
    
          // upload file to the bucket...........
          const params = {
                Bucket: environment.BUCKET_NAME,
                Key: file.name,
                Body: file,
                ACL: 'public-read'
            };
          bucket.upload(params,  (err: any, data: any) => {
            if (err) {
              this.alertService.error("There was an error uploading your file");
              return false;
            }
            else {
                this.alertService.error("Successfully uploaded" + ' ' +file.name + 'file');
                this.pdfs = data.Location;         
                this.getFileName = file.name;
                this.getPdfFile = this.getFileName;
              return true;
            }
          });
        }else {
          this.alertService.error("No file uploaded.");
        }
    }
    else{
      if(fileName){
        const bucket = new S3(
          {
            accessKeyId: environment.AWS_ACCESS_KEY,
            secretAccessKey: environment.AWS_SECRET_KEY,
            region: 'ap-south-1'  //Asia Pacific (Mumbai)
          }
        );
        // upload file to the bucket...........
        const params = {
          Bucket: environment.BUCKET_NAME,
          Key: this.getFileName,
          Body: fileName,
          ACL: 'public-read'
        };
        bucket.upload(params, (err: any, data: any) => {
          if (err) {
            this.alertService.error("There was an error uploading your file");
            return false;
          }
          else {
            //this.alertService.error("Successfully uploaded file.");
            if (imageName === 'thumbnailImage') {
              this.thumbnailImage = data.Location;
            }
            else{
              this.mainImage = data.Location;
            } 
            return true;
          }
        });
      } else {
        this.alertService.error("No file uploaded.");
      }
  }
  }

  /**Using For download pdf file */
  downloadFile(){
    FileSaver.saveAs(this.pdfs,this.getFileName)
  }

  /**Using for uploaded delete pdfs file */
  deletePdfs(){
    this.pdfs = '';
    this.getFileName = ''
    this.filePdf.nativeElement.value = '';
  }

  //Image Croped...............
  cropImg(event: ImageCroppedEvent, imageName: String) {
    if(imageName === 'thumbnailImage'){
      this.thumbnailCroppedImage = event.blob;
    }
    else{
      this.CroppedImage = event.blob;
    }     
  }    
  imgLoad() {
      // display cropper tool
  }
  initCropper() {
      // cropper ready
  }
  imgFailed() {
      // show message
  }

  /**Using for delete thumbnail image */
  deletethumbnailImage(){
    this.thumbnailImage = '';
    this.fileThumbnail.nativeElement.value = '';
  }

  /**Using for delete image */
  deleteImage(){
    this.mainImage = '';
    this.fileImage.nativeElement.value = '';
  }

  /**Using for cancel cropped image */
  closeImage(imageName:any){
    if(imageName === 'thumbnailImage'){
      this.thumbnailOpenCropImageModal = false;
    }
    else{
      this.OpenCropImageModal = false;
    }
  }

  /**Using for save cropped image */
  saveImage(imageName:any){
    if(imageName === 'thumbnailImage'){
      this.thumbnailOpenCropImageModal = false;
      this.uploadFileToS3Bucket(this.thumbnailCroppedImage,imageName);
    }
    else{
      this.OpenCropImageModal = false;
      this.uploadFileToS3Bucket(this.CroppedImage,imageName);
    }
  }

  /**Using for saved blog details */
  saveBlogDetails(){
    //console.log(this.uploadPdf);
    if(this.uploadPdf.length !== 0){
      this.uploadPdf.map((item:any)=>{
        this.uploadpdfs.push(item.url)
      })
    }
    const communtityId = this.storageService.getLocalStorageItem('communtityId');
    const saveData = this.blogForm.value;
    const params:any={};
    if(this.thumbnailImage === null || this.thumbnailImage === '' || this.thumbnailImage === undefined){
      this.alertService.error("Please upload thumbnail image");
      return;
    }
    if(this.uploadedImages.length === 0){
      this.alertService.error("Please upload blog images");
      return;
    }
    if(this.uploadPdf.length === 0){
      this.alertService.error("Please upload pdfs");
      return;
    }
    if((this.blogEditId === '' || this.blogEditId === null || this.blogEditId === undefined) && (saveData.eventId === '' || saveData.eventId === null || saveData.eventId === undefined)){
      this.alertService.error("Please select event");
      return;
    }
    params['data']={
      blogCategory: saveData.blogCategory,
      blogDescription: saveData.blogDescription,
      //blogStatus: true,
      blogTitle: saveData.blogTitle,
      image: this.uploadedImages,
      //image: this.mainImage ? this.mainImage : '',
      //paymentStatus: true,
      //pdf: this.pdfs ? this.pdfs : '',
      pdf: this.uploadpdfs,
      thumbnailImage: this.thumbnailImage ? this.thumbnailImage : ''
    }
    // console.log("params.....",params);
    // return;
    this.loaderService.show();
    if(this.blogEditId){
      params['data'].blogId = this.blogEditId;
      this.blogDeatilsSaveSubscriber = this.apolloClient.setModule('updateblogs').mutateData(params).subscribe({
        next:(response: GeneralResponse)=>{
          if(response.error){
            this.loaderService.hide();
            this.alertService.error(response.message);
          }
          else{
            this.loaderService.hide();
            this.alertService.error(response.message);
            this.router.navigateByUrl('/blog');
          }
        },
        error: err =>{
          console.log(err);        
        }
      })
    }
    else{
      params['data'].communityId = communtityId,
      params['data'].eventId = saveData.eventId,
      this.blogDeatilsSaveSubscriber = this.apolloClient.setModule('createBlogs').mutateData(params).subscribe({
        next:(response: GeneralResponse)=>{
          if(response.error){
            this.loaderService.hide();
            this.alertService.error(response.message);
          }
          else{
            this.loaderService.hide();
            this.alertService.error(response.message);
            this.router.navigateByUrl('/blog');
          }
        },
        error: err =>{
          console.log(err);        
        }
      })
    }
    this.loaderService.hide();
  }

  /**Using get blog details by id */
  getBlogDetails(){
    const params:any = {};
    if(this.blogId){
      params['data'] = {
        blogId: this.blogId
      }
    }
    else{
      params['data'] = {
        blogId: this.blogEditId
      }
    }
    this.loaderService.show();
    this.getBlogsSubscriber = this.apolloClient.setModule('getBolgsById').queryData(params).subscribe({
      next: (response:GeneralResponse) =>{
        if(response.error){
          this.loaderService.hide();
          this.alertService.error(response.message);
          return;
        }
        else{
          this.loaderService.hide();
          this.blogDetails = response.data;
          //console.log("pdf....",this.blogDetails.pdf);
          
          if(this.blogDetails.pdf.length > 0){
            this.blogDetails.pdf.map((item:any)=>{
            const startIndex = item.lastIndexOf('/') + 1; // Find the index of the last '/'
            const endIndex = item.indexOf('%20', startIndex); // Find the index of the first '%20' after the last '/'
            const filename = item.substring(startIndex, endIndex !== -1 ? endIndex : undefined);
            this.pdfFile.push({
              name: filename,
              url: item
            });
            })
          }
          this.blogForm.patchValue({
            blogTitle: this.blogDetails.blogTitle,
            blogCategory: this.blogDetails.blogCategory,
            blogDescription: this.blogDetails.blogDescription,
            eventId: this.blogDetails.eventId,
          });
          this.thumbnailImage = this.blogDetails.thumbnailImage ? this.blogDetails.thumbnailImage : '';
          this.uploadedImages = this.blogDetails.image ? this.blogDetails.image : [];
          this.uploadPdf = this.blogDetails.pdf ? this.pdfFile : '';
          const decodedFileName = decodeURIComponent(this.pdfs);
          const parts = decodedFileName.split(/[\\/]/);
          this.getPdfFile = parts[parts.length - 1];
          this.hasevent = true;
          this.totalImageCount = this.blogDetails.image.length ? this.blogDetails.image.length : 0;
          this.totalPdfCount = this.blogDetails.pdf.length ? this.blogDetails.pdf.length : 0;
        }
      },
      error: err=>{
        console.log(err);
      }
    })
    this.loaderService.hide();
  }


  //For event............
  getPublicEvent(){
    const community_id = this.storageService.getLocalStorageItem('communtityId');
    const params:any = {};
    params['data'] = {
      communityId: community_id,
    }
    this.loaderService.show();
    this.apolloClient.setModule('getMyCommunityEventsForBlog').queryData(params).subscribe((response: GeneralResponse) => {
      if(response.error) {
        this.alertService.error(response.message);
        return;
      }
      else{
          this.evetList =  response.data.events;
          //console.log("eventList.......",this.evetList);
          
      }
    })
    this.loaderService.hide();
  }

  /**Selected the multiple images upload */
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    const length = this.selectedFiles.length + this.uploadedImages.length;
    this.totalImageCount = length;
    //console.log("len....",length)
    //this.uploadedImages = []; // Clear previous uploads when new files are selected
    if(length > 5){
      this.alertService.error("Maximum uploaded 5 files!");
      return;
    }
    else{
      this.uploadImages();
    }
  }

  /**Upload the blog images */
  async uploadImages(): Promise<void> {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const bucket = new S3({
        accessKeyId: environment.AWS_ACCESS_KEY,
        secretAccessKey: environment.AWS_SECRET_KEY,
        region: 'ap-south-1' // Asia Pacific (Mumbai)
      });
  
      for (const file of this.selectedFiles) {
        const params = {
          Bucket: environment.BUCKET_NAME,
          Key: file.name, // Use the file name as the key
          Body: file,
          ACL: 'public-read'
        };
  
        try {
          const data = await bucket.upload(params).promise();
          this.alertService.success("Successfully uploaded");
          this.uploadedImages.push(data.Location);
          //console.log("uploadedImages....",this.uploadedImages);
          
        } catch (err) {
          console.error("Error uploading file", err);
          this.alertService.error("There was an error uploading your file");
        }
      }
    } else {
      this.alertService.error("No file uploaded.");
    }
  }

  /**Remove the blog images */
  uploadedImgDelete(url:any){
    const indeex = this.uploadedImages.indexOf(url);
    this.totalImageCount = this.uploadedImages ? this.uploadedImages.length - 1 : 0;
    this.uploadedImages.splice(indeex,1); 
  }

   /**Selected the multiple images upload */
   onFileSelectedPdf(event: any): void {
    this.selectedPdfs = event.target.files;
    const pdfLength = this.selectedPdfs.length + this.uploadPdf.length;
    this.totalPdfCount = pdfLength;
    //console.log("len....",pdfLength)
    //this.uploadedImages = []; // Clear previous uploads when new files are selected
    if(pdfLength > 5){
      this.alertService.error("Maximum uploaded 5 pdf files!");
      return;
    }
    else{
      this.uploadPdfs();
    }
  }

  /**Upload the multiple pdfs */
  async uploadPdfs(): Promise<void> {
    if (this.selectedPdfs && this.selectedPdfs.length > 0) {
      const bucket = new S3({
        accessKeyId: environment.AWS_ACCESS_KEY,
        secretAccessKey: environment.AWS_SECRET_KEY,
        region: 'ap-south-1' // Asia Pacific (Mumbai)
      });
  
      for (const file of this.selectedPdfs) {
        const params = {
          Bucket: environment.BUCKET_NAME,
          Key: file.name, // Use the file name as the key
          Body: file,
          ACL: 'public-read'
        };
        try {
          const data = await bucket.upload(params).promise();
          this.alertService.success("Successfully uploaded");
          this.uploadPdf.push({
            name: file.name,
            url: data.Location
          });
          
        } catch (err) {
          console.error("Error uploading pdf files", err);
          this.alertService.error("There was an error uploading your pdf files");
        }
      }
    } else {
      this.alertService.error("No file uploaded.");
    }
  }

  /**Remove the blog images */
  uploadedPdfDelete(url:any){
    const index = this.uploadPdf.findIndex((item:any) => item.url === url);
    this.totalPdfCount = this.uploadPdf ? this.uploadPdf.length - 1 : 0;
    this.uploadPdf.splice(index,1); 
  }
}
