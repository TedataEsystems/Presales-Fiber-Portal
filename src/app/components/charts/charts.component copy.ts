import { Component, OnInit } from '@angular/core';
import {Chart, ChartOptions, ChartType  } from 'chart.js';
//import { Color, Label,MultiDataSet } from 'ng2-charts';
import { ActivatedRoute, Router } from '@angular/router';

import {ConfigureService}from'src/app/shared/services/configure.service';
import {statusService}from'src/app/shared/services/status.service';
import {NotificationService}from'src/app/shared/services/notification.service';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  // public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // public doughnutChartData: MultiDataSet = [
  //   [350, 450, 100],
  //   [50, 150, 120],
  //   [250, 130, 70],
  // ];
  FiberCount:any=1;
waveCount:any=1;
CopperCount:any=1;
 fiberlist:any[]=[]
 wavelist:any[]=[]
 copperList:any[]=[];
  public doughnutChartType: ChartType = 'doughnut';
  constructor(private chartser:statusService ,private notser:NotificationService ,private titleService:Title ,private conser:ConfigureService,private router: Router) {
    this.titleService.setTitle('Home');
  }
nullfiber=0;
nullcopper=0;
nullmc=0;
  ngOnInit(): void {
    if(!this.conser.UserToken())
    this.router.navigate(['/loginuser'] );

    this.chartser.getchart().subscribe(x=>{
      console.log(x);
      if(x.status==true){
        this.FiberCount=x.data.fiber;
        this.CopperCount=x.data.copper  ;
        this.waveCount=x.data.microwave ;
        this.fiberlist=x.data.fiberDetails;
        this.wavelist=x.data.microwaveDetails;
        this.copperList=x.data.copperDetails;
        this.fiberlist.forEach(item => {

          this.nullfiber+=item.value
        });
        this.copperList.forEach(item => {

          this.nullcopper+=item.value
        });
        this.wavelist.forEach(item => {

          this.nullmc+=item.value
        });

        let fbOfNull={key:"Null Value",value:this.FiberCount-this.nullfiber}
        this.fiberlist.push(fbOfNull);
        let cpOfNull={key:"Null Value",value:this.CopperCount-this.nullcopper}
        this.copperList.push(cpOfNull)
        let mwOfNull={key:"Null Value",value:this.waveCount-this.nullmc}
        this.wavelist.push(mwOfNull)
      }
      else{
        this.notser.Warning(x.error);

      }
      },err=>{
        if(err.status==401)
        this.router.navigate(['/loginuser']);
        else
        this.notser.Warning("! Fail");

      })

  }

}
