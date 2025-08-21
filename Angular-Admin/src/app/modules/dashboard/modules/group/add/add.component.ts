import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddGroupComponent implements OnInit{

  groupForm!: FormGroup;
  groupImage: string = '';
  groupId!: any;

  openCropImageModal: boolean= false;
  imageChangedEvent: any;
  getFileName: any;
  croppedImage: any;

  constructor(
                private alertService: AlertService,
                private sharedService: SharedService,
                private loaderService: LoaderService,
                private apolloClient: ApolloClientService,
                private router: Router,
                private activatedRoute : ActivatedRoute
            )
  {

  }

  ngOnInit() : void
  {
        this.activatedRoute.paramMap.subscribe(params => {
          this.groupId = params.get('id'); 
        });
       
        this.generateForm();
        
        if(this.groupId)
        {
           this.getgroupDetails();
        }
  }

  generateForm()
  {
        this.groupForm = new FormGroup({
            name : new FormControl('', [Validators.required]),
            description : new FormControl(''),
            image : new FormControl(''),
            type : new FormControl('', [Validators.required]),
        });
  }

  getgroupDetails()
  {
    const params:any= {};
    params['getMyCommunityGroupByIdId'] = this.groupId;
    let groupData : any = {};

    this.loaderService.show();

    this.apolloClient.setModule('getMyCommunityGroupByID').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {

        groupData = response.data;

        //console.log('groupData', groupData);

        this.groupForm.patchValue({
          name: groupData.name ? groupData.name : '',
          description: groupData.description ? groupData.description : '',
          type: groupData.type ? groupData.type : ''
        });

        this.groupImage = groupData?.image;
        
        //this.alertService.success(response.message);
      }
    });

  }

  uploadImage(event: any, imageName: String) {

    const val = event.target.value.split("\\").pop();
    this.getFileName = val;
    this.openCropImageModal = true;
    this.imageChangedEvent = event;

    if (event.target.files && event.target.files[0]) {
      let size = event.target.files[0].size / 1024;
      //console.log('image size----', size);
      if (size > 5120) { //size < 2048
        this.alertService.error("Image size should be within 2-5MB.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        let imageSrc = event.target?.result;
        //console.log('imageSrc----', imageSrc);
      }
    }

    // this.sharedService.uploadFileToS3Bucket(event, imageName,
    //   (err : any, data : any, imageName: any) => {
    //     this.setS3BucketUploadedFilePath(err, data, imageName);
    //   });
  }

/*
  setS3BucketUploadedFilePath (err : any, data : any, imageName : any) {
  
    if (err) {
            this.alertService.error("There was an error uploading your file");
            return false;
    } else {
          if (imageName === 'image') {
            this.groupImage = data.Location;         
            this.alertService.error("Image has been uploaded successfully");
          }
          return true;
    }
}
*/

//Image Croped...............
cropImg(event: ImageCroppedEvent) {
  //console.log("event.......",event);
  this.croppedImage = event.blob;
  
}

closeImage(){
  this.openCropImageModal = false;
}

deleteImage(){
  this.groupImage = '';
}

saveImage(){
  this.openCropImageModal = false;

  this.sharedService.uploadCropedFileToS3Bucket(this.croppedImage, this.getFileName, 'groupImage',
    (err : any, data : any, imageType: string) => {
      this.setS3BucketUploadedFilePath(err, data);
    });
}

setS3BucketUploadedFilePath (err : any, data : any) {
  
  if (err) {
          this.alertService.error("There was an error uploading your file");
          return false;
  } else {
    
          this.groupImage = data.Location;         
          this.alertService.error("Image has been uploaded successfully");
     
        return true;
  }
}


saveData()
{
  
 // console.log(this.groupForm.value);

  const params: any = {};
  params['data'] = {
    name: this.groupForm.value.name,
    description: this.groupForm.value.description,
    image: this.groupImage,
    type: this.groupForm.value.type,
  }

      if(this.groupId)
      {
        params['updateMyCommunityGroupId'] =  this.groupId;

          this.loaderService.show();
              this.apolloClient.setModule("updateMyCommunityGroup").mutateData(params).subscribe((response: any) => {
                if (response.error) {
                  this.loaderService.hide();
                  this.alertService.error(response.message)
                }
                else {
                  this.loaderService.hide();
                  this.alertService.error(response.message);
                  this.router.navigateByUrl('/groups');
                  
                }
              });
      }
      else
      {
            this.loaderService.show();
            this.apolloClient.setModule("myCommunityCreateGroup").mutateData(params).subscribe((response: any) => {
              if (response.error) {
                this.loaderService.hide();
                this.alertService.error(response.message)
              }
              else {
                this.loaderService.hide();
                this.alertService.error(response.message);
                this.router.navigateByUrl('/groups');
                
              }
            });
      }
  
  
}

cancel(){
  this.router.navigateByUrl('groups')
}

}
