import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Map, MapEvent, MapPoint, Marker, PlaceResult, PlaceService, PlacesServiceStatus, Size} from '../google-types';
import {FirebaseService} from '../services/firebase.service';
import {Point} from '../classes';
import {ActivatedRoute, Router} from '@angular/router';
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
  private usersCoordinates: Point;
  private userLocationMarker: Marker;
  private placesService: PlaceService;
  private placesMarkers: Marker[] = [];
  private mapConfig = {
    center: {lat: 52, lng: 30},
    zoom: 5
  };

  constructor(private fireService: FirebaseService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  public ngAfterViewInit(): void {
    this.map = new Map(this.mapContainer.nativeElement, this.mapConfig);
    MapEvent.addListenerOnce(this.map, 'idle', this.showUsersGeoPositionMarker.bind(this));
    MapEvent.addListener(this.map, 'click', (event: any) => {
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
    if (this.newUserPoints.length === 0) {
      alert('There are no new points on the map to save.\nPlease, Click on the map to create a new point!');
    } else {
      this.fireService.savePointsOnServer(this.newUserPoints);
      this.newUserPoints = [];
      alert('All new points are saved!');
    }
  }

  private showUsersGeoPositionMarker(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        this.usersCoordinates = new Point(position.coords.latitude, position.coords.longitude);
        this.userLocationMarker = new Marker({
          map: this.map,
          position: this.usersCoordinates,
          title: 'You are here',
          icon: {
            url: '../../assets/images/marker-blue-dot.png',
          }
        });
        this.map.setCenter(this.usersCoordinates);
        this.map.setZoom(12);
      });
    } else {
      alert('Geolocation is not allowed');
    }
    this.placesService = new PlaceService(this.map);
  }

  public loadPoints(): void {
    this.oldUserPoints = [];
    this.fireService.loadPointsFromServer()
      .once('value', (data: DataSnapshot) => {
        if (data.exists()) {
          this.oldUserPoints = Object.values(data.val());
          this.oldUserPoints.forEach((point: Point) => {
            this.setMarker(point);
          });
        } else {
          alert('Nothing to show!');
        }

      }).catch((err: any) => alert(`Cannot load point while ${err}`));
  }

  public onPharmacyClicked(): void {
    this.getPlaces('pharmacy', 2000);
  }

  public onRestaurantClicked(): void {
    this.getPlaces('restaurant', 2000);
  }

  public onGasStationClicked(): void {
    this.getPlaces('gas_station', 2000);
  }

  public onSchoolsClicked(): void {
    this.getPlaces('school', 2000);
  }

  private getPlaces(places: string, radius: number): void {
    this.placesMarkers.forEach((marker: Marker) => marker.setMap(null));
    this.placesService.nearbySearch({
      location: this.usersCoordinates,
      radius: radius,
      type: places
    }, (results: PlaceResult[], status: PlacesServiceStatus) => {
      if (status === PlacesServiceStatus.OK) {
        if (results.length > 0) {
          results.forEach((place: PlaceResult) => {
            const location = place.geometry.location;
            const point = new Point(location.lat(), location.lng());
            const iconConfig = {
              url: place.icon,
              size: new Size(71, 71),
              origin: new MapPoint(0, 0),
              anchor: new MapPoint(17, 34),
              scaledSize: new Size(25, 25)
            };
            this.placesMarkers.push(new Marker({
              map: this.map,
              position: point,
              title: place.name,
              icon: iconConfig
            }));
          });
        } else {
          alert(`There is no such organisations in ${radius} m from you`);
        }
      } else {
        alert('Something went wrong! Please, try again later!');
      }
    });
  }

  public navigateToAboutAuthor(): void {
    this.router.navigate(['map/about-author']);
  }

  public logout(): void {
    this.fireService.logout();
    this.router.navigate(['../', {relativeTo: this.route}]);
  }
}
