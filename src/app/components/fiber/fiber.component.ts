
import { Component, ViewChild, ElementRef, OnInit, TemplateRef, Input} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { DeleteService } from 'src/app/shared/services/delete.service';
import { AdvancedSearchDto, registerDetail } from 'src/app/Models/ServiceRegister';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { Title } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient} from '@angular/common/http';
import { MatBottomSheet} from '@angular/material/bottom-sheet';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ForwardedToComponent } from '../forwarded-to/forwarded-to.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SectorService } from 'src/app/shared/services/sector.service';
import { statusService } from 'src/app/shared/services/status.service';
@Component({
  selector: 'app-fiber',
  templateUrl: './fiber.component.html',
  styleUrls: ['./fiber.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})
export class FiberComponent implements OnInit {
  searchKey: string = '';
  renwed=false;
  public Requetss: any[] = [];
  public RequetFilter: any[] = [];
  showAdvanced:boolean=false
  advSearchRequest:AdvancedSearchDto={}
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns2: string[] = ['id', 'action','renew', 'managerName', 'companyName', 'contactName'
    , 'email', "mobile", 'numberOfCircuits', 'fullAddress', 'exchangeName', 'nearestFixedLineNumber', 'expectedUpgrades', 'contractPeriod','sector','serviceSpeed'
    ,'status','rejectionReason', 'notes','ForwardedTo','ForwardedDate','creationDate', 'modificationDate','renewedDate' ,'createdBy', 'modifyiedBy','renewedBy','createdByTeam', 'modifyiedByTeam'
  ];
  columnsToDisplay: string[] = this.displayedColumns2.slice();
  public reqs: registerDetail[] = [];
  public delreq: registerDetail = new registerDetail();
  registerDetailList?: registerDetail[] = [];
  registerDetailListTab?: registerDetail[] = [];
  valdata = ""; valuid = 0;
  exportIds = [];
  dataSource = new MatTableDataSource<any>();
  delpic: any;
  listName: string = '';
  selected: boolean = false;
  param1: any=0; settingtype = '';
  esptFlag:boolean=true;
  isEspt=false;
  createFlag:boolean=true;
  isSales=false;
sectorList:any
statusList:any
  simflag=true;
  constructor(private dialog: MatDialog,
    private DeleteService: DeleteService,/*private reqser: RequestSerService ,*/
    private route: ActivatedRoute,
    private loading:LoadingService,
    private router: Router, private notser: ToastrService,
    private config: ConfigureService,
    private toastr :ToastrService,
    private supportser: ServiceRegisterService, private titleService: Title, private _http: HttpClient,
    private _bottomSheet: MatBottomSheet,
    private sectorServ:SectorService,
    private statusSer:statusService
  ) {



  }
  ngAfterViewInit() {

    this.dataSource.sort = this.sort as MatSort;
   this.dataSource.paginator = this.paginator as MatPaginator;

  }

  //http://172.29.29.8:2021/api/simdata/DownloadEmptyExcel
  //AddFromFile



  sortColumnDef: string = "id";
  SortDirDef: string = 'ASC';
  pagesizedef: number = 25;
  pageIn = 0;
  previousSizedef = 25;
  requestid = 2;
  // searchKey!:string; DESC reqid


  ngOnInit() {
this.loading.busy();

this.getSectors();
this.getStatus();
var groupval= this.config.UserTeam();
if(groupval=="admin_all"){this.esptFlag=false; this.createFlag=false;}
if(groupval=="PresalesFiber_sales") {this.createFlag=false; this.isSales=true;}
this.config.IsAuthentecated();
this.titleService.setTitle('Presales Fiber Request');
if(groupval=="PresalesFiber_ESPT"){this.isEspt=true; this.esptFlag=true; }
this.route.queryParams.subscribe((params:any) => {
  this.param1 = params['statusid'];
  if(this.param1 != undefined){
    this.getRequestdata(30, 1, '', 'id', 'asc', true,this.param1);
    this.showAdvanced=false
    this.searchKey=''

  }else{
    this.showAdvanced=true
    this.searchKey=''
    this.getRequestdata(30, 1, '', 'id', 'asc', true);

  }
});
    // var team=  this.config.UserTeam();
    // if(team?.toLocaleLowerCase()!='esp')
    // {
    //   this.notser.warninging("not permission");
    //    this.router.navigate(['/'] );
    // }


  }
  getRequestdata(pageSize: number, pageNum: number, search: string, sortColumn: string, sortDir: string, initflag: boolean = false,statusId?:number) {


    this.supportser.getByOption(2,pageSize, pageNum, search, sortColumn, sortDir,statusId,false).subscribe(res => {


      if (res.status == true) {
        this.loading.idle();

        //   this.dataSource.paginator.length=10;
        this.Requetss = res.result.data;
        console.log('Requetss:',this.Requetss)

        if(this.Requetss.length != 0){
          this.Requetss.length = res.result.totalrecords;
        }
        if (initflag)
          this.RequetFilter = this.Requetss;


        this.dataSource = new MatTableDataSource<any>(this.Requetss);
        //this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator as MatPaginator;
      }
      else
        this.notser.error(res.error)
    }, err => {

      if (err.status == 401)
        this.router.navigate(['/loginuser'], { relativeTo: this.route });
      else
        this.notser.warning("! Fail")
        this.loading.idle();



    })
  }
  getRequestdataNext(cursize: number, pageSize: number, pageNum: number, search: string, sortColumn: string, sortDir: string) {
    this.loading.busy();

    this.supportser.getByOption(this.requestid, pageSize, pageNum, search, sortColumn, sortDir,0,false).subscribe(res => {


      if (res.status == true) {

        this.loading.idle();
        //   this.dataSource.paginator.length=10;
        this.Requetss.length = cursize;
        this.Requetss.push(...res.result.data);
        //this.Requetss = res.result.data;
        this.Requetss.length = res.result.totalrecords;
        this.dataSource = new MatTableDataSource<any>(this.Requetss);
        this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator as MatPaginator;
      }
      else
        this.notser.error(res.error)
    }, err => {
      if (err.status == 401)
        this.router.navigate(['/loginuser'], { relativeTo: this.route });
      else
        this.notser.warning("! Fail");
        this.loading.idle();

    })
  }

  pageChanged(event: any) {

    this.config.pIn = event.pageIndex;
    this.pageIn = event.pageIndex;
    this.pagesizedef = event.pageSize;
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;
    this.previousSizedef = previousSize;
    this.getRequestdataNext(previousSize, pageSize, pageIndex + 1, '', this.sortColumnDef, this.SortDirDef)
    let previousIndex = event.previousPageIndex;
    //  let previousSize = pageSize * pageIndex;
    //  this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  applyFilter() {

    let searchData = this.searchKey.trim().toLowerCase();
    if (searchData != ""){
      if(this.param1 != undefined){
        //this.getRequestdata(30, 1, '', 'id', 'asc', true,this.param1);
        console.log('paramx1:',this.param1)
        this.getRequestdata(25, 1, searchData, this.sortColumnDef, this.SortDirDef,true,this.param1);

      }else{

       console.log('paramx2:',this.param1)
        this.getRequestdata(25, 1, searchData, this.sortColumnDef, this.SortDirDef,true);

      }
    }

    else {
      // this.Requetss = this.RequetFilter;
      // this.dataSource.data = this.RequetFilter;
      if(this.param1 != undefined){
        //this.getRequestdata(30, 1, '', 'id', 'asc', true,this.param1);
        console.log('paramx1:',this.param1)
        this.getRequestdata(25, 1, '', this.sortColumnDef, this.SortDirDef,true,this.param1);

      }else{

        this.getRequestdata(25, 1, '', this.sortColumnDef, this.SortDirDef,true);

      }
    }
  }
  lastcol: string = 'id';
  lastdir: string = 'asc';
  sortData(sort: any) {
    debugger;
    if (this.config.pIn != 0)
      window.location.reload();
    if (this.lastcol == sort.active && this.lastdir == sort.direction) {
      if (this.lastdir == 'asc')
        sort.direction = 'desc';
      else
        sort.direction = 'asc';

    }

    this.lastcol = sort.active; this.lastdir = sort.direction;

    var c = this.pageIn;
    this.getRequestdata(25, 1, '', sort.active, this.lastdir);
  }
  onCreate() {//this.requestid
    this.router.navigate(['/fiberRequestForm']);
  }

  onEdit(r: any) {

    this.router.navigate(['/fiberRequestForm'], { queryParams: { id: r.id } });

  }
  renew(r: any){
   this.supportser.Renew(r.id).subscribe(

    res=>{
   if(res.status){
    this.toastr.info('Your request is Reopened')
    this.getRequestdata(30, 1, '', 'id', 'asc', true);

    }


  });



  }

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    creationDateFrom: new FormControl(''),
    creationDateTo: new FormControl(''),
    modificationDateFrom: new FormControl(''),
    modificationDateTo: new FormControl(''),
    createdBy: new FormControl(''),
    modifyiedBy: new FormControl(''),
    createdByTeam: new FormControl(''),
    modifyiedByTeam: new FormControl(''),
    managerName: new FormControl(''),
    contact: new FormControl(''),
    companyName: new FormControl(''),
    contactName: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl(''),
    numberOfCircuits: new FormControl(null),
    fullAddress: new FormControl(''),
    exchangeName: new FormControl(''),
    nearestFixedLineNumber: new FormControl(''),
    renewedBy: new FormControl(''),
    renewedDateFrom: new FormControl(''),
    renewedDateTo: new FormControl(''),
    forwardedDateFrom: new FormControl(''),
    forwardedDateTo: new FormControl(''),
    forwardedTo: new FormControl(''),
    rejectionReason: new FormControl(''),
    serviceTypeID: new FormControl(2),
    serviceSpeedID: new FormControl(''),
    statusId:new FormControl(null),
    sectorID:new FormControl(null)

  });
  openAdvancedSearchPanel() {
    // this.panelOpenState = false;
    // this.missionService.getLists().subscribe((res) => {
    //   if (res.status == true) {
    //     this.missionTypeList = res.missionTypesList;
    //     this.statusList = res.statusesList;
    //   }
    // });
    // this.userService.getUserlists().subscribe((res) => {
    //   if (res.status) {
    //     this.jobDegreeList = res.data.jobDegrees;
    //     this.teamList=res.data.teams;
    //   }
    // });
  }

  AdvancedSearchSubmit() {
    // this.isFilterationData = true;
    // this.panelOpenState = true;

     this.loading.busy();


    this.advSearchRequest.creationDateFrom =
      this.form.value.creationDateFrom == ''
        ? null
        : this.form.value.creationDateFrom;
    this.advSearchRequest.creationDateTo =
      this.form.value.creationDateTo == ''
        ? null
        : this.form.value.creationDateTo;
    //
    this.advSearchRequest.modificationDateFrom =
      this.form.value.modificationDateFrom == ''
        ? null
        : this.form.value.modificationDateFrom;
    this.advSearchRequest.modificationDateTo =
      this.form.value.modificationDateTo == ''
        ? null
        : this.form.value.modificationDateTo;
    //
    this.advSearchRequest.renewedDateFrom =
      this.form.value.renewedDateFrom == ''
        ? null
        : this.form.value.renewedDateFrom;
    this.advSearchRequest.renewedDateTo =
      this.form.value.renewedDateTo == ''
        ? null
        : this.form.value.renewedDateTo;
    //
    this.advSearchRequest.forwardedDateFrom =
      this.form.value.forwardedDateFrom == ''
        ? null
        : this.form.value.forwardedDateFrom;

    this.advSearchRequest.forwardedDateTo =
      this.form.value.forwardedDateTo == '' ? null : this.form.value.forwardedDateTo;
    this.advSearchRequest.createdBy = this.form.value.createdBy;
    this.advSearchRequest.modifyiedBy = this.form.value.modifyiedBy;
    this.advSearchRequest.createdByTeam = this.form.value.createdByTeam;
    this.advSearchRequest.contact = this.form.value.contact;
    this.advSearchRequest.companyName = this.form.value.companyName;
    this.advSearchRequest.contactName = this.form.value.contactName;
    this.advSearchRequest.modifyiedByTeam = this.form.value.modifyiedByTeam;
    this.advSearchRequest.id = Number(this.form.value.id);
    this.advSearchRequest.managerName = this.form.value.managerName;
    this.advSearchRequest.email = this.form.value.email;
    this.advSearchRequest.mobile = this.form.value.mobile;
    this.advSearchRequest.numberOfCircuits = Number( this.form.value.numberOfCircuits);
    this.advSearchRequest.fullAddress = this.form.value.fullAddress;
    this.advSearchRequest.exchangeName = this.form.value.exchangeName;
    this.advSearchRequest.statusId = Number(this.form.value.statusId);
    this.advSearchRequest.sectorID = Number(this.form.value.sectorID);

    this.advSearchRequest.serviceSpeedID = Number(this.form.value.serviceSpeedID);

    this.advSearchRequest.serviceTypeID = 2;
    this.advSearchRequest.rejectionReason = this.form.value.rejectionReason;
    this.advSearchRequest.nearestFixedLineNumber = this.form.value.nearestFixedLineNumber;
    this.advSearchRequest.renewedBy = this.form.value.renewedBy;
    this.advSearchRequest.forwardedTo = this.form.value.forwardedTo;
    this.supportser
      .AdvancedSearch(this.advSearchRequest)
      .subscribe((res) => {

      this.Requetss=res

        this.dataSource = new MatTableDataSource<any>(this.Requetss);
      //this.dataSource._updateChangeSubscription();

        this.dataSource.paginator = this.paginator as MatPaginator;
        this.dataSource.sort = this.sort as MatSort;

        this.loading.idle();

      });
  }

  clearAdvancedSearch() {
    this.form.reset();
    this.getRequestdata(30, 1, '', 'id', 'asc', true);
  }
  isall: boolean = false;
  selectallviewflag = false;
  onselectcheckall(event: any) {
    if (event.checked) {
      this.isall = true; this.selectallviewflag = true;

    }
    else {
      this.isall = false; this.selectallviewflag = false;
    }

  }

  onselectcheck(event: any, r: any) {
    if (event.checked) {
      this.Ids.push(r.id.toString());
      // this.contentEditable = true;
    }
    else {
      const index: number = this.Ids.indexOf(r.id.toString());
      if (index !== -1) {
        this.Ids.splice(index, 1);
      }
    }
    console.log(this.Ids)

  }
  onDelete($key:any){
    this.DeleteService.openConfirmDialog()
    .afterClosed().subscribe(res =>{
      if(res){
        this.supportser.Remove($key).subscribe(
          res=>{
        this.notser.success('Deleted successfully!');
        this.getRequestdata(25, 1, '', 'id', 'asc', true);
        });

      }
    });
  }
  //excel
  ExportExcel() {
    debugger
    this.exportIds = [];
    //select all when click in all checkbox or
    // not choose any row or all but click export //button or
    // search but not choose all or any row
     if (this.dataSource.data.length > 0) {
      this.dataSource.data.forEach((element:any) => {
        this.exportIds.push(element.id)
      })
     }
    //if
    //choose specific rows
    //search and choose specific rows
    // else {
    //   this.selection.selected.forEach((element: any) => {
    //     this.exportIds.push(element.id)
    //   })
    // }
    this.supportser.ExportExcel(this.exportIds,2).subscribe(res => {
      const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
      const file = new File([blob], 'Supportrequestedit' + '.xlsx', { type: 'application/vnd.ms.excel' });
      saveAs(file,'Fiber Requests' + Date.now() + '.xlsx')
    }, err => {
      this.toastr.warning("::failed");
    }
    )


  }
  @ViewChild('TABLE') table?: ElementRef;
  Ids: string[] = [];

  @Input() param = 'file';


  @ViewChild('LIST') template!: TemplateRef<any>;
  @ViewChild('LISTF') templateF!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput?: ElementRef;
  fileAttr = 'Choose File';
  fileAttrF = 'Choose File';

  fileuploaded: any;

  uploadFileEvt(imgFile: any) {
    this.fileuploaded = imgFile.target.files[0];

    console.log(this.fileuploaded);

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttr += file.name + ' - ';
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

      // Reset if duplicate image uploaded again
      (this.fileInput as ElementRef).nativeElement.value = "";
    } else {
      this.fileAttr = 'Choose File';
    }
  }

  uploadFileEvtF(imgFile: any) {
    this.fileuploaded = imgFile.target.files[0];

    console.log(this.fileuploaded);

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttr += file.name + ' - ';
      });
      // Array.from(imgFile.target.files).forEach((file:File)=> {
      //   this.fileAttr += file.name + ' - ';

      // });



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

      // Reset if duplicate image uploaded again
      (this.fileInput as ElementRef).nativeElement.value = "";
    } else {
      this.fileAttr = 'Choose File';
    }
  }



  ForwardRequest(id:any){
    const dialogConfig= new MatDialogConfig();
    dialogConfig.data={id:id},
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.height = '280px';
    dialogConfig.panelClass = 'modals-dialog';
    // dialogConfig.position={top:"10px"},
    this.dialog.open(ForwardedToComponent,dialogConfig).afterClosed().subscribe(res => {

        if(this.param1 != undefined){
          this.getRequestdata(30, 1, '', 'id', 'asc', true,this.param1);

        }else{
          this.getRequestdata(30, 1, '', 'id', 'asc', true);

        }

  })}

  resetfile() {
    this.fileAttr = 'Choose File';
    //(this.fileInput as ElementRef).nativeElement.value = "";


  }
  getSectors() {
    this.sectorServ.getSectors().subscribe((res) => {
      if (res.status) {
        this.sectorList = res.data;
      } else {

      }
    });
  }
  getStatus(){

    this.statusSer.getAll().subscribe(res=>{


      if(res.status==true){



     this.statusList = res.result?.data;


      }
    },err=>{


    })
   }
}



