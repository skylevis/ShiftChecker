import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface ShiftElement {
  date: Date;
  onShift: boolean;
}

const forecastLength = 7;

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.sass']
})

export class ResultViewComponent implements OnInit {

  minDate = new Date('11/01/2021 GMT+08:00');
  daysDifference = 0;
  onShift = false;
  today = new Date();
  displayedColumns: string[] = ['Date', 'Day', 'On Shift?'];
  dataSource: ShiftElement[] = [];

  checkShift(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value == null) {
      return;
    }
    const selectedDate = event.value!;
    if (selectedDate < this.minDate) {
      return;
    }
    this.daysDifference = this.calculateDiff(this.minDate, selectedDate);
    this.onShift = this.calculateOnShift(this.daysDifference)
    this.generateDataSource(selectedDate, this.daysDifference);
  }

  calculateDiff(date1: Date, date2: Date) {
    return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) / (1000 * 60 * 60 * 24));
  }

  calculateOnShift(diff: number): boolean {
    let step = (diff + 11) % 18 // cycle period of 18 with offset 11
    if (step <= 6) {
      // 1 Day on 1 Day off
      return (step % 2 == 0);
    }
    else {
      // 2 Day on 2 Day off
      return (step % 4 >= 2);
    }
  }

  generateDataSource(selectedDate: Date, daysDifference: number) {
    this.dataSource = [];
    [...Array(forecastLength).keys()].map( offset => {
      console.log(this.dataSource);
      let elementDate = new Date(selectedDate.getTime() + (1000 * 60 * 60 * 24 * offset));
      let elementOnShift = this.calculateOnShift(daysDifference + offset);
      this.dataSource.push({date: elementDate, onShift: elementOnShift});
    });
  }

  ngOnInit(): void {
    this.generateDataSource(this.today, this.calculateDiff(this.minDate, this.today));
    this.onShift = this.dataSource[0].onShift ?? false;
  }
}
