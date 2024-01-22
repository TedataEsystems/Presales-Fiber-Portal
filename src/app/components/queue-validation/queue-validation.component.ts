import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  TemplateRef,
  Input,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteService } from 'src/app/shared/services/delete.service';
import {
  AdvancedSearchDto,
  registerDetail,
} from 'src/app/Models/ServiceRegister';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ForwardedToComponent } from '../forwarded-to/forwarded-to.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SectorService } from 'src/app/shared/services/sector.service';
import { statusService } from 'src/app/shared/services/status.service';
@Component({
  selector: 'app-queue-validation',
  templateUrl: './queue-validation.component.html',
  styleUrls: ['./queue-validation.component.css'],
})
export class QueueValidationComponent implements OnInit {
  searchKey: string = '';
  searchKey1: string = '';
  renwed = false;
  exportIds: number[];
  public Requetss: any[] = [];
  public RequetFilter: any[] = [];
  showAdvanced: boolean = false;
  advSearchRequest: AdvancedSearchDto = {};
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild('MatPaginator') paginator?: MatPaginator;
  @ViewChild(MatSort) sort1?: MatSort;
  @ViewChild('MatPaginator1') paginator1?: MatPaginator;
  displayedColumns: string[] = [
    'id',
    'action',
    'renew',
    'managerName',
    'companyName',
    'contactName',
    'email',
    'mobile',
    'numberOfCircuits',
    'fullAddress',
    'exchangeName',
    'nearestFixedLineNumber',
    'expectedUpgrades',
    'contractPeriod',
    'sector',
    'serviceSpeed',
    'status',
    'rejectionReason',
    'notes',
    'ForwardedTo',
    'ForwardedDate',
    'creationDate',
    'modificationDate',
    'renewedDate',
    'createdBy',
    'modifyiedBy',
    'renewedBy',
    'createdByTeam',
    'modifyiedByTeam',
  ];
  displayedColumns1: string[] = [
    'id',
    'action',
    'renew',
    'managerName',
    'companyName',
    'contactName',
    'email',
    'mobile',
    'numberOfCircuits',
    'fullAddress',
    'exchangeName',
    'nearestFixedLineNumber',
    'expectedUpgrades',
    'contractPeriod',
    'sector',
    'serviceSpeed',
    'status',
    'rejectionReason',
    'notes',
    'ForwardedTo',
    'ForwardedDate',
    'creationDate',
    'modificationDate',
    'renewedDate',
    'createdBy',
    'modifyiedBy',
    'renewedBy',
    'createdByTeam',
    'modifyiedByTeam',
  ];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  columnsToDisplay1: string[] = this.displayedColumns1.slice();
  public reqs: registerDetail[] = [];
  public delreq: registerDetail = new registerDetail();
  registerDetailList?: registerDetail[] = [];
  registerDetailListTab?: registerDetail[] = [];
  valdata = '';
  valuid = 0;
  dataSource = new MatTableDataSource<any>();
  dataSource1 = new MatTableDataSource<any>();
  request: registerDetail[];
  request1: registerDetail[];
  delpic: any;
  listName: string = '';
  selected: boolean = false;
  param1: any = 0;
  settingtype = '';
  esptFlag: boolean = true;
  isEspt = false;
  createFlag: boolean = true;
  isSales = false;
  sectorList: any;
  statusList: any;
  simflag = true;
  constructor(
    private dialog: MatDialog,
    private DeleteService: DeleteService /*private reqser: RequestSerService ,*/,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private router: Router,
    private notser: ToastrService,
    private config: ConfigureService,
    private toastr: ToastrService,
    private supportser: ServiceRegisterService,
    private titleService: Title,
    private _http: HttpClient,
    private _bottomSheet: MatBottomSheet,
    private sectorServ: SectorService,
    private statusSer: statusService
  ) {}
  ngAfterViewInit() {
    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.paginator = this.paginator as MatPaginator;
    this.dataSource1.sort = this.sort1 as MatSort;
    this.dataSource1.paginator = this.paginator1 as MatPaginator;
  }

  //http://172.29.29.8:2021/api/simdata/DownloadEmptyExcel
  //AddFromFile

  sortColumnDef: string = 'id';
  SortDirDef: string = 'ASC';
  pagesizedef: number = 25;
  pageIn = 0;
  previousSizedef = 25;
  requestid = 2;
  // searchKey!:string; DESC reqid

  ngOnInit() {
    this.loading.busy();
    this.searchKey = '';
    // this.getSectors();
    // this.getStatus();
    var groupval = this.config.UserTeam();
    if (groupval == 'admin_all') {
      this.esptFlag = false;
      this.createFlag = false;
    }
    if (groupval == 'PresalesFiber_sales') {
      this.createFlag = false;
      this.isSales = true;
    }
    this.config.IsAuthentecated();
    this.titleService.setTitle('Presales Fiber Request');
    if (groupval == 'PresalesFiber_ESPT') {
      this.isEspt = true;
      this.esptFlag = true;
    }
    this.route.queryParams.subscribe((params: any) => {
      this.param1 = params['statusid'];
      if (this.param1 != undefined) {
        this.getRequestdata(30, 1, '', 'id', 'asc', true, this.param1);
        this.showAdvanced = false;
      } else {
        this.showAdvanced = true;
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
  getRequestdata(
    pageSize: number,
    pageNum: number,
    search: string,
    sortColumn: string,
    sortDir: string,
    initflag: boolean = false,
    statusId?: number
  ) {
    this.supportser
      .getByOption(
        2,
        pageSize,
        pageNum,
        search,
        sortColumn,
        sortDir,
        statusId,
        true
      )
      .subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            //   this.dataSource.paginator.length=10;
            this.Requetss = res.result.data;
            console.log('Requetss:', this.Requetss);

            if (this.Requetss.length != 0) {
              this.Requetss.length = res.result.totalrecords;
            }
            if (initflag) this.RequetFilter = this.Requetss;
            this.request = this.Requetss.filter(
              (element) => element.statusId == 7
            );
            this.dataSource = new MatTableDataSource<any>(this.request);
            //this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator as MatPaginator;

            this.request1 = this.Requetss.filter(
              (element) => element.statusId == 3
            );
            this.dataSource1 = new MatTableDataSource<any>(this.request1);
            //this.dataSource._updateChangeSubscription();
            this.dataSource1.paginator = this.paginator1 as MatPaginator;
          } else this.notser.error(res.error);
        },
        (err) => {
          if (err.status == 401)
            this.router.navigate(['/loginuser'], { relativeTo: this.route });
          else this.notser.warning('! Fail');
          this.loading.idle();
        }
      );
  }
  getRequestdataNext(
    cursize: number,
    pageSize: number,
    pageNum: number,
    search: string,
    sortColumn: string,
    sortDir: string
  ) {
    this.loading.busy();

    this.supportser
      .getByOption(
        this.requestid,
        pageSize,
        pageNum,
        search,
        sortColumn,
        sortDir,
        0,
        true
      )
      .subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();
            //   this.dataSource.paginator.length=10;
            this.Requetss.length = cursize;
            this.Requetss.push(...res.result.data);
            //this.Requetss = res.result.data;
            this.Requetss.length = res.result.totalrecords;
            // this.dataSource = new MatTableDataSource<any>(this.Requetss);
            // this.dataSource._updateChangeSubscription();
            // this.dataSource.paginator = this.paginator as MatPaginator;
            // this.request.length = cursize
            this.request = this.Requetss.filter(
              (element) => element.statusId == 7
            );
            this.dataSource = new MatTableDataSource<any>(this.request);
            //this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator as MatPaginator;

            this.request1 = this.Requetss.filter(
              (element) => element.statusId == 3
            );
            this.dataSource1 = new MatTableDataSource<any>(this.request1);
            //this.dataSource._updateChangeSubscription();
            this.dataSource1.paginator = this.paginator1 as MatPaginator;
          } else this.notser.error(res.error);
        },
        (err) => {
          if (err.status == 401)
            this.router.navigate(['/loginuser'], { relativeTo: this.route });
          else this.notser.warning('! Fail');
          this.loading.idle();
        }
      );
  }

  pageChanged(event: any) {
    this.config.pIn = event.pageIndex;
    this.pageIn = event.pageIndex;
    this.pagesizedef = event.pageSize;
    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let previousSize = pageSize * pageIndex;
    this.previousSizedef = previousSize;
    this.getRequestdataNext(
      previousSize,
      pageSize,
      pageIndex + 1,
      '',
      this.sortColumnDef,
      this.SortDirDef
    );
    let previousIndex = event.previousPageIndex;
    //  let previousSize = pageSize * pageIndex;
    //  this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }
  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }
  onSearchClear1() {
    this.searchKey1 = '';
    this.applyFilter1();
  }

  applyFilter() {
    let searchData = this.searchKey.trim().toLowerCase();
    this.getRequestdataFilterdataSource(25,1,searchData,this.sortColumnDef,this.SortDirDef,true,7);
  }

  applyFilter1() {
    let searchData = this.searchKey1.trim().toLowerCase();
    this.getRequestdataFilterdataSource1(25,1,searchData,this.sortColumnDef,this.SortDirDef,true,3
    );
  }

  getRequestdataFilterdataSource(
    pageSize: number,
    pageNum: number,
    search: string,
    sortColumn: string,
    sortDir: string,
    initflag: boolean = false,
    statusId?: number
  ) {
    this.supportser
      .getByOption(
        2,
        pageSize,
        pageNum,
        search,
        sortColumn,
        sortDir,
        statusId,
        true
      )
      .subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            //   this.dataSource.paginator.length=10;
            this.Requetss = res.result.data;
            console.log('Requetss:', this.Requetss);

            if (this.Requetss.length != 0) {
              this.Requetss.length = res.result.totalrecords;
            }
            if (initflag) this.RequetFilter = this.Requetss;
            this.request = this.Requetss.filter(
              (element) => element.statusId == 7
            );
            this.dataSource = new MatTableDataSource<any>(this.request);
            //this.dataSource._updateChangeSubscription();
            this.dataSource.paginator = this.paginator as MatPaginator;
          } else this.notser.error(res.error);
        },
        (err) => {
          if (err.status == 401)
            this.router.navigate(['/loginuser'], { relativeTo: this.route });
          else this.notser.warning('! Fail');
          this.loading.idle();
        }
      );
  }

  getRequestdataFilterdataSource1(
    pageSize: number,
    pageNum: number,
    search: string,
    sortColumn: string,
    sortDir: string,
    initflag: boolean = false,
    statusId?: number
  ) {
    this.supportser
      .getByOption(
        2,
        pageSize,
        pageNum,
        search,
        sortColumn,
        sortDir,
        statusId,
        true
      )
      .subscribe(
        (res) => {
          if (res.status == true) {
            this.loading.idle();

            //   this.dataSource.paginator.length=10;
            this.Requetss = res.result.data;
            console.log('Requetss:', this.Requetss);

            if (this.Requetss.length != 0) {
              this.Requetss.length = res.result.totalrecords;
            }
            if (initflag) this.RequetFilter = this.Requetss;

            this.request1 = this.Requetss.filter(
              (element) => element.statusId == 3
            );
            this.dataSource1 = new MatTableDataSource<any>(this.request1);
            //this.dataSource._updateChangeSubscription();
            this.dataSource1.paginator = this.paginator1 as MatPaginator;
          } else this.notser.error(res.error);
        },
        (err) => {
          if (err.status == 401)
            this.router.navigate(['/loginuser'], { relativeTo: this.route });
          else this.notser.warning('! Fail');
          this.loading.idle();
        }
      );
  }
  lastcol: string = 'id';
  lastdir: string = 'asc';
  sortData(sort: any) {
    debugger;
    if (this.config.pIn != 0) window.location.reload();
    if (this.lastcol == sort.active && this.lastdir == sort.direction) {
      if (this.lastdir == 'asc') sort.direction = 'desc';
      else sort.direction = 'asc';
    }

    this.lastcol = sort.active;
    this.lastdir = sort.direction;

    var c = this.pageIn;
    this.getRequestdata(25, 1, '', sort.active, this.lastdir);
  }
  onCreate() {
    //this.requestid
    this.router.navigate(['/fiberRequestForm']);
  }

  onEdit(r: any) {
    this.router.navigate(['/fiberRequestForm'], { queryParams: { id: r.id } });
  }
  renew(r: any) {
    this.supportser.Renew(r.id).subscribe((res) => {
      if (res.status) {
        this.toastr.info('Your request is Reopened');
        this.getRequestdata(30, 1, '', 'id', 'asc', true);
      }
    });
  }

  onDelete($key: any) {
    this.DeleteService.openConfirmDialog()
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.supportser.Remove($key).subscribe((res) => {
            this.notser.success('Deleted successfully!');
            this.getRequestdata(25, 1, '', 'id', 'asc', true);
          });
        }
      });
  }

  @ViewChild('TABLE') table?: ElementRef;
  Ids: string[] = [];

  //excel
  ExportExcel() {
    this.exportIds = [];
    //select all when click in all checkbox or
    // not choose any row or all but click export //button or
    // search but not choose all or any row
    if (this.dataSource.data.length > 0) {
      this.dataSource.data.forEach((element: any) => {
        this.exportIds.push(element.id);
      });
    }

    this.supportser.ExportExcel(this.exportIds, 2).subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
        const file = new File([blob], 'Supportrequestedit' + '.xlsx', {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file, 'Fiber Requests' + Date.now() + '.xlsx');
      },
      (err) => {
        this.toastr.warning('::failed');
      }
    );
  }
  ExportExcel1() {
    this.exportIds = [];
    //select all when click in all checkbox or
    // not choose any row or all but click export //button or
    // search but not choose all or any row
    if (this.dataSource1.data.length > 0) {
      this.dataSource1.data.forEach((element: any) => {
        this.exportIds.push(element.id);
      });
    }

    this.supportser.ExportExcel(this.exportIds, 2).subscribe(
      (res) => {
        const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
        const file = new File([blob], 'Supportrequestedit' + '.xlsx', {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file, 'Fiber Requests' + Date.now() + '.xlsx');
      },
      (err) => {
        this.toastr.warning('::failed');
      }
    );
  }

  ForwardRequest(id: any) {
    const dialogConfig = new MatDialogConfig();
    (dialogConfig.data = { id: id }), (dialogConfig.disableClose = true);
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.height = '280px';
    dialogConfig.panelClass = 'modals-dialog';
    // dialogConfig.position={top:"10px"},
    this.dialog
      .open(ForwardedToComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        if (this.param1 != undefined) {
          this.getRequestdata(30, 1, '', 'id', 'asc', true, this.param1);
        } else {
          this.getRequestdata(30, 1, '', 'id', 'asc', true);
        }
      });
  }
}
