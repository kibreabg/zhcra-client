import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Guideline } from '../models/guideline';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { GuidelineService } from '../services/guideline.service';

declare var $;

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})
export class GuidelinesComponent implements OnInit {

  guideline = new Guideline();
  guidelines: Guideline[];
  guidelinetypes: any;
  dataTable: any;
  selectedFile: File = null;
  uploadProgressPerc = '';
  token = '';
  message = '';
  thisClass: any;
  messageHidden: boolean;

  constructor(private guidelineService: GuidelineService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.messageHidden = true;
    const thisClass = this;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.dataTable = $('#guidelineDataTable');
    this.dataTable.DataTable({
      ajax: {
        headers: {
          'Authorization': this.token
        },
        method: 'GET',
        url: 'http://zhcra.com:8788/api/guidelines',
        dataSrc: ''
      },
      columns: [
        { data: 'id'},
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
      $('#guidelineDataTable tbody').on('click', 'tr', function () {
        if ( $(this).hasClass('info') ) {
          $(this).removeClass('info');
        } else {
          $('#guidelineDataTable').DataTable().$('tr.info').removeClass('info');
            $(this).addClass('info');
        }
        const data = $('#guidelineDataTable').DataTable().row(this).data();
        if (typeof data !== 'undefined') {
          thisClass.getGuideline(data.id);
        }
      });

      thisClass.guidelineService.getGuidelineTypes()
        .subscribe(
          guidelinetypes => {
              $('#type').append($('<option></option>').attr('value', 0).text('--Select Guideline Types--'));
              $.each(guidelinetypes, function (key, entry) {
                $('#type').append($('<option></option>').attr('value', entry.id).text(entry.name));
              });
          });
    });
  }
  addGuideline(): void {
    if (this.guideline.id > 0) {
      this.updateGuideline();
    } else {
      this.guidelineService.addGuideline(this.guideline).subscribe();
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Added new Guideline';
    }
  }
  updateGuideline() {
    this.guidelineService.updateGuideline(this.guideline).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Updated the Guideline';
  }
  getGuideline(id: number) {
    return this.guidelineService.getGuideline(id)
      .subscribe(
        guideline => { this.guideline = guideline; });
  }
  getGuidelines() {
    return this.guidelineService.getGuidelines()
    .subscribe(
      guidelines => { this.guidelines = guidelines; });
  }
  deleteGuideline() {
    this.guidelineService.deleteGuideline(this.guideline.id).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Deleted the Guideline';
  }
  onSelected(event) {
    this.selectedFile = event.target.files[0];
    this.guideline.content = 'Guideline/' + this.selectedFile.name;
  }
  uploadContent() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.guidelineService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%');
        this.uploadProgressPerc = 'Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%';
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
