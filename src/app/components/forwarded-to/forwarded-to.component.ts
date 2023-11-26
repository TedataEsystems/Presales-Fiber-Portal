import { Component, OnInit,Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SalesUsers } from 'src/app/Models/saleUserDto';
import { SalesUserService } from 'src/app/shared/services/sales-user.service';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';

@Component({
  selector: 'app-forwarded-to',
  templateUrl: './forwarded-to.component.html',
  styleUrls: ['./forwarded-to.component.css']
})
export class ForwardedToComponent implements OnInit {
   salesList?:SalesUsers[]=[];
   user=''
  constructor(private dialogRef:MatDialogRef<ForwardedToComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private forwardService:ServiceRegisterService,
    private toast:ToastrService,
    private service :SalesUserService) { }

  ngOnInit(): void {
    this.getSalesList();

  }





  getSalesList(){
    this.service.getSalesUser().subscribe(
      (res) => {
        if (res.status == true) {


          console.log('resList:',res)

          this.salesList = res.data;
        } else {}
      },
      (err) => {

      }
    )
  }


  Forward(){

  let obj={
    id:this.data.id,
    forwardedToUserName:this.user
  }
console.log('obj:',obj)
this.forwardService.ForwardRequest(obj).subscribe(
  (res) => {
    if (res.status == true) {

      console.log('res:',res)

     this.toast.success(`Successfully Forwarded request to ${obj.forwardedToUserName}`);
     this.onClose();

    } else {}
  },
  (err) => {

  }
)


  }

  onClose(){
    this.user='';
    this.dialogRef.close();
  }

}
