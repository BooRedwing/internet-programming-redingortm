import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STUDENT } from '../../student';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  student = STUDENT;
}