// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Component, OnInit } from '@angular/core';
import { SilkQueryService } from '../silk-query.service';
import { Observable } from 'rxjs/Rx';
import { TopTalker } from '../models/TopTalker';
import { Chart } from 'chart.js'

@Component({
  selector: 'top-talkers-component',
  templateUrl: './topTalkers.component.html',
  styleUrls: ['./topTalkers.component.css']
})

export class TopTalkersComponent implements OnInit {

  // For charts
  topTalkers = <any>[];
  topChart = <any>[]

  constructor(private _silk: SilkQueryService) { }

  ngOnInit() {
    this.getTopTalkers();
  }

  getTopTalkers() {
    this._silk.topTalkers().subscribe(
      data => {
        this.topTalkers = data;
        Chart.defaults.global.defaultFontColor = 'white';
        let packets = this.topTalkers.map(res => res.packets)
        let hosts = this.topTalkers.map(res => res.source)
        if(this.topChart instanceof Chart) this.topChart.destroy()
        this.topChart = this.newTopChart(hosts, packets)
      },
      err => console.error(err),
      () => console.log('Processed talkers')
      );
    
  }

 newTopChart(hosts, packets) {
    return new Chart('TopCanvas', {
        type: 'pie',
        options: {
          animation : false,          
          legend: {
            display: false
          },
          title: {
            display: true,
            fontColor: 'rgba(255,255,255,1)',
            text: "Top Talkers"
          }
        },
        data: {
          labels: hosts,
          datasets: [
            {
              data: packets,
              borderWidth:0.5,
              backgroundColor: [
              'rgba(255,0,0,1)',
              'rgba(200,200,0,1)',
              'rgba(100,100,0,1)',
              'rgba(0,100,100,1)',
              'rgba(0,200,200,1)',
              'rgba(0,0,255,1)',
              'rgba(0,255,0,1)',
              'rgba(255,0,255,1)',
              'rgba(200,0,200,1)',
              'rgba(100,0,100,1)',
              ]
            }
          ]
        }
      })
  }

}