import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Geocoder, Map, MapPoint, Marker, PlaceService, Size} from '../google-types';
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
  private geocoder = new Geocoder();
  private usersCoordinates: Point;
  private placesService: PlaceService;
  private placesMarkers: Marker[] = [];

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
          this.usersCoordinates = new Point(position.coords.latitude, position.coords.longitude);
          new Marker({
            map: this.map,
            position: this.usersCoordinates,
            title: 'You are here',
            icon: {
              url: '../../assets/images/marker-blue-dot.png',
            }
          });
        });
      } else {
        alert('Geolocation is not allowed');
      }
      this.placesService = new PlaceService(this.map);
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

  public onPharmasyClicked(){
    this.getPlaces(['pharmacy'], 2000);
  }public onRestaurantClicked(){
    this.getPlaces(['restaurant'], 2000);
  }
  public onGasStationClicked(){
    this.getPlaces(['gas_station'], 2000);
  }
  public onSchoolsClicked(): void {
    this.getPlaces(['school'], 2000);
  }

  private getPlaces(places: string[], radius: number) {
    this.placesMarkers.forEach((marker: Marker) => marker.setMap(null));
    this.placesService.nearbySearch({
      location: this.usersCoordinates,
      radius: radius,
      types: places
    }, (res: any, status: any) => {
      console.log(res)
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        res.forEach((place) => {
          const location = place.geometry.location;
          const point = new Point(location.lat(), location.lng());
          this.placesMarkers.push(new Marker({
            map: this.map,
            position: point,
            title: place.name,
            icon: {
              url: place.icon,
              size: new Size(71, 71),
              origin: new MapPoint(0, 0),
              anchor: new MapPoint(17, 34),
              scaledSize: new Size(25, 25)
            }
          }));
        });
      } else {
        alert('there is no organisation in 2km from you')
      }
    });
  }
}
