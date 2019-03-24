// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Component, OnInit } from '@angular/core';
import { SilkQueryService } from '../silk-query.service';
import { Observable } from 'rxjs';
import { TopPorts } from '../models/topPorts';
import { Chart } from 'chart.js'

@Component({
  selector: 'top-tcp-ports-chart',
  templateUrl: './topTCPPorts.component.html',
  styleUrls: [ './topTCPPorts.component.css']
})

export class TopTCPPortsComponent implements OnInit {

  // For charts
  topPorts = <any>[];
  topPortsChart = <any>[];

  constructor(private _silk: SilkQueryService) { }

  ngOnInit() {
    this.getTopPorts();
  }

  getTopPorts() {
    this._silk.topTCPPorts$.subscribe(
      data => {
        this.topPorts = JSON.parse(data)
        if(this.topPortsChart instanceof Chart) this.topPortsChart.destroy()
        this.topPortsChart = this.newStatsChart(this.topPorts, "topTCPPorts", "Top TCP Destination Ports")
      
      },
      err => console.error(err),
      () => console.log("Top TCP Ports")
    )
    this._silk.TopTCPPorts()

  }

 newStatsChart(ports, canvas, title) {
    return new Chart(canvas, {
        type: 'horizontalBar',
        options: {
          animation : false,         
          legend: {
            display: false
          },
          elements: {
            point: {
              radius: 1
            }
          },
          scales:
          {
            xAxes: [{
              type: 'logarithmic',
              display:false
            }],
          },
          title: {
            display: true,
            fontColor: 'rgba(255,255,255,1)',
            text: title
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                  var value = data.datasets[0].data[tooltipItem.index];
                  if(parseInt(value) >= 1000){
                             return  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                          } else {
                             return  value;
                          }
              }
            }
          },
        },
        data: {
          labels: ports.map(i => i.port),
          datasets: [
            {
              data: ports.map(i => i.packets),
              borderWidth:0.5,
              borderColor: 'rgba(255,255,255,1)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
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