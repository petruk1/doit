import {Component} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-about-author',
  templateUrl: './about-author.component.html',
  styleUrls: ['./about-author.component.scss']
})
export class AboutAuthorComponent {

  constructor(private router: Router) {
  }

  public close():void {
    this.router.navigate(['../']);
  }
}
