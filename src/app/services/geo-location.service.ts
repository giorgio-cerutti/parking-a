import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoLocationService {

  constructor() { }

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
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
