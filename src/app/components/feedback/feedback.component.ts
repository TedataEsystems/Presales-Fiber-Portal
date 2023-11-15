import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FeedbackDto } from 'src/app/Models/feedbackDTO';
import { FileuploadService } from 'src/app/shared/services/fileupload.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ServiceRegisterService } from 'src/app/shared/services/service-register.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  dialogTitle=""
 fileAttr = 'Choose File ...'
  fileVal :File[]=[];
  registerDetailID:number=0;
  isTriggered:boolean=false;
  constructor(private fb:FormBuilder, private toastr:ToastrService,private fileser: FileuploadService,private loading :LoadingService,
    private _feedService :ServiceRegisterService,private dialogRef:MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  form:FormGroup=this.fb.group({
    id:[0],
    textData:[''],
    Availability:[null],
    Distance:[null],
     registerDetailID:[0]

  })

  ngOnInit(): void {
    if (this.data.dialogTitle == "Add") {
      this.dialogTitle = 'Create';

      this.form.controls['registerDetailID'].setValue(this.data.registerDetailID);
    }
    else {
      this.dialogTitle = 'Update';
      if (this.data.row) {
        this.form.controls['id'].setValue(this.data.row.id);
        this.form.controls['textData'].setValue(this.data.row?.comment);
        this.form.controls['Availability'].setValue(this.data.row?.availability);
        this.form.controls['Distance'].setValue(this.data.row?.distance);
        this.form.controls['registerDetailID'].setValue(this.data.registerDetailID);
        if(this.data.row?.attaches){
          this.fileVal=this.data.row?.attaches;
          // for(let i=0 ; i< this.fileVal?.length;i++){
          //     this.fileAttr += this.fileVal[i].name +' , ';
          //   }
        }


      }
    }
    this.form;





  }
  onSubmit() {
this.loading.busy();
    if (this.form.invalid) {

      return;

    }

    if (this.data.dialogTitle == "Add") {

      let feedobj={
        id: 0,
        comment:this.form.controls['textData'].value,
        Availability: this.form.controls['Availability'].value,
        Distance:this.form.controls['Distance'].value,
        registerDetailID:Number(this.form.controls['registerDetailID'].value)
      }

      if(this.form.controls['id'].value == 0 &&
      this.form.controls['Availability'].value == null
      && this.form.controls['textData'].value == '' &&
      this.form.controls['Distance'].value == null){
        if(!this.isTriggered){
          return
        }
      }
      this._feedService.AddFeedback(feedobj).subscribe((res)=>{
        if (res.status == true) {

          if(this.isTriggered){
            this.Upload(res.data.id);

          }
          else{
            this.onClose()
          }

          this.toastr.success("Successfully Added")
          this.loading.idle();

        }
        else this.toastr.error(res.error);

    },
    (err)=>{
      this.toastr.error(err)
    })

    }
    else {
      debugger
      let feedobj={
        id: this.form.controls['id'].value,
        comment:this.form.controls['textData'].value,
        Availability: this.form.controls['Availability'].value,
        Distance:this.form.controls['Distance'].value,

        registerDetailID:Number(this.form.controls['registerDetailID'].value)
      }

      if(this.form.controls['id'].value == this.data.row.id &&
      this.form.controls['Availability'].value == this.data.row.availability
      && this.form.controls['textData'].value == this.data.row.comment &&
      this.form.controls['Distance'].value == this.data.row.distance){
        if(!this.isTriggered){
          return
        }

      }
      this._feedService.updateFeedback(feedobj).subscribe((res)=>{
        if (res.status == true) {
          if(this.isTriggered){
         this.Upload(Number(this.form.controls['id'].value));
          }
          else{
            this.onClose()
          }

          this.toastr.success("Successfully Updated")
          this.loading.idle();

        }
        else this.toastr.error(res.error);

    },
    (err)=>{
      this.toastr.error(err)
    })

    }


  }
  // onSubmit(){

  //   alert(`form : ${this.form.value}`)
  //   this.resetfile();
  // }



  uploadFileEvtAttach(imgFile: any) {

    if (imgFile.target.files && imgFile.target.files[0]) {

      //this.fileAttr =' ';
      Object.values(imgFile.target.files).forEach((file:any)=> {


        if(file == null || file.size == 0)

        {
          this.toastr.error(`${file.name} is empty`)
        }
        else{
          // this.fileAttr += file.name +' , ';
          this.fileVal.push(file);
        }


      })
      this.isTriggered=true;

    } else {
      this.fileAttr = 'Choose File ...';
    }
  }



  Upload(id:number){

    var formData = new FormData();

    if (this.fileVal) {
      console.log('this.fileVal:',this.fileVal)

      for (let i = 0; i < this.fileVal.length; i++) {
          formData.append('formFiles',this.fileVal[i]);
      }
      console.log('formDatain Comp', formData.getAll);
      this.fileser.AddEsptFeedbackFile(formData,id).subscribe(res=>{

            this.resetfile();
            if(res.status){
              this.onClose()



        }
          else
          this.toastr.error(res.error );

        },err=>{
          if(err.status==401)
          this.toastr.error("! Fail");
          else
          this.toastr.warning("! Fail");

        })
     }
     else{
     return
     }





  }


  removeImg(index:number){

var files:File[]=[]
   for(let i=0;i<this.fileVal.length;i++){
    if(this.fileVal[i]!=this.fileVal[index]){
      files.push(this.fileVal[i]);
      // this.fileAttr += this.fileVal[i].name +' , ';
    }
   }
   this.fileVal=files;

  }


  resetfile() {

    this.fileAttr = 'Choose File ...';



  }
  onClose() {
     this.form.reset();
    this.dialogRef.close('save');
}

}
