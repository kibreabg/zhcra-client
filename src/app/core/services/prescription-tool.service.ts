import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PrescriptionTool } from '../models/prescriptiontool';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PrescriptionToolService {

  private prescriptionToolUrl = 'http://localhost:5000/api/prescriptiontools';  // URL to web api
  private uploadUrl = 'http://localhost:5000/api/prescriptiontools/upload';  // URL to web api

  constructor(private http: HttpClient) { }

  addPrescriptionTool(prescriptionTool: PrescriptionTool): Observable<PrescriptionTool> {
    return this.http.post<PrescriptionTool>(this.prescriptionToolUrl, prescriptionTool, httpOptions);
  }

  updatePrescriptionTool(prescriptionTool: PrescriptionTool): Observable<PrescriptionTool> {
    return this.http.put<PrescriptionTool>(this.prescriptionToolUrl + '/' + prescriptionTool.id, prescriptionTool, httpOptions);
  }

  getPrescriptionTool(id: number): Observable<PrescriptionTool> {
    return this.http.get<PrescriptionTool>(this.prescriptionToolUrl + '/' + id, httpOptions);
  }

  getPrescriptionTools(): Observable<PrescriptionTool[]> {
    return this.http.get<PrescriptionTool[]>(this.prescriptionToolUrl, httpOptions);
  }

  getChildrenPrescTools(parentId: number): Observable<PrescriptionTool[]> {
        return this.http.get<PrescriptionTool[]>(this.prescriptionToolUrl + '/children/' + parentId, httpOptions);
  }

  deletePrescriptionTool(id: number): Observable<any> {
    return this.http.delete<PrescriptionTool>(this.prescriptionToolUrl + '/' + id, httpOptions);
  }
}
