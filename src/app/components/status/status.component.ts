
import {Component,Input,NgModule, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { NotificationService} from 'src/app/shared/services/notification.service';
import { Title } from '@angular/platform-browser';
import { statusService } from 'src/app/shared/services/status.service';
import {FormControl, FormGroupDirective, Validators} from '@angular/forms';
import { status } from 'src/app/Models/status';
import { DeleteService } from 'src/app/shared/services/delete.service';

import {FormGroup} from '@angular/forms';
import { ConfigureService} from 'src/app/shared/services/configure.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class statusComponent implements OnInit {

displayedColumns: string[] = ['id', 'value', 'orderInList', 'action'];
columnsToDisplay: string[] = this.displayedColumns.slice();
statusList?:status[]=[];
statusListTab?:status[]=[];
valdata="";valuid=0;
dataSource = new MatTableDataSource<any>();
delpic:any;
value=true;
isDisabled=true;
  searchKey:string ='';
  listName:string ='';
  loading: boolean = true;
  selected: boolean = false;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(FormGroupDirective) formGroupDirective?: FormGroupDirective;
  param1:any;settingtype=''
  constructor(private titleService:Title,private statusSer:statusService,private loader:LoadingService
    ,private notser:ToastrService,private router: Router,private dialogService:DeleteService,
     private route: ActivatedRoute , private Config:ConfigureService
    ) {
      var teamval=this.Config.UserTeam();
      // if(teamval?.toLocaleLowerCase() !="admin_all")
      //  {
      //   this.notser.warning("not permitted")
      //   this.router.navigate(['/'] );
      //  }
      this.titleService.setTitle('Service Status');
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort as MatSort;
   this.dataSource.paginator = this.paginator as MatPaginator;

  }
  simflag=true;
  ngOnInit() {
    this.loader.busy();
    var team=  this.Config.UserTeam();
    // if(team?.toLocaleLowerCase()!='esp')
    // {
    //   this.notser.warning("not permission");
    //    this.router.navigate(['/'] );
    // }
  //   this.service.onMessage().subscribe(x=>{
  //     this.statusSer.delHW(this.delpic.id).subscribe(
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
  this.getRequestdata();

  }
  getRequestdata(){

    this.statusSer.getAll().subscribe(res=>{
      this.loader.idle();

      if(res.status==true){

        this.loading = false;

     this.statusList = res.result?.data;
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
    this.statusListTab=[];
    this.statusListTab=this.statusList ;

  this.setReactValue(Number(0),"",0);
  this.statusListTab?.sort(function(a, b) {
    let oa=0;
    if(a.orderInList !=null)
     oa=a.orderInList;
    let ob=0;
    if(b.orderInList !=null)
     ob=b.orderInList;

    return oa - ob ;
  });
  this.dataSource =new MatTableDataSource<any>(this.statusListTab);

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
    this.setReactValue(Number(r.id),r.value,0);

//this.router.navigate(['/Simdetail'],{ queryParams: {id: r.id}});

  }
  form: FormGroup = new FormGroup({
    id: new FormControl(0),
    value: new FormControl('',[Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    orderInList: new FormControl(0,[Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),

  });//18
  isDisable=false;

  onSubmit() {
this.loader.busy();
      // if (this.form.invalid||this.form.value.value==' ') {
      //   if (this.form.value.value==' ')
      //   //  this.setReactValue(Number(0),"",0);
      //   this.formGroupDirective?.resetForm();
      //    this.isDisable=false;
      //     return;
      // }

      var listval:status=new status();
      listval.serviceTypeID=Number(this.param1);
      listval.value=this.form.value.value.trim();

      listval.orderInList=this.form.value.orderInList;
      if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){
        // var HWData= this.statusListTab?.find(x=>x.value==this.form.value.value.trim());
        // if(HWData)
        // {
        // //// this.isDisable=false;
        // //  this.setReactValue(Number(0),"",0);
        // this.formGroupDirective?.resetForm();
        //   this.notser.warning("value already exist");
        //   return;
        // }
        // var orData= this.statusListTab?.find(x=>x.orderInList==this.form.value.orderInList);
        // if(orData)
        // {
        // // this.isDisable=false;
        // // this.setReactValue(Number(0),"",0);
        // this.formGroupDirective?.resetForm();
        //   this.notser.warning("order already exist");
        //   return;
        // }
      this.statusSer.Add(listval).subscribe((res)=>{
        // this.isDisable=false;

      if(res.status==true)    {
        this.loader.idle();
        var SS:status=new status();

        SS.id=res.data?.id;
        SS.value=res.data?.value;
        SS.orderInList=res.data?.orderInList;
        this.statusListTab?.push(SS)
        this.statusListTab?.sort(function(a, b) {
          let oa=0;
          if(a.orderInList !=null)
           oa=a.orderInList;
          let ob=0;
          if(b.orderInList !=null)
           ob=b.orderInList;

          return oa - ob ;
        });
        this.dataSource =new MatTableDataSource<any>(this.statusListTab);

    this.dataSource.paginator = this.paginator as MatPaginator;
      this.notser.success("Successfully Added") ;

      this.formGroupDirective?.resetForm();
      this.form.controls.orderInList.setValue(0)

      }
      else{
      this.notser.warning("Not Added!") ;

      }
      },err=>{
       // this.isDisable=false;

        if(err.status==401)
      this.router.navigate(['/loginuser'] );
      else
      this.notser.warning("! Fail");


      });
    }
    else{
      // var HWData= this.statusListTab?.find(x=>x.value==this.form.value.value.trim());
      // if(HWData &&HWData.id !=this.form.value.id)
      // {
      //   //this.isDisable=false;
      //   this.formGroupDirective?.resetForm();
      //  //this.setReactValue(Number(0),"",0);
      //   this.notser.warning("value already exist");
      //   return;
      // }
      // var ordata= this.statusListTab?.find(x=>x.orderInList==this.form.value.orderInList);
      // if(ordata &&ordata.id !=this.form.value.id)
      // {
      //  // this.isDisable=false;
      //  this.formGroupDirective?.resetForm();
      // // this.setReactValue(Number(0),"",0);
      //   this.notser.warning("order already exist");
      //   return;
      // }

     listval.id=Number(this.form.value.id);
  //   listval.serviceTypeID=this.param1;

      this.statusSer.Update(listval).subscribe((res)=>{
         this.isDisable=false;

        if(res.status==true)    {
          this.loader.idle();
          // const index1 = this.dataSource.data.indexOf(this.l);
          // this.dataSource.data.splice(index1, 1);
          // this.dataSource._updateChangeSubscription()
       this.statusListTab?.forEach(x=>
        {
          if(x.id==res.data?.id){
          x.value=res.data?.value;x.orderInList=res.data?.orderInList;
          }
        });
        this.statusListTab?.sort(function(a, b) {
          let oa=0;
          if(a.orderInList !=null)
           oa=a.orderInList;
          let ob=0;
          if(b.orderInList !=null)
           ob=b.orderInList;

          return oa - ob ;
        });
        this.dataSource =new MatTableDataSource<any>(this.statusListTab);

    this.dataSource.paginator = this.paginator as MatPaginator;
   //this.setReactValue(Number(0)," ",0);
   this.formGroupDirective?.resetForm()

          this.notser.success("Successfully Updated") ;
          this.form.controls.orderInList.setValue(0)

          }
          else{
          this.notser.warning("Not saved!") ;

          }

      },err=>{
        //this.isDisable=false;
        if(err.status==401)
        this.router.navigate(['/loginuser']);
        else
        this.notser.warning("! Fail");



      });
    }
    this.isDisabled=true;

  }




//   onChecknameIsalreadysign()
//   {


//     if(this.form.valid)
//     {

//       var id=this.statusListTab?.find( x=>x.id==this.form.value.id)
//         var ordata= this.statusListTab?.find(x=>x.orderInList==this.form.value.orderInList);
//         var HWData= this.statusListTab?.find(x=>x.value==this.form.value.value.trim());
//         // if(ordata)
//         // {

//         //   if(HWData){

//         //      this.notser.warning("Value already exist");
//         //     this.isDisabled=true;

//         //    }
//         //    else{
//         //     this.notser.warning("order already exist");
//         //   this.isDisabled=true;
//         //    return;
//         //    }

//         // }

//         // else{
//         //   this.isDisabled=false;
//         // }
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


//     }else{
//       this.isDisabled=true;
//     }
//   }
// onCheckValueIsalreadyExist(){

//   let id:number;
//   if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){
//     id=0
//   }
//   else{
//     id=this.form.value.id
//   }
//   let value=this.form.value.value.trim();
//   let orderInList=Number(this.form.value.orderInList);

//   // if(this.form.valid){
//   this.statusSer.checkValueExist(value,id).subscribe(
//     res=>{

//       if(res.status==true)
//       {


//         this.statusSer.checkOrderExist(orderInList,id).subscribe(

//           res=>{
//          debugger;

//             if(res.status==true)
//             {


//                 this.isDisabled = false;



//             }
//             //already exsit
//             else
//             {
//               if(this.form.value.orderInList==null||this.form.value.id==undefined){


//                 this.isDisabled = true;
//                 this.notser.warning("Order empty !!");
//               }
//               else{
//                 this.isDisabled = true;
//                 this.notser.warning("Order already exist");
//               }


//             }

//         }
//       )


//       }
//       // //already exsit
//       else
//       {
//         this.isDisabled = true;
//         this.notser.warning("Value already exist");

//       }

//     }
//   )
// //}

// }


// onCheckOrderIsalreadyExist(){

// let id:number;
// if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){
//   id=0
// }
// else{
//   id=this.form.value.id
// }
// let orderInList= Number(this.form.value.orderInList);

// var value= this.form.value.value.trim()


// if(this.form.value.orderInList==null||this.form.value.id==undefined){


//   // this.isDisabled = true;
//   this.notser.warning("Order empty !!");
// }
// else{
//   this.statusSer.checkOrderExist(orderInList,id).subscribe(

//     res=>{

//       if(res.status==true)
//       {

//         this.statusSer.checkValueExist(value,id).subscribe(
//           res=>{
//             debugger;
//             if(res.status==true)
//             {


//                 this.isDisabled = false;



//             }
//             //already exsit
//             else
//             {
//               this.isDisabled = true;
//               this.notser.warning("Value already exist");

//             }
//           }
//         )

//       }
//       //already exsit
//       else
//       {
//         this.isDisabled = true;
//         this.notser.warning("Order already exist");

//       }

//   }
// )
// }

// // }
// }



onCheckValueIsalreadyExist(){

  let id:number;
  if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){
    id=0
  }
  else{
    id=this.form.value.id
  }
  let value=this.form.value.value.trim();
  let orderInList=Number(this.form.value.orderInList);

  let serviceTypeId=this.param1;
  // if(this.form.valid){
    this.statusSer.checkValueExist(value,id).subscribe(
    res=>{

      if(res.status==true)
      {

        this.value=true;;
        this.statusSer.checkOrderExist(orderInList,id).subscribe(

          res=>{
         debugger;

            if(res.status==true)
            {


                this.isDisabled = false;



            }
            //already exsit
            else
            {
              if(this.form.value.orderInList==null||this.form.value.id==undefined){


                this.isDisabled = true;
                this.notser.warning('order is required');
                // this.empty=false;
                // setTimeout(()=>this.empty=true, 2000)
              }
              else{
                this.isDisabled = true;
                this.notser.warning('order is already Exist');
              //  this.order=false;;
              //  setTimeout(()=>this.order=true, 2000)
              }


            }

        }
      )


      }
      // //already exsit
      else
      {
        this.isDisabled = true;

        this.value=false;;
      //  setTimeout(()=>this.value=true, 2000)
      }

    }
  )
//}

}


onCheckOrderIsalreadyExist(){

let id:number;
if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){
  id=0
}
else{
  id=this.form.value.id
}
let orderInList= Number(this.form.value.orderInList);
let serviceTypeId=this.param1;
var value= this.form.value.value.trim()


if(this.form.value.orderInList==null||this.form.value.orderInList==undefined){


   this.isDisabled = true;
  // this.empty=false;
  this.notser.warning('order is required');
 // setTimeout(()=>this.empty=true, 2000)
}
else{
  this.statusSer.checkOrderExist(orderInList,id).subscribe(

    res=>{

      if(res.status==true)
      {

        this.statusSer.checkValueExist(value,id).subscribe(
          res=>{

            if(res.status==true)
            {


                this.isDisabled = false;
                this.value=true;;


            }
            //already exsit
            else
            {
              this.isDisabled = true;
             this.value=false;;
            //  setTimeout(()=>this.value=true, 2000)

            }
          }
        )

      }
      //already exsit
      else
      {
        this.isDisabled = true;
      //  this.order=false;;
      //  setTimeout(()=>this.order=true, 2000)
       this.notser.warning('order is already Exist');


      }

  }
)
}

// }
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
      this.statusSer.Remove($key).subscribe(
        res=>{
      this.notser.success('Deleted successfully!');

      this.getRequestdata();
      });

    }
  });
}
}


