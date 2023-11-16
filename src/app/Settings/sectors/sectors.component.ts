import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { SectorDto } from 'src/app/Models/sectorDTO';
import { DeleteService } from 'src/app/shared/services/delete.service';
import { SectorService } from 'src/app/shared/services/sector.service';

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit ,AfterViewInit{
  displayedColumns: string[] = ['id', 'value', 'action'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource = new MatTableDataSource<SectorDto>();
  searchKey:string ='';
  sortColumnDef: string = "id";
  SortDirDef: string = 'ASC';
  sectorList:SectorDto[]=[];
  loading: boolean = true;
  isDisabled=true;
  value=true;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(FormGroupDirective) formGroupDirective?: FormGroupDirective;
  form: FormGroup = new FormGroup({
    id: new FormControl(0),
    value: new FormControl('',[Validators.required,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)])
  });
  constructor(private _SectorService: SectorService,private titleService:Title, private toast :ToastrService,private dialogService:DeleteService) { }

  ngOnInit(): void {
    this.form;
    this.titleService.setTitle("Sectors")
    this.getAllSectors(100,1,0,'',this.sortColumnDef,0,this.SortDirDef,'');
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort as MatSort;
   this.dataSource.paginator = this.paginator as MatPaginator;

  }


  getAllSectors(pagesize:number,pagenumber:number,statusId:number,searchvalue:string,sortcolumn:string,servicetype:number,sortcolumndir:string,attributeName:string){


    this._SectorService.getAllSectors(pagesize,pagenumber,statusId,searchvalue,sortcolumn,servicetype,sortcolumndir,attributeName).subscribe(res=>{

     if(res.status)
     {
      this.sectorList= res.result.data;
      this.dataSource=new MatTableDataSource<SectorDto>(this.sectorList)
      this.dataSource.paginator = this.paginator as MatPaginator;

     }
     else{
      this.toast.error(res.error)
     }


    })


  }
  setReactValue(id:number,val:any){
    this.form.patchValue({
      id: id,
      value:val,

    });
  }

  onSubmit(){


    // if (this.form.invalid || this.form.controls.value.value=='') {
    //   if (this.form.controls.value.value=='')
    //   // this.setReactValue(Number(0),"");
    //   this.form['controls']['value'].setValue('');
    //   this.form['controls']['id'].setValue(0);
    //     return;
    // }

    if(this.form.value.id==0||this.form.value.id==null||this.form.value.id==undefined){


      let list={
            id: Number(this.form.value.id),
            value:this.form.value.value
      }


       this._SectorService.addSector(list).subscribe(res=>{

        if(res.status){

          this.toast.success('Successfully Added');
          this.formGroupDirective?.resetForm();
          this.form.controls.id.setValue(0)
          this.getAllSectors(100,1,0,'',this.sortColumnDef,0,this.SortDirDef,'');

        }
        else{
          this.toast.error(res.error)
        }
       })


  }
  else{
    //////update

    // var sectorValue=  this.sectorList?.find(x=>x.value==this.form.controls.value.value.trim());
    // if(sectorValue && (sectorValue.id !=this.form.controls.id.value))
    // {


    // //this.setReactValue(Number(0),"");
    // this.form['controls']['value'].setValue('');
    //   this.form['controls']['id'].setValue(0);

    //   this.toast.warning("Sectore is already exist");

    //   //this.form.reset();
    //   return;
    // }
    // else if(sectorValue && (sectorValue.id ==this.form.controls.id.value)){
    //   return

    // }
    // else{
    this._SectorService.updateSector(this.form.value).subscribe(res=>{

      if(res.status){

        this.toast.success('Successfully Updated');
        this.formGroupDirective?.resetForm();
        this.form.controls.id.setValue(0)
        this.getAllSectors(100,1,0,'',this.sortColumnDef,0,this.SortDirDef,'');

      }
      else{
        this.toast.error(res.error)
      }
     })
    }

  //}

this.isDisabled=true;
  }

  onChecknameIsalreadysign()
  { debugger
    this.value=true;
    this.form.controls.value.setValue(this.form.value.value.trim());
    var sectorValue=  this.sectorList?.find(x=>x.value?.toLowerCase()==this.form.value.value.toLowerCase());
    if(this.form.valid)
    {
        //add

if(this.form.value.id ==0 || this.form.value.id ==null || this.form.value.id ==undefined){
  if(sectorValue)
  {
   this.value=false;
   // this.toast.warning("Sector is already exist");
   // this.form.reset();
   this.isDisabled=true;
    //return;
  }
  else{
    this.value=true;
    this.isDisabled=false;
  }
}
else{
  //edit

  if(sectorValue&& (sectorValue.id !=this.form.value.id))
  {
    this.value=false;
   // this.toast.warning("Sector is already exist");
   // this.form.reset();
   this.isDisabled=true;
    //return;
  }
  else{
    this.value=true;
    this.isDisabled=false;
  }

}



    }else{
      this.isDisabled=true;
    }
  }

  onEdit(row:any){

    this.setReactValue(Number(row.id),row.value.trim());

  }





  onDelete(id:number){


    this.dialogService.openConfirmDialog()
  .afterClosed().subscribe(res =>{
    if(res){
      this._SectorService.deleteSector(id).subscribe(res=>{

        if(res.status)
        {
          this.toast.success('Successfully Deleted')
          this.getAllSectors(100,1,0,'',this.sortColumnDef,0,this.SortDirDef,'');
        }
        else{
          this.toast.error(res.error)
        }
      })

    }
  });


  }
  applyFilter(filterValue: Event) {

    this.dataSource.filter =(<HTMLInputElement>filterValue.target).value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onSearchClear(){
    this.searchKey ='';

    if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
    }
  }
}
