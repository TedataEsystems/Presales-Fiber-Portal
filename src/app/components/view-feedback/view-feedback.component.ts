import { Component, Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FeedbackComponent } from '../feedback/feedback.component';



@Component({
  selector: 'app-view-feedback',
  templateUrl: './view-feedback.component.html',
  styleUrls: ['./view-feedback.component.css']
})
export class ViewFeedbackComponent implements OnInit {



   constructor(private loading :LoadingService,
     private dialogRef:MatDialogRef<FeedbackComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }


   ngOnInit(): void {


       if (this.data.row) {

        this.data.row?.comment


       }

   }


   onClose() {

     this.dialogRef.close('save');
 }


}
