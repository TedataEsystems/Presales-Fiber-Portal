import { BreakpointObserver, MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {ConfigureService} from 'src/app/shared/services/configure.service'
import { statusService } from '../../services/status.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit,AfterViewInit,OnDestroy {

 isMenuOpen = true;
  contentMargin = 240;
isNotAdmin=false;
statusList:any=[];
mobileQuery: MediaQueryList;
@ViewChild('sidenav')sidenav!: MatSidenav;
  private _mobileQueryListener: () => void;


  constructor(private conser:ConfigureService, private statusSer:statusService,private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,private observer: BreakpointObserver) {

    var teamval=this.conser.UserTeam();
    if(teamval?.toLocaleLowerCase() !="admin_all")
    this.isNotAdmin=true;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
   this.mobileQuery.addListener(this._mobileQueryListener);

   }

  ngOnInit(): void {


      // this.statusSer.getAll().subscribe(res=>{
      //  this.statusList = res.result?.data;
      //  console.log(this.statusList);
      // });


   }





  ngAfterViewInit() {


    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
        // Manually trigger change detection after modifying the sidenav properties
        this.changeDetectorRef.detectChanges();
  }
  onToolbarMenuToggle() {

    this.isMenuOpen = !this.isMenuOpen;

    if(!this.isMenuOpen) {
      this.contentMargin = 0 ;


    } else {
      this.contentMargin = 240;



    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
