import { AfterContentChecked, AfterContentInit, AfterViewInit, Component, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker, MapDirectionsRenderer, MapDirectionsService } from '@angular/google-maps';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/services/config.service';
import { GeoLocationService } from 'src/app/services/geo-location.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map?: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow?: MapInfoWindow

  display: any;
  center: google.maps.LatLngLiteral = {
      lat: 45.464098,
      lng: 9.191926
  };
  realCenter: google.maps.LatLngLiteral = {
    lat: 45.464098,
    lng: 9.191926
};
  zoom = 16;
  selectedMarker: any;
  markers: any[] = [];
  location!: google.maps.Marker;
  infoContent = '';
  public directionsResults$?: Observable<google.maps.DirectionsResult|undefined>;
  directionsResults: google.maps.DirectionsResult|undefined
  directionsRequest: google.maps.DirectionsRequest|undefined

  directionsRenderOption: google.maps.DirectionsRendererOptions = {
    polylineOptions: {
      strokeColor: 'rgb(0, 128, 255)', // colore delle indicazioni
      icons:[  
        {
          icon: {
            path: google.maps.SymbolPath.CIRCLE, //icona a cerchio          
          },
          offset: "10px", // La distanza dall'inizio della linea da cui deve essere visualizzata un'icona 
          repeat: "10px" // Ogni quanto l'icon deve essere ripetuta
        }
      ]
    },
    suppressMarkers: true,
    markerOptions: {

        title: '',
        zIndex: 10,
        animation: google.maps.Animation.DROP,
    }
    
  };

  constructor(
    private mapDirectionsService: MapDirectionsService,
    private locationService: GeoLocationService,
    private configService: ConfigService
  ) {  

    this.configService.loadData().then(res => {
      this.markers = res;
    
      this.locationService.watchPosition().subscribe(res => {
        console.log("watch POSITION --> ", res)
        this.center.lat = res.coords.latitude;
        this.center.lng = res.coords.longitude;
        this.location = new google.maps.Marker({
          position: this.center,
          title: 'location',
          draggable: false, 
          clickable: false,
          optimized: true,
          zIndex: 11
        })
        this.deleteMarker(this.location);
        this.markers = this.markers.filter(a => a.title !== 'location')
        this.markers.push(this.location);
        this.configService.saveData(this.markers)
        //write Data

      });
    });
    
  }

  ngAfterViewInit(): void {
    const centerControlDiv = this.createCenterControl();
    this.map?.controls[google.maps.ControlPosition.RIGHT_CENTER].push(centerControlDiv);
  }

  clickMap(event: google.maps.MapMouseEvent) {
    console.log("evento Move Map -> ", event)
    console.log("latitudine ->", event.latLng?.lat())
    console.log("longitudine -> ", event.latLng?.lng())
    this.addMarker(event.latLng?.lat(), event.latLng?.lng())
      // if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.display = event.latLng.toJSON();
  }

  addMarker(lat: number | undefined, lng: number | undefined) {
    if (lat !== undefined && lng !== undefined) {
      let marker = new google.maps.Marker({
        position: {
          lat: lat,
          lng: lng,
        },
        label: {
          color: 'black',
          text: 'Parcheggio' + (this.markers.length + 1),
        },
        title: 'Parking ' + (this.markers.length + 1),
        
        animation: google.maps.Animation.DROP,
        
      })
      this.markers.push(marker);
      this.configService.saveData(this.markers)
      //write Data
    }
  }

  openInfo(marker: MapMarker, content: any) {
    marker.getTitle()?.toString() !== 'location'?
    (this.infoWindow?.open(marker),
    this.selectedMarker = marker): console.log();
  }

  deleteMarker(marker: MapMarker | any, from?: string) {
    let title = this.selectedMarker?.getTitle()?.toString()
    console.log("Marker Remover -> ", title);
    if (title === 'location') {
      
    } else {
      if (![null, undefined].includes(title)) {
        let dlt = this.markers.indexOf(this.markers.find(a => a.title === title));
        if (dlt !== -1) {
          let location: google.maps.DirectionsRequest | any = this.directionsResults;
          console.log("directions request -> ", this.directionsRequest?.destination);
          console.log("marker position", this.selectedMarker!.getPosition()?.toJSON())
          
          if (this.directionsResults !== undefined) {
            if ((this.directionsRequest?.destination as any)!['lat'] === this.selectedMarker!.getPosition()?.toJSON()!.lat &&
                (this.directionsRequest?.destination as any)!['lng'] === this.selectedMarker!.getPosition()?.toJSON()!.lng) {
              this.exitNavigation();
            }
          }
          this.markers.splice(dlt, 1);
          this.configService.saveData(this.markers)
          //write Data
        }
          console.log("Indice = -1");
      }
      
    }
  }

  giveDirections(mark: any) {
    // console.log("this. markers  -> ", mark)
    let lat = this.selectedMarker!.getPosition()?.toJSON().lat as number;
    let lng = this.selectedMarker!.getPosition()?.toJSON().lng as number;
    let originLat = this.location.getPosition()!.lat()
    let originLng = this.location.getPosition()!.lng()
    this.directionsRequest = {
      destination: {lat: lat, lng: lng},
      origin: {lat: originLat, lng: originLng},
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true
    };
    this.directionsResults$ = this.mapDirectionsService.route(this.directionsRequest).pipe(map(response => response.result));
    this.directionsResults$.subscribe(res => {
      this.directionsResults = res;
      this.createNavigationControl();
      const directionsControlDiv = this.createNavigationControl();
      this.map?.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(directionsControlDiv);
    })
  }

  createCenterControl() {
    const controlButton = document.createElement('button');

    // Set CSS for the control.
    controlButton.style.backgroundColor = '#fff';
    controlButton.style.border = '2px solid #fff';
    controlButton.style.borderRadius = '3px';
    controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlButton.style.color = '#434dff';
    controlButton.style.cursor = 'pointer';
    controlButton.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlButton.style.fontSize = '16px';
    controlButton.style.lineHeight = 'auto';
    controlButton.style.margin = '0 8px 0';
    controlButton.style.padding = '5px';
    controlButton.style.textAlign = 'center';

    // controlButton.textContent = 
    controlButton.innerHTML = '<i id="icon" class="material-icons">my_location</i>';
    controlButton.title = 'Click to recenter the map';
    controlButton.type = 'button';

    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener('click', () => this.setCenter());

    return controlButton;
  }

  setCenter(): void {
    let c = this.center
    this.realCenter = c;
    this.map?.googleMap?.setCenter(this.realCenter)
    this.zoom = 17;
    console.log("real Center -> ", this.realCenter);
    console.log("this center -> ", this.center);
  }

  createNavigationControl() {
    const controlButton = document.createElement('button');

    // Set CSS for the control.
    controlButton.style.backgroundColor = '#fff';
    controlButton.style.border = '2px solid #fff';
    controlButton.style.borderRadius = '3px';
    controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlButton.style.color = '#DC143C';
    controlButton.style.cursor = 'pointer';
    controlButton.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlButton.style.fontSize = '16px';
    controlButton.style.lineHeight = 'auto';
    controlButton.style.marginLeft = '10px';
    controlButton.style.marginBottom = '10px';
    controlButton.style.padding = '5px';
    controlButton.style.textAlign = 'center';

    // controlButton.textContent = 
    controlButton.innerHTML = 'Esci dalla Navigazione';
    controlButton.title = 'Click to exit navigation';
    controlButton.type = 'button';

    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener('click', () => this.exitNavigation());

    return controlButton;
  }

  exitNavigation() {
    this.map?.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
    this.directionsResults = undefined;
    this.setCenter();
  }

  openGoogleMaps(marker: MapMarker | any) {
    
    let lat = this.selectedMarker!.getPosition()?.toJSON().lat as number;
    let lng = this.selectedMarker!.getPosition()?.toJSON().lng as number;

    let url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

    window.open(url, "_blank");
  }
}
