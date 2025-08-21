import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validation } from 'src/app/shared/validator/validation';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StorageService } from 'src/app/shared/services/storage.service';
declare const $:any;
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit{
  otpForm!: FormGroup;
  siteKey:string =environment.siteKey;
  submitted = false;
  disabledButton: boolean = false;
  userId!: string;
  disableOtpResend : boolean = false;

  @ViewChild('focus_field') focus_field!: ElementRef<HTMLInputElement>;
  constructor(
    private loaderService: LoaderService,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private StorageService: StorageService,
  ){

  }
  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(){
    this.focus_field.nativeElement.focus();
  }

  init(){
    let firstNumber = new FormControl('', [Validators.required]);
    let secondNumber = new FormControl('', [Validators.required]);
    let thirdNumber = new FormControl('', [Validators.required]);
    let fourthNumber = new FormControl('', [Validators.required]);
    let fifthNumber = new FormControl('', [Validators.required]);
    let sixthNumber = new FormControl('', [Validators.required]);
    this.otpForm = new FormGroup({
      //otp: new FormControl(null, [Validators.required,Validators.min(100000),Validators.max(999999)]),
      first_number: firstNumber,
      second_number: secondNumber,
      third_number: thirdNumber,
      fourth_number: fourthNumber,
      fifth_number: fifthNumber,
      sixth_number: sixthNumber,
      recaptcha: new FormControl(null,[Validators.required])
    });
  }

  numericOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;   
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43 || charCode == 32) {
      return false;
    }
    return true;
  }

  submit(){
    this.disabledButton = true;
    let first_number = this.otpForm.controls['first_number'].value;
    let second_number = this.otpForm.controls['second_number'].value;
    let third_number = this.otpForm.controls['third_number'].value;
    let fourth_number = this.otpForm.controls['fourth_number'].value;
    let fifth_number = this.otpForm.controls['fifth_number'].value;
    let sixth_number = this.otpForm.controls['sixth_number'].value;
    let otp = first_number + second_number + third_number + fourth_number + fifth_number + sixth_number;
    if(first_number === '' || first_number === null){
      this.alertService.error("Otp is required");
      return;
    }
    if(second_number === '' || second_number === null){
      this.alertService.error("Otp is required");
      return;
    }
    if(third_number === '' || third_number === null){
      this.alertService.error("Otp is required");
      return;
    }
    if(fourth_number === '' || fourth_number === null){
      this.alertService.error("Otp is required");
      return;
    }
    if(fifth_number === '' || fifth_number === null){
      this.alertService.error("Otp is required");
      return;
    }
    if(sixth_number === '' || sixth_number === null){
      this.alertService.error("Otp is required");
      return;
    }
    if(this.otpForm.controls['recaptcha'].value === '' || this.otpForm.controls['recaptcha'].value === null){
      this.alertService.error("Recaptcha is missing");
      return;
    }
    let getOtp = parseInt(otp);  
    const data = {
      "data": {
        otp : getOtp
      }
    }
    this.submitted = true;
    this.loaderService.show();
    this.apolloClient.setModule("verifyOtp").mutateData(data).subscribe((response:any) => {
    this.loaderService.hide();
     //console.log("error......",response);
    //  if(response.data === undefined || null || ''){
    //   if(response?.extensions.exception.code === 401){
    //     this.alertService.error(response.message);
    //   }
    //   else{
    //   //if(response?.extensions.exception.code === 400){
    //     this.alertService.error(response.message);
    //   }
    //  }
    if(response.error){
      this.alertService.error(response.message)
    }
     else{
      const token = response.data.token.accessToken;
        //console.log("token......",token);
        //console.log(response.data);
        this.userId = response.data.user.id;
        //console.log(this.userId);
        this.StorageService.setLocalStorageItem('userId',this.userId);
        this.StorageService.setLocalStorageItem('currency',response.data.orgCurrency);
        this.authService.setToken(token);
        this.router.navigateByUrl('/dashboard');
     
     }
      
        
      
      // if(response.error) {
      //   if(response.code === 400) {
      //     // Sow toaster
      //     this.alertService.error(response.message);
      //   }else{
      //     this.alertService.error("Timed out.");
      //     //this.router.navigateByUrl('auth/forget-password');
      //   }
      // } else {
      //   // Redirect to the password change page.
      //   const token = response.data.token.accessToken;
      //   this.authService.setToken(token);
      //   this.router.navigateByUrl('/dashboard');
      // }
  });
}

otpResend() {

  if(!this.disableOtpResend)
  {
   
        this.authService.resendOtpRefreshToken();
        this.disableOtpResend = true;

        setTimeout(() => {
          this.disableOtpResend = false;
          }, 20000);
  }
  

  // setTimeout(() => {
  //   let currentField : any = document.getElementById(currentFieldID);
  //   currentField.type = "password";
  // }, 500);

  // this.loaderService.show();
  // this.apolloClient.setModule("resendOtp").mutateData('').subscribe((response:GeneralResponse) => {
  //   this.loaderService.hide();
  //   if(response.error) {
  //     console.log("response......",response);
  //     if(response.code === 401) {
  //       this.alertService.error("Timed out.");
  //       // this.router.navigateByUrl('auth/forget-password');
  //     }else{
  //       this.alertService.error(response.message);
  //     }
  //   } else {
  //     this.alertService.success(response.message);
  //   }
  // });
}

filterCharOnKeyDown(current:any, currentFieldID:any) {    
  if (current.key.length >= 1) {
    if(['ArrowRight', 'ArrowLeft', 'Tab', 'ArrowUp', 'ArrowDown', 'Shift', 'Control', 'Alt'].includes(current.key)) return;
    if(current.key !== "Backspace" && current.key !== "Delete") {
      if(isNaN(current.key)) {
        return false;
      }
      else
      {
        setTimeout(() => {
          let currentField : any = document.getElementById(currentFieldID);
          currentField.type = "password";
     }, 500);
      }
    }
  }
  return;
 }

 movetoNext(current:any, nextFieldID:any) {
  //console.log("current.....",current);
  
  if (current.key.length >= 1) {
    if(['ArrowRight', 'ArrowLeft', 'Tab', 'ArrowUp', 'ArrowDown', 'Shift', 'Control', 'Alt'].includes(current.key)) return;
    if(current.key !== "Backspace" && current.key !== "Delete") {
      if(isNaN(current.key)) {
        return false;
      }
      if(nextFieldID) {
        setTimeout(() => {
              document.getElementById(nextFieldID)!.focus();
             // let currentField : any = document.getElementById(currentFieldID);
             // currentField.type = "password";
         }, 20);
      }
    } else {
      // Backspace pressed
      let prevEle = $(current.target).prev();
      //console.log("prevEle........",prevEle);
      
      if(prevEle) {
        prevEle.focus();
      }
    }
  }
  return;
}

movetoPrev(current:any, prevFieldID:any) {
  //console.log(current.key.length);
  
if (current.key.length <= 1) {
  document.getElementById(prevFieldID)!.focus();
}
}


}
