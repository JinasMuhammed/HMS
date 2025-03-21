import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexYAxis,
  ApexStroke,
  ApexLegend,
  ApexMarkers,
  ApexGrid,
  ApexFill,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatButtonModule } from '@angular/material/button';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { MatCardModule } from '@angular/material/card';
import { NgScrollbar } from 'ngx-scrollbar';
import { TableCardComponent } from '@shared/components/table-card/table-card.component';

export type avgLecChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

export type pieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  labels: string[];
};

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        BreadcrumbComponent,
        NgApexchartsModule,
        MatButtonModule,
        MatCardModule,
        NgScrollbar,
        TableCardComponent,
    ]
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public avgLecChartOptions!: Partial<avgLecChartOptions>;
  public pieChartOptions!: Partial<pieChartOptions>;

  breadscrums = [
    {
      title: 'Dashboard',
      items: ['User'],
      active: 'Dashboard',
    },
  ];

  constructor() {
    //constructor
  }
  ngOnInit() {
    this.chart1();
    this.chart2();
  }
  private chart1() {
    this.avgLecChartOptions = {
      series: [
        {
          name: 'Avg. Appoinments',
          data: [65, 72, 62, 73, 66, 74, 63, 67],
        },
      ],
      chart: {
        height: 310,
        type: 'line',
        foreColor: '#9aa0ac',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'July', 'Aug'],
        title: {
          text: 'Weekday',
        },
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      yaxis: {},
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
        },
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart2() {
    this.pieChartOptions = {
      series: [44, 55, 13, 43, 22],
      chart: {
        type: 'donut',
        width: 200,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      labels: ['Science', 'Mathes', 'Economics', 'History', 'Music'],
      responsive: [
        {
          breakpoint: 480,
          options: {},
        },
      ],
    };
  }

  //Today's Lecture data
  lectureColumnDefinitions = [
    { def: 'department', label: 'Department', type: 'text' },
    { def: 'Doctors', label: 'Doctors', type: 'text' },
    { def: 'details', label: 'Details', type: 'file' },
    { def: 'actions', label: 'Actions', type: 'actionBtn' },
  ];

  lectureData = [
    {
      index: 1,
      department: 'ENT department',
      Doctors: '16',
      details: 'file url',
    },
    {
      index: 2,
      department: 'Cancer Department',
      Doctors: '11',
      time: '11:15 AM',
      duration: '30 Min',
      details: 'file url',
    },
    {
      index: 3,
      department: 'Orthopedics',
      Doctors: '12',
      time: '12:00 AM',
      duration: '35 Min',
      details: 'file url',
    },
    {
      index: 4,
      department: 'Opthalmology',
      Doctors: '15',
      time: '12:45 AM',
      duration: '30 Min',
      details: 'file url',
    },
    {
      index: 5,
      department: 'Neurology',
      Doctors: '20',
      time: '02:00 AM',
      duration: '45 Min',
      details: 'file url',
    },

  ];
}
