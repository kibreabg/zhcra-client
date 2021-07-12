import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Memo } from '../models/memo';
import { baseUrl } from '@core/config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MemoService {

  private memoUrl = baseUrl + '/api/memos';
  private uploadUrl = baseUrl + '/api/memos/upload';

  constructor(private http: HttpClient) { }

  addMemo(memo: Memo): Observable<Memo> {
    return this.http.post<Memo>(this.memoUrl, memo, httpOptions);
  }

  updateMemo(memo: Memo): Observable<Memo> {
    return this.http.put<Memo>(this.memoUrl + '/' + memo.id, memo, httpOptions);
  }

  getMemo(id: number): Observable<Memo> {
    return this.http.get<Memo>(this.memoUrl + '/' + id, httpOptions);
  }

  getMemos(): Observable<Memo[]> {
    return this.http.get<Memo[]>(this.memoUrl, httpOptions);
  }

  deleteMemo(id: number): Observable<any> {
    return this.http.delete<Memo>(this.memoUrl + '/' + id, httpOptions);
  }

  uploadContent(formData: FormData): Observable<any> {
    return this.http.post<FormData>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
