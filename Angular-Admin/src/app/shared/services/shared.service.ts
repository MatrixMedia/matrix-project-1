import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({
  providedIn: 'root'
})

export class SharedService {



  constructor(private __http: HttpClient, private __route:Router,)
  { }

  uploadFileToS3Bucket(fileName: any,imageName: any, callback: any) 
  {
    const file = fileName.target.files[0] ? fileName.target.files[0] : '';
    const files = fileName.target.files ? fileName.target.files : '';
    if (file && files) {
      // console.log("file..........",file.name);
      // console.log("files..........",files);
      const bucket = new S3(
        {
          accessKeyId: environment.AWS_ACCESS_KEY,
          secretAccessKey: environment.AWS_SECRET_KEY,
          region: environment.AWS_REGION  
        }
      );

      // upload file to the bucket...........
      const params = {
            Bucket: environment.BUCKET_NAME,
            Key: file.name,
            Body: file,
            ACL: 'public-read'
        };

        //console.log("params...........",params);
        
      bucket.upload(params,  (err: any, data: any) => {
       
        callback(err, data, imageName);

      });


    }
    else {
      //this.alertService.error("No file uploaded.");
    }
  }


  uploadCropedFileToS3Bucket(file: any, fileName: any, type: string ,callback: any) {
    if (file) {
      const bucket = new S3(
        {
          accessKeyId: environment.AWS_ACCESS_KEY,
          secretAccessKey: environment.AWS_SECRET_KEY,
          region: 'ap-south-1'  //Asia Pacific (Mumbai)
        }
      );
   
      const params = {
            Bucket: environment.BUCKET_NAME,
            Key: fileName,         
            Body: file,
            ACL: 'public-read'
        };  
      
      bucket.upload(params,  (err: any, data: any) => {
       
        callback(err, data, type);

      });

    }else {
      
    }
    
  }

  getDateFormat(date : string)
  {
      let formattedDate = '';

      if(date!='')
      {
          let dateValue = new Date(date);
          let monthValue = (dateValue.getMonth() + 1);
          let finalMonthValue : any  = '';
          let dayValue = dateValue.getDate();
          let finalDayValue : any  = '';

          if(monthValue < 10)
          {
              finalMonthValue = '0'+monthValue;
          }
          else
          {
              finalMonthValue = monthValue;
          }

          if(dayValue < 10)
          {
              finalDayValue = '0'+dayValue;
          }
          else
          {
              finalDayValue = dayValue;
          }



          formattedDate =  dateValue.getFullYear()+"-"+finalMonthValue+"-"+ finalDayValue;
      }
      
      return formattedDate;
      
  }


  getTimeFormat(date : string)
  {
      let formattedDate = '';

      if(date!='')
      {
          let dateValue = new Date(date);
          let hours = dateValue.getUTCHours();   
          let finalHours : any  = '';          
          let minutes = dateValue.getUTCMinutes();  
          let finalMinutes : any  = '';
          

           if(hours < 10)
            {
                finalHours = '0'+hours;
            }
            else
            {
                finalHours = hours;
            }


            if(minutes < 10)
            {
              finalMinutes = '0'+minutes;
            }
            else
            {
              finalMinutes = minutes;
            }

            // console.log('hours----', finalHours);
            // console.log('minutes----', finalMinutes);

          formattedDate =  finalHours+":"+finalMinutes;
      }
      
      return formattedDate;
      
  }


}
