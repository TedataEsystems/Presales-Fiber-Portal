import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('fileInputDoc',{static:false}) fileInputDoc?: any;
  @ViewChild('fileInputImg',{static:false}) fileInputImg?: any;
  @ViewChild('fileInputVed',{static:false}) fileInputVed?: any;
  @ViewChild('fileInputAttach',{static:false}) fileInputAttach?: any;
 // @ViewChild('contentTopdf',{static:false}) pageEl?: ElementRef;
  fileAttrImg = 'Choose File ...';
  fileAttrVed = 'Choose File ...';
  fileAttrAttach = 'Choose File ...';
  fileAttrDoc = 'Choose File ...';
  fileVal :any;
  constructor(private fb:FormBuilder, private toastr:ToastrService) { }

  form:FormGroup=this.fb.group({
    textData:[''],
    uploadAttach:[null],
    uploadImage:[null],
    uploadVedio:[null],
    uploadDocument:[null]


  })

  ngOnInit(): void {
  }
  onSubmit(){

    alert(`form : ${this.form.value}`)
    this.resetfile();
  }


  uploadFileEvtDoc(imgFile: any) {

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileVal=imgFile.target.files[0];
      this.fileAttrDoc = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttrDoc += file.name ;
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
      this.fileAttrDoc = 'Choose File ...';
    }
  }

  uploadFileEvtAttach(imgFile: any) {

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileVal=imgFile.target.files[0];
      this.fileAttrAttach = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttrAttach += file.name ;
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
      this.fileAttrAttach = 'Choose File ...';
    }
  }
  uploadFileEvtImg(imgFile: any) {

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileVal=imgFile.target.files[0];
      this.fileAttrImg = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttrImg += file.name ;
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
      this.fileAttrImg = 'Choose File ...';
    }
  }
  uploadFileEvtVedio(imgFile: any) {

    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileVal=imgFile.target.files[0];
      this.fileAttrVed = '';
      Array.prototype.forEach.call(imgFile.target.files, (file) => {
        this.fileAttrVed += file.name ;
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
      this.fileAttrVed = 'Choose File ...';
    }
  }



//   Upload(){
//     if(this.fileAttr == 'Choose File ...'){
//       return
//     }
//     let formData = new FormData();
//     formData.append('formFile', this.fileVal);
//     this.fileser.addfile(formData,this.param1).subscribe(res=>{
//     this.loading=false
//      console.log(res);
//     this.resetfile();
//     if(res.status){
//     this.toastr.success('Uploaded');
//     if(!this.datafiles) this.datafiles=[];
//      this.datafiles?.push(res.data);
//      this.dataSource =  new MatTableDataSource<any>(this.datafiles);

// }
//   else
//   this.toastr.error(res.error );

// },err=>{
//   if(err.status==401)
//   this.router.navigate(['/loginuser'], { relativeTo: this.route });
//   else
//   this.toastr.warning("! Fail");

// })
//   }



  resetfile() {
    this.fileAttrVed = 'Choose File ...';
    this.fileAttrImg = 'Choose File ...';
    this.fileAttrDoc = 'Choose File ...';
    this.fileAttrAttach = 'Choose File ...';
    this.form.reset();
    // (this.fileInputDoc as ElementRef).nativeElement.value = "";
    // (this.fileInputAttach as ElementRef).nativeElement.value = "";
    // (this.fileInputImg as ElementRef).nativeElement.value = "";
    // (this.fileInputVed as ElementRef).nativeElement.value = "";

  }

}
