// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Component, OnInit } from '@angular/core';
import { SilkQueryService } from '../silk-query.service';
import { Observable } from 'rxjs';
import { Statistics } from '../models/Statistics';
import { Chart } from 'chart.js'

@Component({
  selector: 'statistics-charts',
  templateUrl: './statistics.component.html',
  styleUrls: [ './statistics.component.css']
})

export class StatisticsComponent implements OnInit {

  // For charts
  stats30Days = <any>[];
  stats30DayChart = <any>[];
  stats24Hours = <any>[];
  stats24HourChart = <any>[]
  stats60Minutes = <any>[];
  stats60MinutesChart = <any>[];

  constructor(private _silk: SilkQueryService) { }

  ngOnInit() {
    this.get30DayStats();
    this.get24HourStats();
    this.get60MinuteStats();
  }

  get24HourStats() {
    this._silk._24HourStats$.subscribe(
      data => {
        this.stats24Hours = JSON.parse(data)
        if(this.stats24HourChart instanceof Chart) this.stats24HourChart.destroy()
        this.stats24HourChart = this.newStatsChart(this.stats24Hours, "24HourStatsChart", "Bytes Over 24 Hours")
      },
      err => console.error(err),
      () => console.log("24 hour stats")
    )
    this._silk.Stats24Hours()

  }

  get30DayStats() {
    this._silk._30DayStats$.subscribe(
      data => {
        this.stats30Days = JSON.parse(data)
        if(this.stats30DayChart instanceof Chart) this.stats30DayChart.destroy()
        this.stats30DayChart = this.newStatsChart(this.stats30Days, "30DayStats", "Bytes Over 30 Days")
      },
      err => console.error(err),
      () => console.log("30 day stats")
      )
    this._silk.Stats30Days()
  }

  get60MinuteStats() {
    this._silk._60MinuteStats$.subscribe(
      data => {
        this.stats60Minutes = JSON.parse(data)
        if(this.stats60MinutesChart instanceof Chart) this.stats60MinutesChart.destroy()
        this.stats60MinutesChart = this.newStatsChart(this.stats60Minutes, "60MinuteStatsChart", "Bytes Over the Last Hour")
      },
      err => console.error(err),
      () => console.log("30 day stats")
      )
    this._silk.Stats60Minutes()

  }

 newStatsChart(stats, canvas, title) {
    return new Chart(canvas, {
        type: 'line',
        options: {
          animation : false,          
          legend: {
            display: false
          },
          elements: {
            point: {
              radius: 1
            },
            line: {
              tension: 0
            }
          },
          scales:
          {
            xAxes: [{
              display:false
            }],
            yAxes: [{
              type: 'logarithmic'
            }]
          },
          title: {
            display: true,
            fontColor: 'rgba(255,255,255,1)',
            text: title
          }
        },
        data: {
          labels: stats.map(i => i.time),
          datasets: [
            {
              data: stats.map(i => i.bytes),
              borderWidth:0.5,
              borderColor: 'rgba(255,255,255,1)',
              pointBackgroundColor: 'rgba(255,255,255,1)',
              backgroundColor: [
              'rgba(0,255,0,1)']
            }
          ]
        }
      })
  }
}