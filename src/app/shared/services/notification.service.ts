import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  horizontalPosition:MatSnackBarHorizontalPosition ='right';
  verticalPosition:MatSnackBarVerticalPosition='top';
  constructor(public snackBar: MatSnackBar) { }

  

 
  // config: MatSnackBarConfig = {
  //   duration:3000,
  //   horizontalPosition:this.horizontalPosition,
  //   verticalPosition:this.verticalPosition
  // }

  // success(msg:string) {
  //   this.config['panelClass'] = ['notification', 'success'];
  //   this.snackBar.open(msg,'',this.config);
  // }

  // warn(msg:string) {
  //   this.config['panelClass'] = ['notification', 'warn'];
  //   this.snackBar.open(msg, '', this.config);
  // }

  success(text :any){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Successfully Operation',
      showConfirmButton: false,
      timer: 1500
    })
  }
  Error(){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'An Error Occured',
      showConfirmButton: false,
      timer: 1500
    })

  }

  Warning(text :any){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: text,
      width:'800px',
      showConfirmButton: true,
      // timer: 3000
    })
  }
    DeleteRow(){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        position:'center',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
  }
}
