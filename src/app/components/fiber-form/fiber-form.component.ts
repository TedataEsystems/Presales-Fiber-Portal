import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';
import { NotificationService} from 'src/app/shared/services/notification.service';
import { registerDetail } from 'src/app/Models/ServiceRegister';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { ServicespeedService } from 'src/app/shared/services/servicespeed.service';
import { FileuploadService } from 'src/app/shared/services/fileupload.service';
import { ServiceSpeed } from 'src/app/Models/ServiceSpeed';
import * as jspdf from 'jspdf';
import { jsPDF } from 'jspdf';


import html2canvas from 'html2canvas';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { statusService } from 'src/app/shared/services/status.service';
import { AmiriFontService } from 'src/app/shared/services/amiri-font.service';
import * as moment from 'moment';
import domToImage, { Options } from 'dom-to-image';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Title } from '@angular/platform-browser';


var mimetype=[
  {ext:"txt", fileType:"text/plain"},
  {ext:"pdf", fileType:"application/pdf"},
  {ext:"png", fileType:"image/png"},
  {ext:"jpg", fileType:"image/jpeg"},
  {ext:"jpeg",fileType: "image/jpeg"},
  {ext:"gif", fileType:"image/gif"},
  {ext:"csv", fileType:"text/csv"},
  {ext:"doc", fileType:"application/vnd.ms-word"},
  {ext:"docx",fileType: "application/vnd.ms-word"},
  {ext:"xls", fileType:"application/vnd.ms-excel"},
  {ext:"xlsx",fileType: "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"},

];
@Component({
  selector: 'app-fiber-form',
  templateUrl: './fiber-form.component.html',
  styleUrls: ['./fiber-form.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', padding: '12px 0',overflowY: 'auto' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class FiberFormComponent implements OnInit {
  loading=false;
  @ViewChild('fileInput',{static:false}) fileInput?: any;
  @ViewChild('contentTopdf',{static:false}) pageEl?: ElementRef;
  fileAttr = 'Choose File ...';
  hideflag:boolean=true;
  esptFlag:boolean=false;
adminflag:boolean=false;
  param1:any;
  requestid:any;
  reqid:number=0;
  serviceSpeedList?:ServiceSpeed[]=[];
  commentsList:any[]=[];
  statusList:any[]=[];
  actionstatusList:any[]=[];
  datafiles:any[]=[];
  adminflag0:boolean=false;
  isReadonly:boolean=true;
  isSales:boolean=false;
  RegExpAr="^[\u0621-\u064A\u0660-\u0669 ]+$";
  constructor(private title:Title ,private statusSer:statusService,private route: ActivatedRoute,private speedSer:ServicespeedService,private fileser: FileuploadService ,
    private router: Router,private registerSer:ServiceRegisterService,private NotificationService:ToastrService,private config:ConfigureService) {

   this.title.setTitle("Fiber request form")

      var groupval= this.config.UserTeam();
      if(groupval=="PresalesFiber_sales"){
        this.esptFlag=false
       this.adminflag=true;
       this.isSales=true;
       };
        if(groupval=="admin_all"){
           this.adminflag=true;
       this.adminflag0=true; this.esptFlag=false;this.isReadonly=false;
       }
      this.route.queryParams.subscribe((params:any) => {
        this.param1 = params['id'];
                  if(this.param1!=undefined){

          this.registerSer.getById(this.param1).subscribe((res)=>{
             if(res.status==true){
              this.registerDetail=res.data ;
              this.reqid=res.data?.id||0;
              if(this.registerDetail.serviceTypeID!=2){
          this.router.navigate(['/'] );
              }
               console.log(this.registerDetail);
               if(groupval=="PresalesFiber_sales"&&(this.registerDetail.statusId==1||this.registerDetail.statusId==2))
               {
                    this.isReadonly=false;
               }
               else if(groupval=="PresalesFiber_Presale"&&(this.registerDetail.statusId==3||this.registerDetail.statusId==7))
               {
                    this.isReadonly=false;
               }
               else if(groupval=="PresalesFiber_ESPT"&&(this.registerDetail.statusId==4||this.registerDetail.statusId==5||this.registerDetail.statusId==6))
               {
                    this.isReadonly=false;
               }
               else if(groupval=="admin_all"){
                 this.isReadonly=false;
               }
             this.setReactValue(res.data);

            }else
            this.NotificationService.error(res.error)
          },err=>{
            if(err.status==401)
            this.router.navigate(['/loginuser'], { relativeTo: this.route });
            else
            this.NotificationService.warning("! Fail");

          }
          );
        }
        else
        {
        this.registerDetail.statusId=1;
        if(groupval=="PresalesFiber_sales"){
          this.isReadonly=false;
          };

          this.param1=0;  var tok= this.config.UserToken();
          if(tok==undefined){
          this.router.navigate(['/loginuser'] );
        }
        this.form.reset();

      }

    });

    this.statusSer.getAll().subscribe(res=>{
      if(res.status==true){

        this.loading = false;

     this.statusList = res.result?.data;


      }else this.NotificationService.error(res.error);
    },err=>{

      if(err.status==401)
      this.router.navigate(['/loginuser'] );
      else
      this.NotificationService.warning("! Fail");


    })

    this.statusSer.getAllAction().subscribe(res => {
      if (res.status == true) {

        this.loading = false;

        this.actionstatusList = res.data;


      } else this.NotificationService.error(res.error);
    }, err => {

      if (err.status == 401)
        this.router.navigate(['/loginuser']);
      else
        this.NotificationService.warning("! Fail");


    })

     }
     @ViewChild(MatSort) sort?:MatSort ;
     @ViewChild(MatPaginator) paginator?:MatPaginator ;
     displayedColumns: string[] = [ 'name','Download' , 'creationDate', 'createdBy','createdByTeam' ];
     dataSource = new MatTableDataSource<any>();
     @ViewChild(MatSort) sortComment?:MatSort ;
     @ViewChild(MatPaginator) paginatorComment?:MatPaginator ;
     displayedCommentColumns: string[] = [ 'comment', 'creationDate', 'createdBy','createdByTeam' ];
     dataSourceComment = new MatTableDataSource<any>();
     @ViewChild('contentTopdf',{static:false}) div !: ElementRef;


     public convetToPDF() {
    //  this.hideflag=false;
   // this.loading=true;
debugger;
    window.scrollTo(0,0);
     var elem = document.getElementById('hideStatusId') as HTMLElement;
     var elemA = document.getElementById('hideStatusId0') as HTMLElement;
     var elemB = document.getElementById('hideStatusId1') as HTMLElement;
     var elemc = document.getElementById('hideStatusId2') as HTMLElement;
     var elem0 = document.getElementById('SubmitId') as HTMLElement;
       elem.style.display = 'none';
      elem0.style.display = 'none';
      elemA.style.display = 'none';
      elemB.style.display = 'none';
      elemc.style.display = 'none';

      const pdfTable = this.pageEl?.nativeElement;
let pdf =new jsPDF();
      //const div = document.getElementById('contentToConvert');
      console.log('div:',this.div )

      const options = {
        background: 'white',
        scale: 2
      };
      // ----------------test-----------------------------------------------------------------//


        const width = this.div.nativeElement.clientWidth;
        const height = this.div.nativeElement.clientHeight + 40;
        let orientation = '';
        let imageUnit = 'pt';
        if (width > height) {
        orientation = 'l';
        } else {
        orientation = 'p';
        }
        domToImage.toPng(this.div.nativeElement, {
        width: width,
        height: height
        })
        .then(result => {

        let jsPdfOptions = {
        orientation: orientation,
        unit: imageUnit ,
        format: [width + 50, height + 220]
        };

       // const pdf = new jsPDF(jsPdfOptions);

        const pdf = new jsPDF({
          orientation: "p",
          unit: "pt",
          format: [width + 50, height + 115]
        });

        // pdf.setFontSize(48);
        // pdf.setTextColor('#2585fe');
       // pdf.text(this.pdfName.value ? this.pdfName.value.toUpperCase() : 'Untitled dashboard'.toUpperCase(), 25, 75);
        // pdf.setFontSize(24);
        // pdf.setTextColor('#131523');
        //pdf.text('Report date: ' + moment().format('ll'), 10, 10);
        pdf.addImage(result, 'PNG', 25, 115, width, height);
        pdf.save(`Fiber Request Form /   ${moment().format('ll')}.pdf`);

       this.NotificationService.success("PDF Downloaded");
       elem.style.display = 'block';
       elem0.style.display = 'block';
       elemA.style.display = 'block';
       elemB.style.display = 'block';
       elemc.style.display = 'block';
        }).catch(error => {
        });






//----------------------------/test----------------------------------------------------//
  //     html2canvas(div as HTMLElement, options).then((canvas) => {
  //   debugger;

  //       var img = canvas.toDataURL("image/PNG");
  //       var doc = new jsPDF('l', 'mm', 'a4');

  //      // // Add image Canvas to PDF
  //       const bufferX = 5;
  //       const bufferY = 5;
  //       const imgProps = (<any>doc).getImageProperties(img);
  //       const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //       console.log(pdfHeight + " / "+pdfWidth)
  //        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, 220, undefined, 'FAST');
  //      // doc.addImage(img, 'PNG', bufferX, bufferY, 268, 200, undefined, 'FAST');
  // debugger;
  //       return doc;
  //     }).then((doc) => {

  //   doc.save(`Fiber${Date.now()}.pdf`);
  //   this.loading=false;

  //      this.NotificationService.success("pdf downloaded");
  //      elem.style.display = 'block';
  //      elem0.style.display = 'block';
  //      elemA.style.display = 'block';
  //     });


    }



onDownLoad(data:any){
  var mimeVal=""
   var extArr= data.name.split('.')
   var extVal=extArr[1];
  for(let i=0;i<mimetype.length;i++){
    if(extVal.toLowerCase()==mimetype[i].ext.toLowerCase()){
      mimeVal= mimetype[i].fileType;
      continue;
    }
  }
  this.fileser.getById(data.id).subscribe(res=>{
    const blob = new Blob([res],{ type : mimeVal });
    const file = new File([blob],  data.name,{ type : mimeVal });
    saveAs(file);

  },err=>{
    if(err.status==401)
    this.router.navigate(['/loginuser'], { relativeTo: this.route });
    else
    this.NotificationService.warning(" fail in download file !!")  ;

  });

}
  ngOnInit(): void {

this.fileser.getAll(this.param1).subscribe(res=>{
console.log('img');
console.log(res);
if(res.status==true){
this.datafiles=res.data;
console.log(this.datafiles);

        this.dataSource = new MatTableDataSource<any>(this.datafiles);
        //this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator as MatPaginator;

}else{
//this.NotificationService.Warning(res.error);

}
},err=>{
  // this.NotificationService.Warning("fail");
})

    this.speedSer.getAll(2).subscribe(res=>{
      this.serviceSpeedList = res.result?.data;
     console.log(this.serviceSpeedList);
    });
    if(this.param1!=undefined){
      this.registerSer.getAllComments(this.param1).subscribe(res=>{
        this.commentsList = res.data;
        this.dataSourceComment = new MatTableDataSource<any>(this.commentsList);
        this.dataSourceComment.sort = this.sortComment as MatSort;
        this.dataSourceComment.paginator = this.paginatorComment as MatPaginator;

      });
    }

  }
  ngAfterViewInit() {

    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.paginator = this.paginator as MatPaginator;
    this.formComment.controls['registerDetailId'].setValue(Number.parseInt(this.param1));
    this.dataSourceComment.sort = this.sortComment as MatSort;
    this.dataSourceComment.paginator = this.paginatorComment as MatPaginator;
  }



  registerDetail:registerDetail = new registerDetail();

    formComment: FormGroup = new FormGroup({
    comment: new FormControl('', Validators.required),
    registerDetailId: new FormControl(null)   ,
  });
  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    managerName: new FormControl(''),
    Contact: new FormControl(''),
    serviceTypeID: new FormControl(2),
    ContactName: new FormControl('',  [Validators.required,Validators.pattern(this.RegExpAr)]),
    CompanyName: new FormControl('', [Validators.required,Validators.pattern(this.RegExpAr)]),
    OtherInformation: new FormControl(''),
    Email: new FormControl('', Validators.email),
    Mobile: new FormControl('',[Validators.required, Validators.minLength(11),Validators.pattern(/^-?(0|[0-9]\d*)?$/)]),
    NumberofCircuits: new FormControl(0, Validators.required),
    FullAddress: new FormControl('', [Validators.required,Validators.pattern(this.RegExpAr)]),
    ExchangeName: new FormControl(''),
    NearestFixedLineNumber: new FormControl('', Validators.required),
    ExpectedUpgrades: new FormControl(''),
    contractPeriod: new FormControl(''),
    CircuitProtection: new FormControl(false),
    notes: new FormControl(''),
    PathProtection: new FormControl(false),
    PromisingArea: new FormControl(false),
    serviceSpeedID: new FormControl(null,Validators.required),
    numOfSpeed: new FormControl(null,Validators.required),
    statusId: new FormControl(null)   ,
    acceptstatusId: new FormControl(null),
    rejectionReason:new FormControl('',Validators.required),
    sector:new FormControl(null)

  });

  onClear(){
    this.form.reset();
    this.initializeFormGroup();
    this.NotificationService.success(':: Submitted successfully');
  }
  onSubmit() {
    this.loading = true;
    const p = { ...this.registerDetail, ...this.form.value }
debugger;
    if (this.form.valid) {
      if (p.id === 0) {
        debugger;
        console.log(p);
        this.registerSer.Add(p).subscribe(res => {
          this.loading = false;
          if (res.status == true) {
            this.NotificationService.success(':: Submitted successfully');
            this.form.reset();
            this.initializeFormGroup();
            this.router.navigate(['/fiber']);
          }
          else {
            this.NotificationService.error(res.error);
          }
        },err=>{
          this.loading = false;
          if(err.status==401)
          this.router.navigate(['/login'] );
          else
          this.NotificationService.warning("! Fail");


        });

      }
      else {
        this.registerSer.Update(p).subscribe(res => {
          this.loading = false; debugger;
          if (res.status == true) {
            this.NotificationService.success(':: Submitted successfully');
            this.form.reset();
            this.initializeFormGroup();
            this.router.navigate(['/fiber']);
          }
          else {
            this.NotificationService.error(res.error);
          }
        },err=>{
          this.loading = false;
          if(err.status==401)
          this.router.navigate(['/login'] );
          else
          this.NotificationService.warning("! Fail");


        });

      }


    }
    else {
      this.loading = false;
      return ;


    }
  }
  saveComment() {
    this.loading=true;
    if (this.formComment.valid) {
        this.registerSer.AddComment(this.formComment.value).subscribe(res =>{
          this.loading=false
          if(!this.commentsList)
          this.commentsList=[];
        if(res.status){
          this.commentsList.push(res.data);
         this.dataSourceComment =  new MatTableDataSource<any>(this.commentsList);
         this.dataSourceComment._updateChangeSubscription();
         this.dataSourceComment.sort = this.sortComment as MatSort;
         this.dataSourceComment.paginator = this.paginatorComment as MatPaginator;
         this.NotificationService.success(':: Submitted successfully')

        }
          else
          this.NotificationService.error(res.error );

        },err=>{
          this.loading=false
          if(err.status==401)
          this.router.navigate(['/loginuser'], { relativeTo: this.route });
          else
          this.NotificationService.warning("! Fail");

        });
    this.formComment.reset();
    this.initializeformCommentGroup();

    }
    else{
      this.loading=false;

      }
  }
  setReactValue(reqreact:registerDetail){
    this.form.patchValue({
      id:reqreact.id,
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
      serviceTypeID:2,
      serviceSpeedID: reqreact.serviceSpeedID ,
      statusId:reqreact.statusId,
      acceptstatusId:reqreact.acceptstatusId
    });

 }


  initializeFormGroup(){
    this.form.setValue({$key: null,
    managerName: '',
    Contact: '',
    ContactName: '',
    CompanyName: '',
    OtherInformation: '',
    Email: '',
    Mobile: '',
    NumberofCircuits: 0,
    FullAddress: '',
    ExchangeName: '',
    NearestFixedLineNumber: '',
    ExpectedUpgrades: '',
    contractPeriod: '',
    notes: '',
    CircuitProtection: false,
    PathProtection: false,
    PromisingArea: false,
    // E1: false,
    // E3: false,
    // DS3: false,
    // STM1: false,
    // STM4: false,
    // STM16: false,
    // Ethernet: false,
    // IPLC: false,
    // DOMESTIC: false,
    serviceTypeID:2,
    serviceSpeedID:0,
    statusId:null,
    acceptstatusId:null,
    });
  }
  initializeformCommentGroup(){
    this.formComment.setValue({
      registerDetailId:2,
    comment: '',
    });
  }
//   @ViewChild('logoInput', {
//     static: true
// }) logoInput:any;
 fileVal :any;
  Upload(){
    if(this.fileAttr == 'Choose File ...'){
      return
    }

    this.loading=true;
    let formData = new FormData();
    formData.append('formFile', this.fileVal);
this.fileser.addfile(formData,this.param1).subscribe(res=>{
  this.loading=false
  console.log(res);
  this.resetfile();
if(res.status){
  this.NotificationService.success('Uploaded');
  if(!this.datafiles) this.datafiles=[];
this.datafiles?.push(res.data);
this.dataSource =  new MatTableDataSource<any>(this.datafiles);

}
  else
  this.NotificationService.error(res.error );

},err=>{
  if(err.status==401)
  this.router.navigate(['/loginuser'], { relativeTo: this.route });
  else
  this.NotificationService.warning("! Fail");

})
  }

  uploadFileEvt(imgFile: any) {
    // this.fileuploaded = imgFile.target.files[0];



    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileVal=imgFile.target.files[0];
      this.fileAttr = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttr += file.name ;
      });





      // HTML25 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          let imgBase64Path = e.target.result;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      imgFile.target.files[0]='';

    } else {
      this.fileAttr = 'Choose File ...';
    }
  }
  resetfile() {
    this.fileAttr = 'Choose File ...';
    (this.fileInput as ElementRef).nativeElement.value = "";

  }

}
