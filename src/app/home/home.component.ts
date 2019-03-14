// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Component, OnInit } from '@angular/core';
import { SilkQueryService } from '../silk-query.service';
import { Observable } from 'rxjs';
import { LargeTransfer } from '../models/largeTransfer';
import { TopConnection } from '../models/topConnections';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  // For charts
  largestTransfers = <any>[];
  topTransfersChart = <any>[];
  topTCPConnections = <any>[];
  topTCPConnectionsChart = <any>[];

  // For searches
  matchingRows: number = 0;
  headings = []
  results = <any>[];
  saddress: string = "x.x.x.x";
  daddress: string = "x.x.x.x";
  sport: string = "0-65535";
  dport: string = "0-65535";
  startDate: string = "Today";
  endDate: string = "Today";
  proto: string="0-255";
  flags: string="SFRPAUCE/SFRPAUCE"
  flagsInitial: string="SFRPAUCE/SFRPAUCE"
  sensors: string="all"
  trafficTypes: string="all"

  

  constructor(private _silk: SilkQueryService) { }

  ngOnInit() {
    this.getLargestTransfers();
    this.getTopTCPConnections();
    this._silk.searchResults$.subscribe(results => {
      this.results = results.split("\n").slice(1)
      this.headings = results.split("\n")[0].split(",")
      this.matchingRows = this.results.length
    })
  }

  doSearch() {
    this._silk.runQuery({
      saddress: this.saddress,
      daddress: this.daddress,
      sport: this.sport,
      dport: this.dport,
      startDate: this.startDate,
      endDate: this.endDate ,
      proto: this.proto,
      flags: this.flags,
      flagsInitial: this.flagsInitial,
      sensors: this.sensors,
      trafficTypes: this.trafficTypes
    })
  }  

  getTopTCPConnections() {
    this._silk.topTCPConnections$.subscribe(
      data => {
        this.topTCPConnections = JSON.parse(data);
        Chart.defaults.global.defaultFontColor = 'white';
        let connections = this.topTCPConnections.map(res => res.connections);
        let hosts = this.topTCPConnections.map(res => res.source);
        if(this.topTCPConnectionsChart instanceof Chart) this.topTCPConnectionsChart.destroy();
        this.topTCPConnectionsChart = this.newTopTCPConnectionsChart(hosts,connections);
      },
      err => console.error(err),
      () => console.log("TCP Connections"))
    this._silk.topTCPConnections()
  }
 
  getLargestTransfers() {
  	this._silk.largestTransfers$.subscribe(
  		data => {
  			this.largestTransfers = JSON.parse(data)
        Chart.defaults.global.defaultFontColor = 'white';
        let bytes = this.largestTransfers.map(res => res.bytes)
        let hosts = this.largestTransfers.map(res => res.source+":"+res.sport+" -> "+res.dest+":"+res.dport)
        if(this.topTransfersChart instanceof Chart) this.topTransfersChart.destroy()
        this.topTransfersChart = this.newTopTransfersChart(hosts, bytes)
  		},
  		err => console.error(err),
  		() => console.log("transfers"))
    this._silk.largestTransfers()
  }

//
// Charting Functions
//

  newTopTCPConnectionsChart(hosts, connections)
   {
      return new Chart('TopConnectionsCanvas', {
        type: 'pie',
        options: {
          animation : false,
          legend: {
            display: false
          },
          title: {
            display: true,
            fontColor: 'rgba(255,255,255,1)',
            text: "Top TCP Connection Sources"
          }
        },
        data: {
          labels: hosts,
          datasets: [
            {
              data: connections,
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

  newTopTransfersChart(hosts, bytes)
  {
    return new Chart('TransferCanvas', {
        type: 'pie',
        options: {
          animation : false,
          legend: {
            display: false
          },
            title: {
            display: true,
            fontColor: 'rgba(255,255,255,1)',
            text: "Largest Transfers"
          }
        },
        data: {
          labels: hosts,
          datasets: [
            {
              data: bytes,
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
