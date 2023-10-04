import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType} from 'chart.js';
import { Color, Label,MultiDataSet } from 'ng2-charts';


import { ActivatedRoute, Router } from '@angular/router';

import {ConfigureService}from'src/app/shared/services/configure.service';
import {statusService}from'src/app/shared/services/status.service';
import {NotificationService}from'src/app/shared/services/notification.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  TotalNumorderStat:number=0;
  TotalNumReceiptStat:number=0;
  TotalNumR:number=0;
  Total:number=0;
  TotalinvenStat:number=0;
  count:number=0;
  ternumber:number=0;
  sennumber:number=0;
  tefnumber:number=0;


// /////////////////////////test/////////////////////////////////////

  FiberCount:any=1;
waveCount:any=1;
CopperCount:any=1;
 fiberlist:any[]=[]
 wavelist:any[]=[]
 copperList:any[]=[];
  // public doughnutChartType: ChartType = 'doughnut';
  constructor(private chartser:statusService,private loader:LoadingService ,private notser:ToastrService ,private titleService:Title ,private conser:ConfigureService,private router: Router) {
    this.titleService.setTitle('Home');
  }
nullfiber=0;
nullcopper=0;
nullmc=0;



  ngOnInit(): void {
    this.loader.busy();
    if(!this.conser.UserToken())
    this.router.navigate(['/loginuser'] );




    ////////chart/////////////////////

    this.chartser.getchart().subscribe(x=>{
      console.log(x);
      if(x.status==true){
        console.log('data:',x.data)
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
        this.fiberlist.forEach(item => {
          this.doughnutChartLabels.push(item.key);
           this.doughnutChartData.push(item.value);
        });

        let cpOfNull={key:"Null Value",value:this.CopperCount-this.nullcopper}
        this.copperList.push(cpOfNull)
        this.copperList.forEach(item => {

          this.doughnutChartLabelsps.push(item.key);
          this.doughnutChartDataps.push(item.value);
        });


        let mwOfNull={key:"Null Value",value:this.waveCount-this.nullmc}
        this.wavelist.push(mwOfNull)
        this.wavelist.forEach(item => {
          this.doughnutChartLabelsp.push(item.key);
          this.doughnutChartDatap.push(item.value);
        });
        console.log('this.doughnutChartData:',this.doughnutChartData)
        console.log('this.doughnutChartDataps:',this.doughnutChartDataps)
console.log('this.doughnutChartDatap:',this.doughnutChartDatap)



      }
      else{
        this.notser.error(x.error);

      }
      },err=>{
        if(err.status==401)
        this.router.navigate(['/loginuser']);
        else
        this.notser.warning("! Fail");

      })


      ////////////////end chart////////////////////////////////

  }



  ngAfterViewInit() {
    setTimeout(()=>this.loader.idle(),1000)

  }



  /////////////////donut chart//////////////////
  doughnutChartOptions:ChartOptions = {
    responsive: true,
    legend: {
      position: 'left'
   }

  };

  doughnutChartLabels: Label[] = [];
  doughnutChartData: MultiDataSet = [
    []
  ];
  doughnutChartLabelsp: Label[] = [];
  doughnutChartDatap: MultiDataSet = [
    []
  ];

  doughnutChartLabelsps: Label[] = [];
  doughnutChartDataps: MultiDataSet = [
    []
  ];

  doughnutChartType: ChartType = 'doughnut';
  colors: Color[] = [
    {
      backgroundColor: [
        '#8e2279',
        '#80868b',
      '#d7d7d7',
"#0f1323",
 "#1b3c51",
 "#791a75",

        'blue', 'red','pink','orange','purple','brown','DeepPink','DarkOrange'
      ]
    }
  ];

  doughnutChartPlugins = [{

    afterLayout: function (chart:any) {
      chart.legend.legendItems.forEach(
        (label:any) => {
          let value = chart.data.datasets[0].data[label.index];

          label.text += ' ' + value;
          return label;
        }
      )
    }
  }];


}
