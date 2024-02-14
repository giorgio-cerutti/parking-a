import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { MapComponent } from './components/map/map.component';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { MatButtonModule} from '@angular/material/button';
import { GoogleMapsModule } from '@angular/google-maps';
import { NavSideBarComponent } from './components/nav-side-bar/nav-side-bar.component';
import { GeoLocationService } from './services/geo-location.service';
import { ConfigService } from './services/config.service';
import { BlockUIModule } from 'ng-block-ui';
import { DownloadComponent } from './components/download/download.component';
import { RouterModule } from '@angular/router';
import { DialogComponent } from './components/shared/dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

const Material_Imports = [
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  GoogleMapsModule,
  BlockUIModule,
  MatDialogModule
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    NavSideBarComponent,
    DownloadComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    RouterModule,
    Material_Imports
  ],
  providers: [GeoLocationService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
