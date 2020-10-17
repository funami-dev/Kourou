import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  $sections;
  activeLink;
  constructor(route: ActivatedRoute) {
    this.activeLink = route.snapshot.url.join('');
    route.data.pipe().subscribe(x => {
      // TODO ohne data fallback path
      this.$sections =  x.sections.filter(el => el.path !== '');
      this.activeLink =  x.sections.find(el => el.path === '').redirectTo;
    });
  }
  ngOnInit(): void {
    console.log(this.activeLink);
    console.log(this.$sections, this.activeLink);
  }
}
