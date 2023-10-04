import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService} from 'src/app/shared/services/notification.service';
import {EmpService} from "src/app/shared/services/emp.service";
import {DialogService} from "src/app/shared/services/dialog.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.css']
})
export class MatConfirmDialogComponent implements OnInit {

  constructor(private dialser :DialogService, public dialogRef: MatDialogRef<MatConfirmDialogComponent>,public notificationService: NotificationService, public translate:TranslateService
    ,private ser: EmpService 
    ) { }

  ngOnInit(): void {
  }
  onClose(){
  
    this.dialogRef.close();

  }
  onDelete(){
    //if(confirm('Are you sure to delete this record ?')){
  this.ser.sendMessage("");
        this.onClose();

      //  this.notificationService.warn('! Deleted successfully');
    //}
  }

}
