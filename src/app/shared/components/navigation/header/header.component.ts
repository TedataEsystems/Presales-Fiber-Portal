import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfigureService } from 'src/app/shared/services/configure.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() public sidenavToggle = new EventEmitter();
  isNotAdmin=false;
isPresales=false;
statusList:any=[];

  constructor(private conser:ConfigureService , private router :Router,private notificationService:NotificationService) {
    var teamval=this.conser.UserTeam();

    if(teamval?.toLocaleLowerCase() !="admin_all")
    this.isNotAdmin=true;

    if(teamval?.toLocaleLowerCase() == "presalesfiber_presale")
    this.isPresales=true;


  }
// constructor( private router :Router,private accountService : AccountService,private notificationService:NotificationMsgService) { }
UserName:any="";
ngOnInit(): void {
this.UserName=this.conser.UserName();
}

logOut(){
  // localStorage.clear();
  // this.accountService.logout().subscribe(res=>{
    this.conser.Logout();
    this.router.navigateByUrl('/loginuser');

  // }

  // ,error=>{this.notificationService.warn('occured an error ')}
  // );

}
public onToggleSidenav=()=> {
this.sidenavToggle.emit();
}
// toggleFullscreen() {
//   if (screenfull.isEnabled) {
//     screenfull.toggle();
//   }
// }

}
