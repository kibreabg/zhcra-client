import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guideline } from '../models/guideline';
import { GuidelineType } from '../models/guidelinetype';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class GuidelineService {

  private guidelineUrl = environment.baseUrl + '/api/guidelines';
  private guidelineTypeUrl = environment.baseUrl + '/api/guidelinetypes';
  private uploadUrl = environment.baseUrl + '/api/guidelines/upload';

  constructor(private http: HttpClient) { }

  addGuideline(guideline: Guideline): Observable<Guideline> {
    return this.http.post<Guideline>(this.guidelineUrl, guideline, httpOptions);
  }

  updateGuideline(guideline: Guideline): Observable<Guideline> {
    return this.http.put<Guideline>(this.guidelineUrl + '/' + guideline.id, guideline, httpOptions);
  }

  getGuideline(id: number): Observable<Guideline> {
    return this.http.get<Guideline>(this.guidelineUrl + '/' + id, httpOptions);
  }

  getGuidelines(): Observable<Guideline[]> {
    return this.http.get<Guideline[]>(this.guidelineUrl, httpOptions);
  }

  deleteGuideline(id: number): Observable<any> {
    return this.http.delete<Guideline>(this.guidelineUrl + '/' + id, httpOptions);
  }

  uploadContent(formData: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadUrl, formData, {});
  }

  getGuidelineType(id: number): Observable<GuidelineType> {
    return this.http.get<GuidelineType>(this.guidelineTypeUrl + '/' + id, httpOptions);
  }

  getGuidelineTypes(): Observable<GuidelineType[]> {
    return this.http.get<GuidelineType[]>(this.guidelineTypeUrl, httpOptions);
  }
}
