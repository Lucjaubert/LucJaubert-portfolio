import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Project {
  name: string;
  year: string;
  project: string;
  role: string;
  stacks: string;
  url: string;
  images: string[];
  videos: string[];
  animationType: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projectsUrl = 'assets/data/projects.json';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectsUrl);
  }

  getAllMedia(): Observable<string[]> {
    return this.getProjects().pipe(
      map((projects) => {
        const media: string[] = [];
        projects.forEach((project) => {
          media.push(...project.images, ...project.videos);
        });
        console.log('Total media to load:', media.length);
        return media;
      })
    );
  }
}
