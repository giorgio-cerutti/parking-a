import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable, map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-nav-side-bar',
  templateUrl: './nav-side-bar.component.html',
  styleUrls: ['./nav-side-bar.component.scss']
})
export class NavSideBarComponent {
  actions = [
    {
      path: 'home',
      icon: 'home',
      description: 'HomePage'
    }
  ]
  private breakpointObserver = inject(BreakpointObserver);
  @ViewChild('drawer')drawer!: MatSidenav;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );
}
