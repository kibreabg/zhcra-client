import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArtGuideline } from '../models/artguideline';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ArtGuidelineService {

  private artGuidelineUrl = 'http://zhcra.com:8788/api/artguidelines';  // URL to web api
  private uploadUrl = 'http://zhcra.com:8788/api/artguidelines/upload';  // URL to web api

  constructor(private http: HttpClient) { }

  addGuideline(artGuideline: ArtGuideline): Observable<ArtGuideline> {
    return this.http.post<ArtGuideline>(this.artGuidelineUrl, artGuideline, httpOptions);
  }

  updateArtGuideline(artGuideline: ArtGuideline): Observable<ArtGuideline> {
    return this.http.put<ArtGuideline>(this.artGuidelineUrl + '/' + artGuideline.id, artGuideline, httpOptions);
  }

  getArtGuideline(id: number): Observable<ArtGuideline> {
    return this.http.get<ArtGuideline>(this.artGuidelineUrl + '/' + id, httpOptions);
  }

  getArtGuidelines(): Observable<ArtGuideline[]> {
    return this.http.get<ArtGuideline[]>(this.artGuidelineUrl, httpOptions);
  }

  deleteArtGuideline(id: number): Observable<any> {
    return this.http.delete<ArtGuideline>(this.artGuidelineUrl + '/' + id, httpOptions);
  }

  uploadContent(formData: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
