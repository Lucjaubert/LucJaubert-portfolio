import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';

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
    return this.http.get<Project[]>(this.projectsUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des projets :', error);
        throw error;
      })
    );
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
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des médias :', error);
        throw error;
      })
    );
  }

  preloadMedia(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getAllMedia().subscribe(
        (mediaList) => {
          let loadedMedia = 0;
          const totalMedia = mediaList.length;

          if (totalMedia === 0) {
            console.warn('Aucun média à charger.');
            resolve();
            return;
          }

          mediaList.forEach((mediaSrc) => {
            const isVideo =
              mediaSrc.endsWith('.mp4') ||
              mediaSrc.endsWith('.webm') ||
              mediaSrc.endsWith('.ogg');

            if (isVideo) {
              const video = document.createElement('video');
              video.src = mediaSrc;
              video.preload = 'auto';

              video.onloadeddata = () => {
                loadedMedia++;
                this.checkMediaLoaded(loadedMedia, totalMedia, resolve);
              };

              video.onerror = () => {
                loadedMedia++;
                console.error(`Erreur lors du chargement de la vidéo : ${mediaSrc}`);
                this.checkMediaLoaded(loadedMedia, totalMedia, resolve);
              };

              video.load();
            } else {
              const img = new Image();
              img.src = mediaSrc;

              img.onload = () => {
                loadedMedia++;
                this.checkMediaLoaded(loadedMedia, totalMedia, resolve);
              };

              img.onerror = () => {
                loadedMedia++;
                console.error(`Erreur lors du chargement de l'image : ${mediaSrc}`);
                this.checkMediaLoaded(loadedMedia, totalMedia, resolve);
              };
            }
          });
        },
        (error) => {
          console.error('Erreur lors de la récupération de la liste des médias :', error);
          reject(error);
        }
      );
    });
  }

  private checkMediaLoaded(
    loadedMedia: number,
    totalMedia: number,
    resolve: () => void
  ): void {
    if (loadedMedia === totalMedia) {
      console.log('Tous les médias ont été chargés avec succès.');
      resolve();
    }
  }
}
