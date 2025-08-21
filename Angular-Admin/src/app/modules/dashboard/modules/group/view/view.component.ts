import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/shared/services/alert.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ApolloClientService } from 'src/app/shared/services/apollo-client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/shared/models/groups.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})

export class ViewGroupComponent implements OnInit, OnChanges{

  @Input() groupId!: any;
  // groupData: Group = {
  //   name: '',
  //   // description: '',
  //   // image: ''
  // };
  groupData!: any;
  

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
    
   // console.log('child : ',this.groupId);
    //console.log('child : ',this.groupId);
               
        if(this.groupId)
        {
           this.getgroupDetails();
        }
  }

  ngOnChanges(changes: any) {   
    //console.log(changes);
    for (const propName in changes) {
      const chng = changes[propName];
      this.groupId = chng.currentValue; //JSON.stringify(chng.currentValue);
      // const prev = JSON.stringify(chng.previousValue);

      //console.log('ngOnChanges : ',this.groupId);
    }

    if(this.groupId)
    {
       this.getgroupDetails();
    }
  }


  getgroupDetails()
  {
    const params:any= {};
    params['getMyCommunityGroupByIdId'] = this.groupId;

    this.loaderService.show();

    this.apolloClient.setModule('getMyCommunityGroupByID').mutateData(params).subscribe((response: any) => {
      this.loaderService.hide();
      if(response.error) {
        this.alertService.error(response.message);
      } else {

        this.groupData = response.data;
        //console.log(this.groupData);


        // this.groupForm.patchValue({
        //   name: groupData.name ? groupData.name : '',
        //   description: groupData.description ? groupData.description : '',
        //   type: groupData.type ? groupData.type : ''
        // });

      }
    });

  }



}
