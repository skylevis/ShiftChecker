import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export interface ShiftElement {
  date: Date;
  onShift: boolean;
  shiftType: string;
}

const FORECAST_LENGTH = 7;
const CYCLE_OFFSET = 11;
enum SHIFT_TYPES {
  dayShift = "Day Shift",
  nightShift = "Night Shift",
  adminShift = "Admin Shift"
}

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.sass']
})

export class ResultViewComponent implements OnInit {

  minDate = new Date('11/01/2021 GMT+08:00');
  daysDifference = 0;
  onShift = false;
  shiftType: string = SHIFT_TYPES.dayShift
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
    this.onShift = this.calculateOnShift(this.daysDifference);
    this.shiftType = this.calculateShiftType(this.daysDifference);
    this.generateDataSource(selectedDate, this.daysDifference);
  }

  calculateDiff(date1: Date, date2: Date) {
    // Transform dates to SGT (+0800 GMT)
    let date1WithTz = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()) - date1.getTimezoneOffset() + 8 * 3600 * 1000;
    let date2WithTz = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - date2.getTimezoneOffset() + 8 * 3600 * 1000;
    return Math.floor((date2WithTz - date1WithTz) / (1000 * 60 * 60 * 24));
  }

  calculateOnShift(diff: number): boolean {
    let step = (diff + CYCLE_OFFSET) % 18 // cycle period of 18 with offset
    if (step <= 6) {
      // 1 Day on 1 Day off
      return (step % 2 == 0);
    }
    else {
      // 2 Day on 2 Day off
      return (step % 4 >= 2);
    }
  }

  calculateShiftType(diff: number): string {
    let step = (diff + CYCLE_OFFSET) % 18 // cycle period of 18 with offset
    if (step <= 6) {
      // 1 Day on 1 Day off, always Admin Shift
      return SHIFT_TYPES.adminShift
    }
    else {
      // 2 Day on 2 Day off, either Day (even) or Night (odd)
      if (step % 2 == 0) {
        return SHIFT_TYPES.dayShift
      }
      else {
        return SHIFT_TYPES.nightShift
      }
    }
  }

  generateDataSource(selectedDate: Date, daysDifference: number) {
    this.dataSource = [];
    [...Array(FORECAST_LENGTH).keys()].map(offset => {
      console.log(this.dataSource);
      let elementDate = new Date(selectedDate.getTime() + (1000 * 60 * 60 * 24 * offset));
      let elementOnShift = this.calculateOnShift(daysDifference + offset);
      let elementShiftType = this.calculateShiftType(daysDifference + offset);
      this.dataSource.push({ date: elementDate, onShift: elementOnShift, shiftType: elementShiftType });
    });
  }

  getShortFormShiftType(shiftType: SHIFT_TYPES): string {
    switch (shiftType) {
      case SHIFT_TYPES.dayShift:
        return "S1";
      case SHIFT_TYPES.nightShift:
        return "S2";
      case SHIFT_TYPES.adminShift:
        return "AM";
    }
  }

  ngOnInit(): void {
    this.generateDataSource(this.today, this.calculateDiff(this.minDate, this.today));
    this.onShift = this.dataSource[0].onShift ?? false;
    this.shiftType = this.dataSource[0].shiftType ?? SHIFT_TYPES.dayShift;
  }
}
