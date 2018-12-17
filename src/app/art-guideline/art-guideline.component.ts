import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { ArtGuideline } from '../models/artGuideline';
import { ArtGuidelineService } from '../services/art-guideline.service';

declare var $;

@Component({
  selector: 'app-art-guideline',
  templateUrl: './art-guideline.component.html',
  styleUrls: ['./art-guideline.component.css']
})
export class ArtGuidelineComponent implements OnInit {

  artGuideline = new ArtGuideline();
  artGuidelines: ArtGuideline[];
  dataTable: any;
  selectedFile: File = null;
  uploadProgressPerc = '';
  token = '';
  message = '';
  thisClass: any;
  messageHidden: boolean;

  constructor(private artGuidelineService: ArtGuidelineService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.messageHidden = true;
    const thisClass = this;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.dataTable = $('#artGuideDataTable');
    this.dataTable.DataTable({
      ajax: {
        headers: {
          'Authorization': this.token
        },
        method: 'GET',
        url: 'http://zhcra.com:8788/api/artguidelines',
        dataSrc: ''
      },
      columns: [
        { data: 'id' },
        { data: 'title' },
        { data: 'content' },
        { data: 'order' }
      ],
      columnDefs: [
        {
            targets: [ 0 ],
            visible: false
        }
    ]
    });

    $(document).ready(function() {
      $('#artGuideDataTable tbody').on('click', 'tr', function () {
        if ( $(this).hasClass('info') ) {
          $(this).removeClass('info');
        } else {
          $('#artGuideDataTable').DataTable().$('tr.info').removeClass('info');
            $(this).addClass('info');
        }
        const data = $('#artGuideDataTable').DataTable().row(this).data();
        if (typeof data !== 'undefined') {
          thisClass.getArtGuideline(data.id);
        }
      });
    });
  }

  addGuideline(): void {
    if (this.artGuideline.id > 0) {
      this.updateArtGuideline();
    } else {
      this.artGuidelineService.addGuideline(this.artGuideline).subscribe();
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Added new ART Guideline';
    }
  }

  updateArtGuideline() {
    this.artGuidelineService.updateArtGuideline(this.artGuideline).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Updated the ART Guideline';
  }

  getArtGuideline(id: number) {
    return this.artGuidelineService.getArtGuideline(id)
      .subscribe(
        artGuideline => { this.artGuideline = artGuideline; },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.router.navigate(['/login']);
            }
          }
      });
  }

  getGuidelines() {
    return this.artGuidelineService.getArtGuidelines()
      .subscribe(
        artGuidelines => { this.artGuidelines = artGuidelines; },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.router.navigate(['/login']);
            }
          }
      });
  }

  deleteArtGuideline() {
    this.artGuidelineService.deleteArtGuideline(this.artGuideline.id).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Deleted the ART Guideline';
  }

  onSelected(event) {
    this.selectedFile = event.target.files[0];
    this.artGuideline.content = 'ART_Guideline/' + this.selectedFile.name;
  }

  uploadContent() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.artGuidelineService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%');
        this.uploadProgressPerc = 'Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%';
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
