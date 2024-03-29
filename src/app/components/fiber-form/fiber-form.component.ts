import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';
import { registerDetail } from 'src/app/Models/ServiceRegister';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { ServicespeedService } from 'src/app/shared/services/servicespeed.service';
import { FileuploadService } from 'src/app/shared/services/fileupload.service';
import { ServiceSpeed } from 'src/app/Models/ServiceSpeed';
import { jsPDF } from 'jspdf';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { DeleteService } from 'src/app/shared/services/delete.service';
import { statusService } from 'src/app/shared/services/status.service';
import * as moment from 'moment';
import domToImage, { Options } from 'dom-to-image';
import { ToastrService } from 'ngx-toastr';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Title } from '@angular/platform-browser';
import { SectorService } from 'src/app/shared/services/sector.service';
import { SectorDto } from 'src/app/Models/sectorDTO';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FeedbackComponent } from '../feedback/feedback.component';
import { FeedbackDto } from 'src/app/Models/feedbackDTO';
import html2canvas from 'html2canvas';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ViewFeedbackComponent } from '../view-feedback/view-feedback.component';

var mimetype = [
  { ext: 'txt', fileType: 'text/plain' },
  { ext: 'pdf', fileType: 'application/pdf' },
  { ext: 'png', fileType: 'image/png' },
  { ext: 'jpg', fileType: 'image/jpeg' },
  { ext: 'jpeg', fileType: 'image/jpeg' },
  { ext: 'gif', fileType: 'image/gif' },
  { ext: 'csv', fileType: 'text/csv' },
  { ext: 'doc', fileType: 'application/vnd.ms-word' },
  { ext: 'docx', fileType: 'application/vnd.ms-word' },
  { ext: 'xls', fileType: 'application/vnd.ms-excel' },
  {
    ext: 'xlsx',
    fileType:
      'application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet',
  },
];
@Component({
  selector: 'app-fiber-form',
  templateUrl: './fiber-form.component.html',
  styleUrls: ['./fiber-form.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state(
        'expanded',
        style({ height: '*', padding: '12px 0', overflowY: 'auto' })
      ),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class FiberFormComponent implements OnInit {

  submit = false;
  isDisabled=false;
  @ViewChild('fileInput', { static: false }) fileInput?: any;
  @ViewChild('contentTopdf', { static: false }) pageEl?: ElementRef;
  fileAttr = 'Choose File ...';
  hideflag: boolean = true;
  esptFlag: boolean = false;
  adminflag: boolean = false;
  param1: any;
  elementName:string=''
  renew = false;
  requestid: any;
  reqid: number = 0;
  serviceSpeedList?: ServiceSpeed[] = [];
  commentsList: any[] = [];
  feedbackList: FeedbackDto[] = [];
  statusList: any[] = [];
  sectorList: SectorDto[] = [];
  actionstatusList: any[] = [];
  actionstatusAdminList: any[] = [];
  datafiles: any[] = [];
  adminflag0: boolean = false;
  isReadonly: boolean = true;
  viewEsptTab:boolean=false;
  showStatus: boolean = false;
  isSales: boolean = false;
  isPreSales: boolean = false;
  isEspt:boolean=false;
  isAdmin:boolean=false;
  signature='';
  signatureName='';
  // RegExpAr = '^[\u0621-\u064A\u0660-\u0669 ]+$';
  RegExpAr = '^[\u0621-\u064A0-9 ]+$';
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns: string[] = [
    'name',
    'Download',
    'creationDate',
    'createdBy',
    'createdByTeam',
  ];
  dataSource = new MatTableDataSource<any>();
  dataSourceEsptFeedback = new MatTableDataSource<any>();
  displayedFeedColumns: string[] = [
    'comment',
    'Availability',
    'Distance',
    'Attachments',
    'creationDate',
    'createdBy',
    'modificationDate',
    'modifyiedBy',
    'Action'
  ];
  @ViewChild(MatSort) sortComment?: MatSort;
  @ViewChild(MatPaginator) paginatorComment?: MatPaginator;
  @ViewChild('paginatorFeedback') paginatorFeedback?: MatPaginator;
  displayedCommentColumns: string[] = [
    'comment',
    'creationDate',
    'createdBy',
    'createdByTeam',
  ];
  dataSourceComment = new MatTableDataSource<any>();
  @ViewChild('contentTopdf', { static: false }) div!: ElementRef;

  constructor(
    private title: Title,
    private statusSer: statusService,
    private route: ActivatedRoute,
    private speedSer: ServicespeedService,
    private fileser: FileuploadService,
    private DeleteService: DeleteService,
    private router: Router,
    private loading:LoadingService,
    private registerSer: ServiceRegisterService,
    private NotificationService: ToastrService,
    private config: ConfigureService,
    private sectorServ: SectorService,
    private toast: ToastrService,
    private dialog:MatDialog
  ) {
    this.title.setTitle('Fiber request form');

    var groupval = this.config.UserTeam();
    if (groupval == 'PresalesFiber_sales') {
      this.esptFlag = false;
      this.adminflag = true;
      this.isSales = true;
    }
    else if (groupval == 'admin_all') {
      this.adminflag = true;
      this.adminflag0 = true;
      this.esptFlag = false;
      this.isReadonly = false;
      this.isAdmin=true;
    }
    else if (groupval == 'PresalesFiber_ESPT') {


      this.isEspt=true;
    }
    else{
      this.isPreSales=true
    }

    this.route.queryParams.subscribe((params: any) => {
      this.param1 = params['id'];
      this.renew = params['renew'];
      if (this.param1 != undefined) {
        this.showStatus = true;

        this.registerSer.getById(this.param1).subscribe(
          (res) => {
            if (res.status == true) {
              this.registerDetail = res.data;
              this.reqid = res.data?.id || 0;
              if (this.registerDetail.serviceTypeID != 2) {
                this.router.navigate(['/']);
              }
                //pending sales
              if (groupval == 'PresalesFiber_sales' && this.registerDetail.statusId == 1 ) {
                this.isSales=true;
                this.isReadonly = true;
                this.viewEsptTab=true;
              }
              //request info can edit
              else if (groupval == 'PresalesFiber_sales' && this.registerDetail.statusId == 2)
              {
                this.isReadonly = false;
                this.viewEsptTab=false;
              }
              else if (groupval == 'PresalesFiber_Presale' &&
                (this.registerDetail.statusId == 3 || this.registerDetail.statusId == 7)
              ) {
                this.isReadonly = false;
              }
              else if (
                groupval == 'PresalesFiber_ESPT' &&
                (this.registerDetail.statusId == 4 ||
                  this.registerDetail.statusId == 5 ||
                  this.registerDetail.statusId == 6)
              ) {
                 this.isReadonly = true;
              } else if (groupval == 'admin_all') {
                this.isReadonly = false;
              }
              this.setReactValue(res.data);
              this.signature=res.data.signature;
            this.signatureName=res.data.signatureName;
            } else this.NotificationService.error(res.error);
          },
          (err) => {
            if (err.status == 401)
              this.router.navigate(['/loginuser'], { relativeTo: this.route });
            else this.NotificationService.warning('! Fail');
          }
        );
      } else {
        this.registerDetail.statusId = 1;
        if (groupval == 'PresalesFiber_sales') {
          this.isReadonly = false;
        }

        this.param1 = 0;
        var tok = this.config.UserToken();
        if (tok == undefined) {
          this.router.navigate(['/loginuser']);
        }
        this.form.reset();
      }
    });

    this.statusSer.getAll().subscribe(
      (res) => {
        if (res.status == true) {
          this.loading.idle();

          this.statusList = res.result?.data;
        } else this.NotificationService.error(res.error);
      },
      (err) => {
        if (err.status == 401) this.router.navigate(['/loginuser']);
        else this.NotificationService.warning('! Fail');
      }
    );

    // this.statusSer.getAllAction().subscribe(res => {
    //   if (res.status == true) {

    //     this.loading.idle();

    //     this.actionstatusList = res.data;

    //   } else this.NotificationService.error(res.error);
    // }, err => {

    //   if (err.status == 401)
    //     this.router.navigate(['/loginuser']);
    //   else
    //     this.NotificationService.warning("! Fail");

    // })
    this.getActions();
  }

  getActions() {
    var groupval = this.config.UserTeam();
    if (groupval == 'PresalesFiber_Presale') {
      this.statusSer.getPreSalesActions().subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            this.actionstatusList = res.data;
          } else this.toast.error(res.error);
        },
        (err) => {
          if (err.status == 401) this.router.navigate(['/loginuser']);
          else this.NotificationService.warning('! Fail');
        }
      );
    } else if (groupval == 'PresalesFiber_ESPT') {
      this.statusSer.getEsptActions().subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            this.actionstatusList = res.data;
          } else this.toast.error(res.error);
        },
        (err) => {
          if (err.status == 401) this.router.navigate(['/loginuser']);
          else this.NotificationService.warning('! Fail');
        }
      );
    } else if (groupval == 'admin_all'){
      this.statusSer.getPreSalesActions().subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            this.actionstatusList = res.data;
          } else this.toast.error(res.error);
        },
        (err) => {
          if (err.status == 401) this.router.navigate(['/loginuser']);
          else this.NotificationService.warning('! Fail');
        }
      );
      this.statusSer.getEsptActions().subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            this.actionstatusList.push(...res.data);
          } else this.toast.error(res.error);
        },
        (err) => {
          if (err.status == 401) this.router.navigate(['/loginuser']);
          else this.NotificationService.warning('! Fail');
        }
      );

    }
    else {
      this.isSales = true;
    }
  }


  public convetToPDF() {

    var elem = document.getElementById('hideStatusId') as HTMLElement;
    var elemA = document.getElementById('hideStatusId0') as HTMLElement;
    var elemB = document.getElementById('hideStatusId1') as HTMLElement;
    var elemc = document.getElementById('hideStatusId2') as HTMLElement;
    var elem0 = document.getElementById('SubmitId') as HTMLElement;
    let div= this.div.nativeElement;
    elem.style.display = 'none';
    elem0.style.display = 'none';
    elemA.style.display = 'none';
    elemB.style.display = 'none';
    elemc.style.display = 'none';

    const options = {
      background: 'white',
      scale: 1,
      allowTaint: false,
      height: div.scrollHeight,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: div.scrollHeight,

    };
    html2canvas(div as HTMLElement, options).then((canvas) => {
      var imgWidth = 210;
      var pageHeight = 290;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;


      var doc = new jsPDF('p', 'mm');
      var position = 0;
      var pageData = canvas.toDataURL('image/jpeg', 1.0);
      var imgData = encodeURIComponent(pageData);

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      doc.setLineWidth(5);
      doc.setDrawColor(255, 255, 255);
      doc.rect(0, 0, 210, 295);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        doc.setLineWidth(5);
        doc.setDrawColor(255, 255, 255);
        doc.rect(0, 0, 210, 295);
        heightLeft -= pageHeight;}
        doc.save(`Fiber Request Form /   ${moment().format('ll')}.pdf`);
    })
        this.NotificationService.success('PDF Downloaded');
        elem.style.display = 'block';
        elem0.style.display = 'block';
        elemA.style.display = 'block';
        elemB.style.display = 'block';
        elemc.style.display = 'block';


  }
  onDownLoad(data: any) {
    var mimeVal = '';
    var extArr = data.name.split('.');
    var extVal = extArr[1];
    for (let i = 0; i < mimetype.length; i++) {
      if (extVal.toLowerCase() == mimetype[i].ext.toLowerCase()) {
        mimeVal = mimetype[i].fileType;
        continue;
      }
    }
    this.fileser.getById(data.id).subscribe(
      (res) => {
        const blob = new Blob([res], { type: mimeVal });
        const file = new File([blob], data.name, { type: mimeVal });
        saveAs(file);
      },
      (err) => {
        if (err.status == 401)
          this.router.navigate(['/loginuser'], { relativeTo: this.route });
        else this.NotificationService.warning(' fail in download file !!');
      }
    );
  }

  onDownLoadAttach(data: any) {
    var mimeVal = '';
    var extArr = data.name.split('.');
    var extVal = extArr[1];
    for (let i = 0; i < mimetype.length; i++) {
      if (extVal.toLowerCase() == mimetype[i].ext.toLowerCase()) {
        mimeVal = mimetype[i].fileType;
        continue;
      }
    }
    this.fileser.getById(data.id).subscribe(
      (res) => {
        const blob = new Blob([res], { type: mimeVal });
        const file = new File([blob], data.name, { type: mimeVal });
        saveAs(file);
      },
      (err) => {
        if (err.status == 401)
          this.router.navigate(['/loginuser'], { relativeTo: this.route });
        else this.NotificationService.warning(' fail in download file !!');
      }
    );
  }






  ngOnInit(): void {
    this.getSectors();
    this.fileser.getAll(this.param1).subscribe(
      (res) => {

        if (res.status == true) {
          this.datafiles = res.data;


          this.dataSource = new MatTableDataSource<any>(this.datafiles);
          //this.dataSource._updateChangeSubscription();
          this.dataSource.paginator = this.paginator as MatPaginator;
        } else {
          //this.NotificationService.Warning(res.error);
        }
      },
      (err) => {
        // this.NotificationService.Warning("fail");
      }
    );

    this.speedSer.getAll(2).subscribe((res) => {
      this.serviceSpeedList = res.result?.data;

    });
    if (this.param1 != undefined) {
      this.getFeedback();
      this.registerSer.getAllComments(this.param1).subscribe((res) => {
        this.commentsList = res.data;

        this.dataSourceComment = new MatTableDataSource<any>(this.commentsList);
        this.dataSourceComment.sort = this.sortComment as MatSort;
        this.dataSourceComment.paginator = this
          .paginatorComment as MatPaginator;
      });
    }

    this.form;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.paginator = this.paginator as MatPaginator;
    this.formComment.controls['registerDetailId'].setValue(
      Number.parseInt(this.param1)
    );
    this.dataSourceComment.sort = this.sortComment as MatSort;
    this.dataSourceComment.paginator = this.paginatorComment as MatPaginator;
    this.dataSourceEsptFeedback.paginator = this.paginatorFeedback as MatPaginator;
  }

  registerDetail: registerDetail = new registerDetail();

  formComment: FormGroup = new FormGroup({
    comment: new FormControl('',[Validators.required,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    registerDetailId: new FormControl(null),
  });
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    managerName: new FormControl('', Validators.required),
    Contact: new FormControl(''),
    serviceTypeID: new FormControl(2),
    ContactName: new FormControl('', [
      Validators.required,
      Validators.pattern(this.RegExpAr),
    ]),
    CompanyName: new FormControl('', [
      Validators.required,
      Validators.pattern(this.RegExpAr),
    ]),
    OtherInformation: new FormControl(''),
    Email: new FormControl('', [Validators.email,Validators.required]),
    Mobile: new FormControl('', [
      Validators.required,
      Validators.minLength(11),
      Validators.maxLength(11),
      Validators.pattern(/^-?(0|[0-9]\d*)?$/),
    ]),
    NumberofCircuits: new FormControl(0),
    FullAddress: new FormControl('', [
      Validators.required,
      Validators.pattern(this.RegExpAr),
    ]),
    ExchangeName: new FormControl(''),
    NearestFixedLineNumber: new FormControl(''),
    ExpectedUpgrades: new FormControl(''),
    contractPeriod: new FormControl(''),
    CircuitProtection: new FormControl(false),
    notes: new FormControl(''),
    PathProtection: new FormControl(false),
    PromisingArea: new FormControl(false),
    serviceSpeedID: new FormControl('', Validators.required),
    numberOfSpeed: new FormControl(0, Validators.required),
    statusId: new FormControl(null),
    status: new FormControl(null),
    acceptstatusId: new FormControl(null),
    rejectionReason: new FormControl(''),
    sectorID: new FormControl(0, Validators.required),
    sector:new FormControl(null),
    serviceType:new FormControl(null),
    acceptableStatus: new FormControl(null),
    serviceSpeed:new FormControl(null),
    signature:new FormControl(''),
    signatureName:new FormControl(''),
    // renewedBy:new FormControl(''),
    // renewedDate:new FormControl(''),
    // canRenew:new FormControl(null),
  });

  getSectors() {
    this.sectorServ.getSectors().subscribe((res) => {
      if (res.status) {
        this.sectorList = res.data;
      } else {
        this.toast.error(res.error);
      }
    });
  }
getFeedback(){
  this.registerSer.getAllFeedbacks(this.param1
    ).subscribe((res) => {
    this.feedbackList = res.data;

    this.dataSourceEsptFeedback = new MatTableDataSource<any>(this.feedbackList);
    this.dataSourceEsptFeedback.paginator = this.paginatorFeedback as MatPaginator;


  });
}
onCreate(){
  const dialogGonfig = new MatDialogConfig();
  dialogGonfig.data = { dialogTitle: 'Add', registerDetailID:this.param1};
  dialogGonfig.disableClose = true;
  dialogGonfig.autoFocus = true;
  dialogGonfig.width = '70%';
  dialogGonfig.height = '600px';
  dialogGonfig.panelClass = 'modals-dialog';
  this.dialog
      .open(FeedbackComponent, dialogGonfig)
      .afterClosed()
      .subscribe((result) => {
        this.getFeedback();

      });
}

viewFeedback(row:any){
  const dialogGonfig = new MatDialogConfig();
  dialogGonfig.data = { dialogTitle: 'View', row: row};
  dialogGonfig.disableClose = true;
  dialogGonfig.autoFocus = true;
  dialogGonfig.width = '40%';
  dialogGonfig.height = '571px';
  dialogGonfig.panelClass = 'modals-dialog';
  this.dialog
      .open(ViewFeedbackComponent, dialogGonfig)
      .afterClosed()
      .subscribe((result) => {


      });

}
onEditFeedback(row:any){
  const dialogGonfig = new MatDialogConfig();
  dialogGonfig.data = { dialogTitle: 'Edit', row: row, registerDetailID:this.param1};
  dialogGonfig.disableClose = true;
  dialogGonfig.autoFocus = true;
  dialogGonfig.width = '70%';
  dialogGonfig.height = '600px';
  dialogGonfig.panelClass = 'modals-dialog';
  this.dialog
      .open(FeedbackComponent, dialogGonfig)
      .afterClosed()
      .subscribe((result) => {
        this.getFeedback();

      });
}
onDelete(id:number){

  this.DeleteService.openConfirmDialog()
  .afterClosed().subscribe(res =>{
    if(res){
      this.registerSer.deleteFeedback(id).subscribe(
        res=>{
      this.toast.success('Successfully Deleted');
      this.getFeedback();
      });

    }
  });

}
  onClear() {
    this.form.reset();
    // this.initializeFormGroup();
    this.form
    this.NotificationService.success(':: Submitted successfully');
  }
  onSubmit() {
debugger
    this.loading.busy();

    this.form.controls.serviceType.setValue(null);
     this.form.controls.sector.setValue(null);
    this.form.controls.status.setValue(null);
    this.form.controls.acceptableStatus.setValue(null);
    this.form.controls.serviceSpeed.setValue(null);
    const p = { ...this.registerDetail, ...this.form.value };

    if (this.form.valid) {
      this.submit = false;
      if (p.id === 0) {

        this.registerSer.Add(p).subscribe(
          (res) => {

            if (res.status == true) {

              this.NotificationService.success(':: Successfully Submited');
              this.loading.idle();
              this.router.navigate(['/fiber']);
              this.form.reset();
              this.initializeFormGroup();
              this.isDisabled=true;
            } else {
              this.NotificationService.error(res.error);
              this.isDisabled=true;
            }
          },
          (err) => {
            this.loading.idle();
            if (err.status == 401) this.router.navigate(['/login']);
            else this.NotificationService.warning('! Fail');
          }
        );
      } else {

        this.registerSer.Update(p).subscribe(
          (res) => {


            if (res.status == true) {

              this.NotificationService.success(':: Successfully Updated');
              this.loading.idle();
              this.router.navigate(['/fiber']);
              this.form.reset();
              this.initializeFormGroup();
              this.isDisabled=true;
            } else {
              this.NotificationService.error(res.error);
              this.isDisabled=true;
            }
          },
          (err) => {
            this.loading.idle();
            if (err.status == 401) this.router.navigate(['/login']);
            else this.NotificationService.warning('! Fail');
          }
        );

      }
    } else {
      this.loading.idle();
      this.submit = true;
      return;
    }

  }






  saveComment() {
    this.loading.busy();
    if (this.formComment.valid) {
      this.registerSer.AddComment(this.formComment.value).subscribe(
        (res) => {
          this.loading.idle();
          if (!this.commentsList) this.commentsList = [];
          if (res.status) {
            this.commentsList.push(res.data);
            this.dataSourceComment = new MatTableDataSource<any>(
              this.commentsList
            );
            this.dataSourceComment._updateChangeSubscription();
            this.dataSourceComment.sort = this.sortComment as MatSort;
            this.dataSourceComment.paginator = this
              .paginatorComment as MatPaginator;
            this.NotificationService.success(':: Submitted successfully');
          } else this.NotificationService.error(res.error);
        },
        (err) => {
          this.loading.idle();
          if (err.status == 401)
            this.router.navigate(['/loginuser'], { relativeTo: this.route });
          else this.NotificationService.warning('! Fail');
        }
      );
      this.formComment.reset();
      this.initializeformCommentGroup();
    } else {
      this.loading.idle();
    }
  }
  setReactValue(reqreact: registerDetail) {
    this.form.patchValue({
      id: reqreact.id,
      $key: null,
      managerName: reqreact.managerName,
      Contact: reqreact.contact,
      ContactName: reqreact.contactName,
      CompanyName: reqreact.companyName,
      OtherInformation: reqreact.otherInformation,
      Email: reqreact.email,
      Mobile: reqreact.mobile,
      NumberofCircuits: reqreact.numberOfCircuits,
      FullAddress: reqreact.fullAddress,
      ExchangeName: reqreact.exchangeName,
      NearestFixedLineNumber: reqreact.nearestFixedLineNumber,
      ExpectedUpgrades: reqreact.expectedUpgrades,
      Name: reqreact.name,
      contractPeriod: reqreact.contractPeriod,
      CircuitProtection: reqreact.circuitProtection,
      notes: reqreact.notes,
      PathProtection: reqreact.pathProtection,
      PromisingArea: reqreact.promisingArea,
      serviceTypeID: 2,
      serviceType:reqreact.serviceType,
      serviceSpeedID: reqreact.serviceSpeedID,
      numberOfSpeed: reqreact.numberOfSpeed,
      statusId: reqreact.statusId,
      acceptstatusId: reqreact.acceptstatusId,
      rejectionReason: reqreact.rejectionReason,
      sectorID: reqreact.sectorID,
      sector: reqreact.sector,
      status:reqreact.status,
      acceptableStatus: reqreact.acceptableStatus,
      serviceSpeed:reqreact.serviceSpeed,
      signature:reqreact.signature,
      signatureName:reqreact.signatureName,
    });
  }

  initializeFormGroup() {
    this.form.setValue({
      $key: null,
      managerName: '',
      Contact: '',
      ContactName: '',
      CompanyName: '',
      OtherInformation: '',
      Email: '',
      Mobile: '',
      NumberofCircuits: 0,
      numberOfSpeed: 0,
      FullAddress: '',
      ExchangeName: '',
      NearestFixedLineNumber: '',
      ExpectedUpgrades: '',
      contractPeriod: '',
      notes: '',
      CircuitProtection: false,
      PathProtection: false,
      PromisingArea: false,
      serviceTypeID: 2,
      serviceSpeedID: 0,
      statusId: null,
      status: null,
      serviceType:null,
      serviceSpeed:null,
      acceptstatusId: null,
      acceptableStatus:null,
      rejectionReason: '',
      sector: null,
      sectorID:0
    });
  }
  initializeformCommentGroup() {
    this.formComment.setValue({
      registerDetailId: null,
      comment: '',
    });
  }
  //   @ViewChild('logoInput', {
  //     static: true
  // }) logoInput:any;
  fileVal: any;
  Upload() {
    if (this.fileAttr == 'Choose File ...') {
      return;
    }

    this.loading.busy();
    let formData = new FormData();
    formData.append('formFile', this.fileVal);

    this.fileser.addfile(formData, this.param1).subscribe(
      (res) => {
        this.loading.idle();

        this.resetfile();
        if (res.status) {
          this.NotificationService.success('Uploaded');
          if (!this.datafiles) this.datafiles = [];
          this.datafiles?.push(res.data);
          this.dataSource = new MatTableDataSource<any>(this.datafiles);
        } else this.NotificationService.error(res.error);
      },
      (err) => {
        if (err.status == 401)
          this.router.navigate(['/loginuser'], { relativeTo: this.route });
        else this.NotificationService.warning('! Fail');
      }
    );
  }

  uploadFileEvt(imgFile: any) {
    // this.fileuploaded = imgFile.target.files[0];

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileVal = imgFile.target.files[0];
      this.fileAttr = '';
      this.fileAttr=this.fileVal.name;
      // Array.prototype.forEach.call(imgFile.target.files, (file) => {
      //   this.fileAttr += file.name;
      // });

      // HTML25 FileReader API
      // let reader = new FileReader();
      // reader.onload = (e: any) => {
      //   let image = new Image();
      //   image.src = e.target.result;
      //   image.onload = (rs) => {
      //     let imgBase64Path = e.target.result;
      //   };
      // };
      // reader.readAsDataURL(imgFile.target.files[0]);
      // imgFile.target.files[0] = '';
    } else {
      this.fileAttr = 'Choose File ...';
    }
  }
  resetfile() {
    this.fileAttr = 'Choose File ...';
    (this.fileInput as ElementRef).nativeElement.value = '';
  }




  expand(row:any,elem:string){
    if(elem=='Attach'){
      this.elementName='Attach'
    row.isExpanded=!row.isExpanded
    }
    else{
      this.elementName='Comment'
      row.isExpanded=!row.isExpanded
    }
  }
}
