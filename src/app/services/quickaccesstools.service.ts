import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuickAccessTool } from './../models/quickaccesstools';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QuickaccesstoolsService {

  private quickAccessToolUrl = 'http://localhost:5000/api/quickaccesstools';  // URL to web api
  private uploadUrl = 'http://localhost:5000/api/quickaccesstools/upload';  // URL to web api

  constructor(private http: HttpClient) { }

  addQuickAccessTool(quickaccesstool: QuickAccessTool): Observable<QuickAccessTool> {
    return this.http.post<QuickAccessTool>(this.quickAccessToolUrl, quickaccesstool, httpOptions);
  }

  updateQuickAccessTool(quickaccesstool: QuickAccessTool): Observable<QuickAccessTool> {
    return this.http.put<QuickAccessTool>(this.quickAccessToolUrl + '/' + quickaccesstool.id, quickaccesstool, httpOptions);
  }

  getQuickAccessTool(id: number): Observable<QuickAccessTool> {
    return this.http.get<QuickAccessTool>(this.quickAccessToolUrl + '/' + id, httpOptions);
  }

  getQuickAccessTools(): Observable<QuickAccessTool[]> {
    return this.http.get<QuickAccessTool[]>(this.quickAccessToolUrl, httpOptions);
  }

  deleteQuickAccessTool(id: number): Observable<any> {
    return this.http.delete<QuickAccessTool>(this.quickAccessToolUrl + '/' + id, httpOptions);
  }

  uploadContent(formData: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
