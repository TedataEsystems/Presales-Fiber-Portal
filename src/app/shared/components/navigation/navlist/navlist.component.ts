import { Component, OnInit } from '@angular/core';
import { statusService } from 'src/app/shared/services/status.service';

@Component({
  selector: 'app-navlist',
  templateUrl: './navlist.component.html',
  styleUrls: ['./navlist.component.css']
})
export class NavlistComponent implements OnInit {

  statusList:any=[];
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

  constructor(private statusSer:statusService) {


  }

  ngOnInit(): void {
    this.statusSer.getAll().subscribe(res=>{
      this.statusList = res.result?.data;
  }
    );
}

}
