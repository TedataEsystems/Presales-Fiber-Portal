import { Component, OnInit } from '@angular/core';
import { ConfigureService } from 'src/app/shared/services/configure.service';
import { statusService } from 'src/app/shared/services/status.service';

@Component({
  selector: 'app-navlist',
  templateUrl: './navlist.component.html',
  styleUrls: ['./navlist.component.css']
})
export class NavlistComponent implements OnInit {

  statusList:any=[];
  statusEsptList:any=[];
  isExpanded= true;
  isExpanded1= true;
  isExpanded2= true;
  isExpanded3= true;
  isExpanded4 = true;
  isExpanded5 = true;
  isExpanded6 = true;
  isExpanded7 = true;
  isExpanded8 = true;
  isExpanded9 = true;


  showSubmenu = true;
  showSubmenu1 = false;
  showSubmenu2 = false;
  showSubmenu3 = false;
  showSubmenu4 = false;
  showSubmenu5 = false;
  showSubmenu6 = false;
  showSubmenu7 = false;
  showSubmenu8 = false;
  showSubmenu9 = false;
  isShowing = false;
  isShowing1 = false;
  isShowing2 = false;
  isShowing3 = false;
  isShowing4 = false;
  isShowing5 = false;
  isShowing6 = false;
  isShowing7 = false;
  isShowing8 = false;
  isShowing9 = false;

  showSubSubMenu: boolean = false;
  isNotAdmin=false;
  isAdmin=false;
isPresales=false;
isEspt=false;
isSales=false;

  constructor(private statusSer:statusService,private conser:ConfigureService  ) {
    var teamval=this.conser.UserTeam();

    if(teamval?.toLocaleLowerCase() == "presalesfiber_presale"){
      this.isPresales=true;

    }
    else if(teamval?.toLocaleLowerCase() == "presalesfiber_sales")
      {this.isSales=true}

    else if(teamval?.toLocaleLowerCase() == "presalesfiber_espt")
   {this.isEspt=true;}
     else{
      this.isAdmin=true
     }


  }

  ngOnInit(): void {
    this.statusSer.getAll().subscribe(res=>{
      this.statusList = res.result?.data;
      this.statusEsptList=this.statusList.filter((x:any)=>
        (x.value=='Pending ESPT' ||  x.value=='Pending ESPT Validation' || x.value=='Pending TE'))
  }
    );

}

}
