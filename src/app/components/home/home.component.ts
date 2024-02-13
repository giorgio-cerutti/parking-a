import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private navService: NavService
  ) {


  }
  ngOnInit(): void {
    this.navService.setTitle('Home')
  }
}
