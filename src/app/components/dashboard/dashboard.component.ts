import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { EditComponent } from '../edit/edit.component';
// import { DeleteServiceService } from 'src/app/shared/services/delete-service.service';
// import { EmpService } from 'src/app/shared/services/emp.service';
// import { TestComponent } from '../test/test.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  istolate: boolean
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H',istolate:false},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He',istolate:false},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li',istolate:false},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' ,istolate:false},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B',istolate:false},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C',istolate:false},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N',istolate:false},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O',istolate:false},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' ,istolate:false},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' ,istolate:true},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchKey:string ='' ;
  editUsr: any;oldUsr: any;
  editdisabled:boolean=false;
  show:boolean= false;
  showNewRow:boolean=false;
  constructor(private titleService:Title, private note:NotificationService,private _bottomSheet: MatBottomSheet)
  // constructor(private dialog: MatDialog,public service:EmpService ,private titleService:Title ,private dialogService:DeleteServiceService )
  {
    //  this.searchKey='';
    this.titleService.setTitle("Home"); 
    
  }
 
  
  @ViewChild(MatSort) sort?:MatSort ;
  @ViewChild(MatPaginator) paginator?:MatPaginator ;
  displayedColumns: string[] = ['action','position', 'name', 'weight', 'symbol','istolate'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  // searchKey!:string;

  ngOnInit(){
    this.editUsr=0;
   
  }

  ngAfterViewInit() { 
  
    this.dataSource.sort = this.sort as MatSort;
    this.dataSource.paginator = this.paginator as MatPaginator;}

    onSearchClear(){
      this.searchKey ='';
      this.applyFilter();
    }
    applyFilter(){
      this.dataSource.filter=this.searchKey.trim().toLowerCase();
    }

//////////////import file
import(){
  this.show=true;

}
importEmpty(){
  this.show=true;

}
addNew(){
  //this.service.initializeFormGroup();
  // const dialogGonfig = new MatDialogConfig();
  // dialogGonfig.disableClose=true;
  // dialogGonfig.autoFocus= true;
  // dialogGonfig.width="50%";
  // dialogGonfig.panelClass='modals-dialog';
  //this.dialog.open(TestComponent,dialogGonfig);

  this._bottomSheet.open(EditComponent,{
    panelClass: 'Edit-dialog-container',
    disableClose: true
  }
    );



}



Upload(){
  this.show=false;
}




    onDelete(r:any){
      //this.dialogService.openConfirmDialog();
     
      // this.dialogService.openConfirmDialog().afterClosed().subscribe(res=>{
      
      
      // });
      this.note.DeleteRow();
    }



///////////////////////////////tes2
editROw(r: any){
  // console.log(r)
  // this.editUsr = r && r.Id?r:{};
  this.editUsr=r.id;
  this.editdisabled = true;
 
}
updateEdit(){
  //updateEdit
  this.cancelEdit();
  // this.userServ.updateUser(this.editUsr)
  //   .subscribe((data: any) => {
  //     this.editUsr= {};
  //     this.editdisabled = false;
  //     if(data.Data && data.Status==1){
  //       this.oldUsr= {};
  //       this.toastr.success(data.Message, 'Success!');
  //     }else{
  //       this.cancelEdit();
  //       this.toastr.error(data.Message, 'Error!');
  //     }
  //   }, err => {
  //       this.toastr.error("Please try after some time", 'Error!');
  //       this.editdisabled = false;
  //       this.cancelEdit();
  //   });
}
cancelEdit(){
  this.editdisabled = false;
  //cancel
  // this.editUsr= {};
  // if(this.oldUsr&& this.oldUsr.Id){
  //   this.dataListSubs = this.dataSource.usersData.pipe(
  //     distinctUntilChanged()
  //   ).subscribe((data)=>{
  //     if(data.length<=0){
  //     }else{
  //       let index = data.findIndex(item => item.Id === this.oldUsr.Id)
  //       data.splice(index, 1, this.oldUsr)
  //       this.dataSource.changeDataSource(data);
  //     }
  //   })
  //   this.dataListSubs.unsubscribe();
  //   console.log(this.oldUsr, 'this.oldUsr', this.dataSource.usersData)
  // }
}



}
