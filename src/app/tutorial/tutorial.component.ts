import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.sass']
})
export class TutorialComponent implements OnInit {

  title = "Shift Checker"

  constructor() { }

  ngOnInit(): void {
  }

}
