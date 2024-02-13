import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  constructor() { }

  getPosition(): Observable<any>
  {
    return Observable.create(
      (observer: any) => {

        return navigator.geolocation.getCurrentPosition(resp => {
          observer.next({lng: resp.coords.longitude, lat: resp.coords.latitude})

        }),
      () => {
          console.log('Position is not available');
      },
      {
        enableHighAccuracy: true
      };
    });


  }

  watchPosition(): Observable<any>
  {
    return Observable.create(
      (observer: any) => {

      navigator.geolocation.watchPosition((pos: any) => {
        observer.next(pos);
      }, () => '', {enableHighAccuracy: true, maximumAge: 0 }),
      () => {
          console.log('Position is not available');
      },
      {
        enableHighAccuracy: true
      };
    });

  }
}
