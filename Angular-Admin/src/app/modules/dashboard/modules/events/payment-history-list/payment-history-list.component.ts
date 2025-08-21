import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { paramService } from 'src/app/shared/params/params';
import { GeneralResponse } from 'src/app/shared/interfaces/general-response.ineterface';
import { PaymentHistory, SinglePaymentDetails } from 'src/app/shared/models/payment-history.model';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

declare var window: any;


@Component({
  selector: 'app-payment-history-list',
  templateUrl: './payment-history-list.component.html',
  styleUrls: ['./payment-history-list.component.css']
})
export class PaymentHistoryListComponent implements OnInit, OnDestroy {
  private eventIdSubscriber!: Subscription;
  eventId: any;
  eventPaymentId: any;
  paymentList: PaymentHistory[] = [];
  current: number = 1;
  limit: number = 10;
  $payment_model: any;
  getEventPaymetValue: any;
  // singlePaymentDetails: SinglePaymentDetails[] = [];
  singlePaymentDetails: any;
  totalData!: any;
  totalPageNo!: number;
  from: any;
  to: any;
  paymentMode = ["Cash", "Check", "Zelle", "Paypal"];
  paymentSubmitForm !: FormGroup;
  updateFormPaymentId!: string;
  checkboxCheck: any;
  paymentEventDetails!: any;
  searchForm!: FormGroup;
  filterForm!: FormGroup;
  showSearchInput: boolean = false;





  constructor(
    private activatedRoute: ActivatedRoute,
    private apolloClient: ApolloClientService,
    private alertService: AlertService,
    private paramService: paramService,
    private loaderService: LoaderService,
    private builder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.eventPaymentId = this.activatedRoute.snapshot.params['id'];
    if (this.eventPaymentId) {
      this.getPaymentList(this.eventPaymentId, this.current);
      this.getPaymentModuleName(this.eventPaymentId)
    }
    this.eventIdSubscriber = this.activatedRoute.paramMap.subscribe({
      next: params => {
        this.eventId = params.get('id');
      },
      error: err => { }
    })
    this.countNum();
    this.paymentSubmitForm = this.builder.group({
      paymentId: this.updateFormPaymentId,
      rsvpStatus: ["paid"],
      paymentDetails: this.builder.group({
        actualPaymentmtount: [],
        checkNo: [''],
        description: [''],
        gatewayChargeCost: [],
        paymentMode: ['',Validators.required],
        paymentStatus: [true],
        transactionAmount: [],
        transactionId: [''],
      }),
    });

    // Listen for changes in the paymentMode control
    this.paymentSubmitForm.get('paymentDetails.paymentMode')?.valueChanges.subscribe((mode) => {
      // Check if the mode is not 'Check', then clear the checkNo value
      if (mode !== 'Check') {
        this.paymentSubmitForm.get('paymentDetails.checkNo')?.reset('');
      }
      if (mode !== 'Paypal' || mode !== 'Zelle') {
        this.paymentSubmitForm.get('paymentDetails.transactionId')?.reset('');
      }
    });

    this.generateSearchForm();

  }

  //** SEARCH FUNCTION */
  generateSearchForm() {
    this.filterForm = new FormGroup({
      status: new FormControl('')
    });

    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  //**clear search form */
  clearDateFilter() {
    this.filterForm.controls['status'].setValue('');
    this.searchForm.controls['search'].setValue('');
    this.current = 1;
    this.getPaymentList(this.eventPaymentId, this.current)
  }

  public back() {
    this.router.navigateByUrl('/events');
  }


  ngOnDestroy(): void {
    if (this.eventIdSubscriber) {
      this.eventIdSubscriber.unsubscribe();
    }
  }

  countNum() {
    const counters = document.querySelectorAll(".counter");
    //console.log(counters);
    counters.forEach((counter: any) => {
      counter.innerText = "0";
      const updateCounter = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const increment = target / 2000;
        if (count < target) {
          counter.innerText = `${Math.ceil(count + increment)}`;
          setTimeout(updateCounter, 1);
        } else counter.innerText = target;
      };
      updateCounter();
    });
  }

  /**Using for redirect to task management list*/
  redirectToEvent() {
    this.router.navigateByUrl('events/task-management-list/' + this.eventId);
  }

  /**Using for redirect to Supply management list*/
  redirectToSupplyList() {
    this.router.navigateByUrl('events/supply-management/list/' + this.eventId);
  }

  /**Using for redirect to Event memory list*/
  redirectToEventMemory() {
    this.router.navigateByUrl('events/memory-management/event-memory-list/' + this.eventId);
  }

  //** get payment module name */
  getPaymentModuleName(id: any) {
    const params: any = {};
    params['getMyCommunityEventByIdId'] = id;

    // this.loaderService.show();

    this.apolloClient.setModule('getMyCommunityEventByID').queryData(params).subscribe({
      next: (res: GeneralResponse) => {
        this.paymentEventDetails = res?.data
      },
      error: (err) => {
        console.log(err);
      }
    });

    // this.loaderService.hide();
  }

  //**get payment listing */
  getPaymentList(id: any, page: Number) {
    const params: any = {};
    params['data'] = {
      eventId: id,
      page: page
    }


    if(this.searchForm?.value?.search && this.searchForm?.value?.search!=''){
      params['data'].search = this.searchForm?.value?.search.trim();
     }

    this.loaderService.show();

    this.apolloClient.setModule('getAllEventPayment').queryData(params).subscribe({
      next: (res: GeneralResponse) => {
        this.loaderService.hide();
        this.paymentList = res?.data?.payment;
        this.totalData = res?.data.total;
        this.from = res.data?.from;
        this.to = res.data?.to;
        // console.log(this.totalData, "<--------------------data-Resp");
        if (res?.data.total !== 0) {
          this.totalPageNo = Math.ceil(res?.data.total / this.limit);
        } else {
          this.totalPageNo = 0;
        }
      },
      error: (err) => {
        console.log(err);
        this.loaderService.hide();
      }
    });

    // this.loaderService.hide();
  }


  //** Get Single Pyament Details */
  getEventPaymentById(id: any) {
    console.log(id, "sng pay id ");

    const params: any = {};
    params['data'] = {
      paymentId: id
    }

    this.apolloClient.setModule('getEventPaymentById').queryData(params).subscribe({
      next: (res: GeneralResponse) => {
        this.singlePaymentDetails = res?.data
        // console.log(this.singlePaymentDetails, "<---------------------Resp");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  /** modal for click on payment in table list --- show in modal*/
  payment_model(getData: any, paymentId: string) {
    this.updateFormPaymentId = paymentId;
    this.$payment_model = new window.bootstrap.Modal(
      document.getElementById("single_payment_modal")
    );
    this.getEventPaymentById(paymentId)
    this.$payment_model.show();
    // this.getEventPaymetValue = getData;
    // this.taskId = taskId;
  }


  //**Payment submit model */
  payment_submit_model(id: any, event: any) {
    this.checkboxCheck = event

    this.$payment_model = new window.bootstrap.Modal(
      document.getElementById("payment_form_modal")
    );

    // Set the paymentId value in the form
    this.paymentSubmitForm.patchValue({
      paymentId: id, // Assuming id is the value you want to assign
    });

    this.$payment_model.show();
    // this.getEventPaymetValue = getData;
    // this.taskId = taskId;
  }

  //** on submit */
  onSubmit() {
    // console.log(this.paymentSubmitForm.value);
    if (this.paymentSubmitForm.valid) {
      let params: any = {};
      params['data'] = this.paymentSubmitForm.value

      this.loaderService.show();
      this.apolloClient.setModule('updateEventPayment').mutateData(params).subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          // console.log(res, "<-------resp");
          this.$payment_model.hide();
          this.getPaymentList(this.eventPaymentId, this.current);
          this.alertService.success(res.message);
        },
        error: (err) => {
          console.log(err);
          this.alertService.error(err.message);
          this.$payment_model.hide();
          this.loaderService.hide();
        }
      })
    }
    //   const paymentDetails = this.paymentSubmitForm.get('paymentDetails').value;
    // console.log(paymentDetails);

  }

  //**pagination funnctions Start */
  public onGoTo(page: number): void {
    this.current = page
    this.getPaymentList(this.eventPaymentId, this.current);
  }

  public onNext(page: number): void {
    this.current = page + 1;
    this.getPaymentList(this.eventPaymentId, this.current);

  }

  public onPrevious(page: number): void {
    this.current = page - 1;
    this.getPaymentList(this.eventPaymentId, this.current);

  }
  //**pagination funnctions End */

  //** Paid status update */ not useing now
  // changePaymentStatusAlert(event: any, id: string) {
  //   Swal.fire({
  //     title: 'Are you sure you want to change this payment status?',
  //     text: '',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Ok',
  //     cancelButtonText: 'Cancel'
  //   }).then((result) => {
  //     // if(result.value){
  //     //   this.changePaymentStatus(id);
  //     // }
  //     if (result.dismiss === Swal.DismissReason.cancel) {
  //       // If Cancel clicked, uncheck the checkbox
  //       event.target.checked = false;
  //     } else if (result.value) {
  //       event.target.disabled = true;
  //       this.changePaymentStatus(id);
  //     }
  //   })
  // };
  //** Paid status update api calling */
  // changePaymentStatus(paymentId: any) {
  //   const params: any = {};
  //   params['data'] = {
  //     paymentId: paymentId,
  //     rsvpStatus: "paid"
  //   }

  //   this.loaderService.show();
  //   this.apolloClient.setModule('updateEventPayment').mutateData(params).subscribe({
  //     next: (res: any) => {
  //       this.loaderService.hide();
  //       // console.log(res, "<-------resp");
  //       this.alertService.success(res.message)
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.alertService.error(err.message)
  //     }
  //   })
  // };

  deleteEvent(paymentId: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this payment ?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {

        const params: any = {};
        params['data'] = {
          paymentId: paymentId
        }

        this.loaderService.show();
        this.apolloClient.setModule('deleteEventPayment').mutateData(params).subscribe({
          next: (res: any) => {
            this.loaderService.hide();
            console.log(res, "<-------resp");
            this.getPaymentList(this.eventPaymentId, this.current);
            this.alertService.success(res.message)
          },
          error: (err) => {
            console.log(err);
            this.alertService.error(err.message)
          }
        })
      }

    })
  }

  /**Using for close the  modal */
  closeModal(event: any) {
    this.paymentSubmitForm.reset();
    this.checkboxCheck.target.checked = false
    this.$payment_model.hide();
    // this.otpSubmissionForm.controls['otp'].setValue('');
  }

  clearPaymentMode() {
    this.paymentSubmitForm.controls['paymentDetails.checkNo'].setValue('')
  }

  showSearch(){
    this.showSearchInput = !this.showSearchInput;
  }

  formatCardNumber(cardNo: string): string {
    const visibleDigits = 4;
    const maskedSection = 'X'.repeat(cardNo.length - visibleDigits);
    const lastDigits = cardNo.slice(-visibleDigits);
    return `${maskedSection} ${lastDigits}`;
  }

  console() {
    console.log("<------working------------>");

  }
}
