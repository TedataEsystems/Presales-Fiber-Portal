
import { Component, ViewChild, ElementRef, OnInit, TemplateRef, Input} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog} from '@angular/material/dialog';
import { DeleteService } from 'src/app/shared/services/delete.service';
import { registerDetail } from 'src/app/Models/ServiceRegister';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { Title } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient} from '@angular/common/http';
import { MatBottomSheet} from '@angular/material/bottom-sheet';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';
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

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  displayedColumns2: string[] = ['id', 'action','renew', 'managerName', 'companyName', 'contactName'
    , 'email', "mobile", 'numberOfCircuits', 'fullAddress', 'exchangeName', 'nearestFixedLineNumber', 'expectedUpgrades', 'contractPeriod','sector','serviceSpeed'
    ,'status','rejectionReason', 'notes', 'creationDate', 'modificationDate','renewedDate' ,'createdBy', 'modifyiedBy','renewedBy','createdByTeam', 'modifyiedByTeam'
  ];
  columnsToDisplay: string[] = this.displayedColumns2.slice();
  public reqs: registerDetail[] = [];
  public delreq: registerDetail = new registerDetail();
  registerDetailList?: registerDetail[] = [];
  registerDetailListTab?: registerDetail[] = [];
  valdata = ""; valuid = 0;
  dataSource = new MatTableDataSource<any>();
  delpic: any;
  listName: string = '';
  selected: boolean = false;
  param1: any=0; settingtype = '';
  esptFlag:boolean=true;
  createFlag:boolean=true;
  isSales=false;


  simflag=true;
  constructor(private dialog: MatDialog,
    private DeleteService: DeleteService,/*private reqser: RequestSerService ,*/
    private route: ActivatedRoute,
    private loading:LoadingService,
    private router: Router, private notser: ToastrService,
    private config: ConfigureService,
    private toastr :ToastrService,
    private supportser: ServiceRegisterService, private titleService: Title, private _http: HttpClient,
    private _bottomSheet: MatBottomSheet
  ) {
    var groupval= this.config.UserTeam();
      if(groupval=="admin_all"){this.esptFlag=false; this.createFlag=false;}
    if(groupval=="PresalesFiber_sales") {this.createFlag=false; this.isSales=true;}
    this.config.IsAuthentecated();
    this.titleService.setTitle('Presales Fiber Request');
    if(groupval=="PresalesFiber_ESPT") this.esptFlag=true;
    this.route.queryParams.subscribe((params:any) => {
      this.param1 = params['statusid'];
      if(this.param1 != undefined){
        this.getRequestdata(30, 1, '', 'id', 'asc', true,this.param1);

      }else{
        this.getRequestdata(30, 1, '', 'id', 'asc', true);

      }
  });

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
    // var team=  this.config.UserTeam();
    // if(team?.toLocaleLowerCase()!='esp')
    // {
    //   this.notser.warninging("not permission");
    //    this.router.navigate(['/'] );
    // }


  }
  getRequestdata(pageSize: number, pageNum: number, search: string, sortColumn: string, sortDir: string, initflag: boolean = false,statusId: number = 0) {


    this.supportser.getByOption(2, pageSize, pageNum, search, sortColumn, sortDir, statusId).subscribe(res => {


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

    this.supportser.getByOption(this.requestid, pageSize, pageNum, search, sortColumn, sortDir).subscribe(res => {


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
    if (searchData != "")
      this.getRequestdata(25, 1, searchData, this.sortColumnDef, this.SortDirDef);
    else {
      this.Requetss = this.RequetFilter;
      this.dataSource.data = this.RequetFilter;
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
debugger;
   this.supportser.Renew(r.id).subscribe(

    res=>{
   if(res.status){
    this.toastr.info('Your request is renewed')
    this.getRequestdata(30, 1, '', 'id', 'asc', true);
    // if(r.renew > 0){
     // this.router.navigate(['/fiberRequestForm'], { queryParams: { id: r.id ,renew:true} });
    // }
    // else{
      // this.toastr.info('Your request is still under process')
    }


  });
    // this.router.navigate(['/fiberRequestForm'], { queryParams: { id: r.id ,renew:true} });


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

  //   upLoadF(){

  //     const fd = new FormData();
  //     debugger;

  //     fd.append(this.param, this.fileuploaded);
  //     this.fileAttr = 'Choose File';
  //     this.supportser.updateFromFile(fd).subscribe(x=>{

  //       if(x.status==true){

  //   //  this.notser.success('uploaded and detail is '+x.data);
  //     this.getRequestdata(25,1,'',this.service.colname,this.service.coldir);
  //     this.Ids=[];
  //     this._bottomSheet.dismiss();
  //     swal.fire(
  //       '!uploaded ',
  //       x.data,
  //       'success'
  //     )

  //   } else{
  //     swal.fire(
  //       '!not uploaded ',
  //       x.error,
  //       'error'
  //     )
  //    // this.notser.warninging(x.error);
  //   }
  //   this.resetfile();

  //     },err=>{
  //       if(err.status==401)
  //       this.router.navigate(['/loginuser'], { relativeTo: this.route });
  //       else
  //       this.notser.warninging("! Fail")

  //  this.resetfile();

  //     })
  //   }
  //      upLoad(){

  //     const fd = new FormData();
  //     debugger;

  //     fd.append(this.param, this.fileuploaded);
  //     this.fileAttr = 'Choose File';
  //     this.supportser.addFromFile(fd).subscribe(x=>{

  //       if(x.status==true){
  //   //  this.notser.success('uploaded and detail is '+x.data);
  //     this.getRequestdata(25,1,'',this.service.colname,this.service.coldir);

  //     this._bottomSheet.dismiss();
  //     swal.fire(
  //       '!uploaded ',
  //       x.data,
  //       'success'
  //     )
  //   } else{
  //     this.notser.warninging(x.error);
  //     swal.fire(
  //       '!not uploaded ',
  //       x.error,
  //       'error'
  //     )
  //   }
  //   this.resetfile();

  //     },err=>{
  //       if(err.status==401)
  //       this.router.navigate(['/loginuser'], { relativeTo: this.route });
  //       else
  //       this.notser.warninging("! Fail")

  //  this.resetfile();

  //     })
  //   }



  resetfile() {
    this.fileAttr = 'Choose File';
    //(this.fileInput as ElementRef).nativeElement.value = "";


  }
  import() {

  }
  importEmpty() {

  }
  Upload() {

  }
}



