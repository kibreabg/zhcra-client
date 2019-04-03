import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GuidelineType } from '../models/guidelinetype';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GuidelineTypeService {

  private guidelineTypeUrl = 'http://zhcra.com:8788/api/guidelinetypes';  // URL to web api
  private uploadUrl = 'http://zhcra.com:8788/api/guidelinetypes/upload';  // URL to web api

  constructor(private http: HttpClient) { }

  addGuidelineType(guidelineType: GuidelineType): Observable<GuidelineType> {
    return this.http.post<GuidelineType>(this.guidelineTypeUrl, guidelineType, httpOptions);
  }

  updateGuidelineType(guidelineType: GuidelineType): Observable<GuidelineType> {
    return this.http.put<GuidelineType>(this.guidelineTypeUrl + '/' + guidelineType.id, guidelineType, httpOptions);
  }

  getGuidelineType(id: number): Observable<GuidelineType> {
    return this.http.get<GuidelineType>(this.guidelineTypeUrl + '/' + id, httpOptions);
  }

  getGuidelineTypes(): Observable<GuidelineType[]> {
    return this.http.get<GuidelineType[]>(this.guidelineTypeUrl, httpOptions);
  }

  deleteGuidelineType(id: number): Observable<any> {
    return this.http.delete<GuidelineType>(this.guidelineTypeUrl + '/' + id, httpOptions);
  }

  uploadIcon(formData: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
