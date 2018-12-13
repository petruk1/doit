import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Map, Marker} from '../google-types';
import {FirebaseService} from '../services/firebase.service';
import {Point} from '../classes';
import DataSnapshot = firebase.database.DataSnapshot;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer')
  private mapContainer: ElementRef;
  private map: Map;
  private oldUserPoints: Point[] = [];
  private newUserPoints: Point[] = [];
  private markersFromUserPoints: Marker[] = [];

  constructor(private fireService: FirebaseService) {
  }

  public ngAfterViewInit(): void {
    this.map = new Map(this.mapContainer.nativeElement, {
      center: {lat: 52, lng: 30},
      zoom: 5
    });
    this.map.addListener('tilesloaded', () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          new Marker({
            map: this.map,
            position: new Point(position.coords.latitude, position.coords.longitude),
            title: 'You are here',
            icon: {
              url: '../../assets/images/marker-blue-dot.png',
            }
          });
        });
      } else {
        alert('Geolocation is not allowed');
      }
    });
    this.map.addListener('click', (event: any) => {
      const point = new Point(event.latLng.lat(), event.latLng.lng());
      this.newUserPoints.push(point);
      this.setMarker(point);
    });
  }

  private setMarker(point: Point): void {
    this.markersFromUserPoints.push(new Marker({
      map: this.map,
      position: point
    }));
  }

  public savePoints(): void {
    this.fireService.savePointsOnServer(this.newUserPoints);
    this.newUserPoints = [];
  }

  public loadPoints(): void {
    this.oldUserPoints = [];
    this.fireService.loadPointsFromServer().then((data: DataSnapshot) => {
      this.oldUserPoints = Object.values(data.val());
      this.oldUserPoints.forEach((point: Point) => {
        this.setMarker(point);
      });
    });
  }

}

/*  геолокация НЕдоступна
this.map = DG.map('map', {
  center: [54.98, 82.89],
  zoom: 13
});
console.log(this.map);
this.map.on('click', (e) => {
  DG.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
});
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition((position) => {
    DG.marker([position.coords.latitude, position.coords.longitude]).addTo(this.map);
    this.map.panTo([position.coords.latitude, position.coords.longitude]);
  });
}
console.log(this.map)
this.map.geocoder.get('заправка', {
  types: ['city', 'settlement', 'district'],
  limit: 10,
  // Обработка успешного поиска
  success: function (geocoderObjects) {
    console.log(geocoderObjects);
  }
});*/
