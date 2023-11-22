import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forwarded-to',
  templateUrl: './forwarded-to.component.html',
  styleUrls: ['./forwarded-to.component.css']
})
export class ForwardedToComponent implements OnInit {

  constructor(private dialogRef:MatDialogRef<ForwardedToComponent>) { }

  ngOnInit(): void {
  }





  onClose(){
    this.dialogRef.close();
  }

}
