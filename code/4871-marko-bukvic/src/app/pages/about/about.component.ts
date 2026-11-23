import { Component } from '@angular/core';
import { STUDENT } from '../../student';

@Component({
  selector: 'app-about',
  template: `
    <h2>About</h2>
    <p><strong>Student:</strong> {{ student.name }}</p>
    <p><strong>ID:</strong> {{ student.id }}</p>
    <p><strong>Year:</strong> {{ currentYear }}</p>
    <p><strong>Repository:</strong> <a [href]="student.repositoryUrl" target="_blank">{{ student.repositoryUrl }}</a></p>
    <p>Movie management app for the Internet Programming exam, built with Angular 19
       (standalone components, signals, reactive forms) and json-server.</p>
  `,
})
export class AboutComponent {
  student = STUDENT;
  currentYear = new Date().getFullYear();
}