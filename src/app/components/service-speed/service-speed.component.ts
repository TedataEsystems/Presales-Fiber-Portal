
import {Component,Input,NgModule, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NotificationService} from 'src/app/shared/services/notification.service';
import { Title } from '@angular/platform-browser';
import { ServicespeedService } from 'src/app/shared/services/servicespeed.service';
import {FormControl, FormGroupDirective, Validators} from '@angular/forms';
import { ServiceSpeed } from 'src/app/Models/ServiceSpeed';
import { DeleteService } from 'src/app/shared/services/delete.service';

import {FormGroup} from '@angular/forms';
import { ConfigureService} from 'src/app/shared/services/configure.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-speed',
  templateUrl: './service-speed.component.html',
  styleUrls: ['./service-speed.component.css']
})
export class ServiceSpeedComponent implements OnInit {

displayedColumns: string[] = ['id', 'value', 'orderInList', 'action'];
columnsToDisplay: string[] = this.displayedColumns.slice();
serviceSpeedList?:ServiceSpeed[]=[];
serviceSpeedListTab?:ServiceSpeed[]=[];
valdata="";valuid=0;
dataSource = new MatTableDataSource<any>();
delpic:any;
isDisabled=true;
@ViewChild(FormGroupDirective) formGroupDirective?: FormGroupDirective;
  searchKey:string ='';
  listName:string ='';
  loading: boolean = true;
  selected: boolean = false;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  param1:any;settingtype=''
  constructor(private titleService:Title,private speedSer:ServicespeedService
    ,private notser:ToastrService,private router: Router,private dialogService:DeleteService,
     private route: ActivatedRoute , private Config:ConfigureService
    ) {
      var teamval=this.Config.UserTeam();
      if(teamval?.toLocaleLowerCase() !="admin_all")
       {
        this.notser.warning("not permitted")
        this.router.navigate(['/'] );
       }

      this.titleService.setTitle("Service Speed")
      this.route.queryParams.subscribe((params:any) => {
        this.param1 = params['serid'];
                  if(this.param1!=undefined){

   this.getRequestdata(this.param1);

        }
        else
        {
           this.notser.warning("select service Type")
          this.router.navigate(['/'] );
        }


      }

    );
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort as MatSort;
   this.dataSource.paginator = this.paginator as MatPaginator;

  }
  simflag=true;
  ngOnInit() {
    var team=  this.Config.UserTeam();
    // if(team?.toLocaleLowerCase()!='esp')
    // {
    //   this.notser.warning("not permission");
    //    this.router.navigate(['/'] );
    // }
  //   this.service.onMessage().subscribe(x=>{
  //     this.speedSer.delHW(this.delpic.id).subscribe(
  //       res=>{

  //           if(res.status==true){

  //     const index1 = this.dataSource.data.indexOf(this.delpic);
  //      this.dataSource.data.splice(index1, 1);
  //       this.dataSource._updateChangeSubscription()

  //        this.notser.success("Deleted!")
  // // window.location.reload();
  //       }
  //           else {
  //            this.notser.warning("Not Deleted!")

  //           }
  //       },err=>{
  //         if(err.status==401)
  //     this.router.navigate(['/loginuser']);
  //     else
  //     this.notser.warning("! Fail");

  //       }
  //     )
  //   })

  }
  getRequestdata(attr:any ){

    this.speedSer.getAll(attr).subscribe(res=>{
      this.loading = false;

      if(res.status==true){

        this.loading = false;

     this.serviceSpeedList = res.result?.data;
     this.apply(this.param1);

      }else this.notser.error(res.error);
    },err=>{

      if(err.status==401)
      this.router.navigate(['/loginuser'] );
      else
      this.notser.warning("! Fail");


    })
   }
  onSearchClear(){
    this.searchKey ='';
    //this.applyFilter();

    if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
    }
  }
  // applyFilter(){
  //   this.dataSource.filter=this.searchKey.trim().toLowerCase();

  // }
  apply(filterValue:string) {

    this.selected=true;
    this.listName=filterValue;
    this.serviceSpeedListTab=[];
    this.serviceSpeedListTab=this.serviceSpeedList ;

  this.setReactValue(Number(0),"",0);
  this.serviceSpeedListTab?.sort(function(a, b) {
    let oa=0;
    if(a.orderInList !=null)
     oa=a.orderInList;
    let ob=0;
    if(b.orderInList !=null)
     ob=b.orderInList;

    return oa - ob ;
  });
  this.dataSource =new MatTableDataSource<any>(this.serviceSpeedListTab);

    this.dataSource.paginator = this.paginator as MatPaginator;


  }
  applyFilter(filterValue: Event) {

    this.dataSource.filter =(<HTMLInputElement>filterValue.target).value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onEdit(r:any){


    this.valdata=r.value;
    this.valuid=r.id;
    if(r.orderInList !=null)
    this.setReactValue(Number(r.id),r.value.trim(),r.orderInList);
    else
    this.setReactValue(Number(r.id),r.value.trim(),0);

//this.router.navigate(['/Simdetail'],{ queryParams: {id: r.id}});

  }




  form: FormGroup = new FormGroup({
    id: new FormControl(0),
    value: new FormControl('',[Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    orderInList: new FormControl(0),

  });//18






  onSubmit() {

      if (this.form.invalid||this.form.value.value==' ') {
        if (this.form.value.value==' ')
        this.formGroupDirective?.resetForm();

          return;
      }

      var listval:ServiceSpeed=new ServiceSpeed();
      listval.serviceTypeID=Number(this.param1);
      listval.value=this.form.value.value.trim();

      listval.orderInList=this.form.value.orderInList;


      if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){
        var HWData= this.serviceSpeedListTab?.find(x=>x.value==this.form.value.value.trim());
        if(HWData)
        {

         this.formGroupDirective?.resetForm();
          this.notser.warning("value already exist");
          return;
        }
        var orData= this.serviceSpeedListTab?.find(x=>x.orderInList==this.form.value.orderInList);
        if(orData)
        {

         this.formGroupDirective?.resetForm();
          this.notser.warning("order already exist");
          return;
        }
      this.speedSer.Add(listval).subscribe((res)=>{


      if(res.status==true)    {
        var SS:ServiceSpeed=new ServiceSpeed();

        SS.id=res.data?.id;
        SS.value=res.data?.value;
        SS.orderInList=res.data?.orderInList;
        this.serviceSpeedListTab?.push(SS)
        this.serviceSpeedListTab?.sort(function(a, b) {
          let oa=0;
          if(a.orderInList !=null)
           oa=a.orderInList;
          let ob=0;
          if(b.orderInList !=null)
           ob=b.orderInList;

          return oa - ob ;
        });
        this.dataSource =new MatTableDataSource<any>(this.serviceSpeedListTab);

    this.dataSource.paginator = this.paginator as MatPaginator;
      this.notser.success("Successfully Added") ;
      this.formGroupDirective?.resetForm();


      }
      else{
      this.notser.warning("Not Added!") ;

      }
      },err=>{

        if(err.status==401)
      this.router.navigate(['/loginuser'] );
      else
      this.notser.warning("! Fail");


      });
    }
    else{
      var HWData= this.serviceSpeedListTab?.find(x=>x.value==this.form.value.value.trim());
      if(HWData &&HWData.id !=this.form.value.id)
      {
      
        this.formGroupDirective?.resetForm();
        this.notser.warning("value already exist");
        return;
      }
      var ordata= this.serviceSpeedListTab?.find(x=>x.orderInList==this.form.value.orderInList);
      if(ordata &&ordata.id !=this.form.value.id)
      {

        this.formGroupDirective?.resetForm();
        this.notser.warning("order already exist");
        return;
      }

     listval.id=Number(this.form.value.id);
  //   listval.serviceTypeID=this.param1;

      this.speedSer.Update(listval).subscribe((res)=>{

        if(res.status==true)    {
          // const index1 = this.dataSource.data.indexOf(this.l);
          // this.dataSource.data.splice(index1, 1);
          // this.dataSource._updateChangeSubscription()
       this.serviceSpeedListTab?.forEach(x=>
        {
          if(x.id==res.data?.id){
          x.value=res.data?.value;x.orderInList=res.data?.orderInList;
          }
        });
        this.serviceSpeedListTab?.sort(function(a, b) {
          let oa=0;
          if(a.orderInList !=null)
           oa=a.orderInList;
          let ob=0;
          if(b.orderInList !=null)
           ob=b.orderInList;

          return oa - ob ;
        });
        this.dataSource =new MatTableDataSource<any>(this.serviceSpeedListTab);

    this.dataSource.paginator = this.paginator as MatPaginator;
    this.formGroupDirective?.resetForm();

          this.notser.success("Successfully Deleted") ;

          }
          else{
          this.notser.warning("Not saved!") ;

          }

      },err=>{

        if(err.status==401)
        this.router.navigate(['/loginuser']);
        else
        this.notser.warning("! Fail");



      });
    }



  this.isDisabled=true;
  }



  onChecknameIsalreadysign()
  {


    if(this.form.valid)

    {
var id=this.serviceSpeedListTab?.find( x=>x.id==this.form.value.id)
        var ordata= this.serviceSpeedListTab?.find(x=>x.orderInList==this.form.value.orderInList);
        var value= this.serviceSpeedListTab?.find(x=>x.value==this.form.value.value.trim());
        if(ordata)
        {

          if(value){

             this.notser.warning("Value already exist");
            this.isDisabled=true;

           }
           else{
            this.notser.warning("order already exist");
          this.isDisabled=true;
           return;
           }

        }

        else{
          this.isDisabled=false;
        }

//         if(HWData)
//         {
// //edit
//         if(ordata && id || ordata){
//             this.notser.warning("order already exist");
//             this.isDisabled=true;
//           }
//           else{

//             this.isDisabled=false;
//           }
//         }
//         else if(!HWData && ordata){
//           this.notser.warning("order already exist");
//           this.isDisabled=true;

//         }

//         else{

//             this.isDisabled=false;

//         }


    }else{
      this.isDisabled=true;
    }
  }
  setReactValue(id:number,val:any,num:any){
    this.form.patchValue({
      id: id,
      value:val,
      orderInList:num
    });

 }
 onDelete($key:any){
  this.dialogService.openConfirmDialog()
  .afterClosed().subscribe(res =>{
    if(res){
      this.speedSer.Remove($key).subscribe(
        res=>{
      this.notser.success('Deleted successfully!');
      this.getRequestdata(this.param1);
      });

    }
  });
}
}


