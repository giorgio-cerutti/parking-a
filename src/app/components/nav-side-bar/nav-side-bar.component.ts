import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Observable, map, shareReplay } from 'rxjs';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-nav-side-bar',
  templateUrl: './nav-side-bar.component.html',
  styleUrls: ['./nav-side-bar.component.scss']
})
export class NavSideBarComponent implements OnInit {
  actions = [
    {
      path: '/home',
      icon: 'home',
      description: 'HomePage'
    },
    {
      path: '/download',
      icon: 'download',
      description: 'Download'
    },
  ]

  title?: string;
  private breakpointObserver = inject(BreakpointObserver);

  constructor(
    private navService: NavService,
    private router: Router
  ) {

  }
  @ViewChild('drawer')drawer!: MatSidenav;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  ngOnInit() {
    this.setTitle();
  }
  
  setTitle() {
    this.title = this.navService.getTitle()
  }

  navigate(action: string) {
    console.log("action -> ", action)
    this.router.navigate([action])
  }
}
