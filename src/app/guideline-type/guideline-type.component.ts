import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { GuidelineType } from '../models/guidelinetype';
import { GuidelineTypeService } from '../services/guideline-type.service';

declare var $;

@Component({
  selector: 'app-guideline-type',
  templateUrl: './guideline-type.component.html',
  styleUrls: ['./guideline-type.component.css']
})
export class GuidelineTypeComponent implements OnInit {

  guidelineType = new GuidelineType();
  guidelineTypes: GuidelineType[];
  dataTable: any;
  selectedFile: File = null;
  uploadProgressPerc = '';
  token = '';
  message = '';
  thisClass: any;
  messageHidden: boolean;

  constructor(private guidelineTypeService: GuidelineTypeService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.messageHidden = true;
    const thisClass = this;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.dataTable = $('#guideTypeDataTable');
    this.dataTable.DataTable({
      ajax: {
        headers: {
          'Authorization': this.token
        },
        method: 'GET',
        url: 'http://zhcra.com:8788/api/guidelinetypes',
        dataSrc: ''
      },
      columns: [
        { data: 'id' },
        { data: 'name' },
        { data: 'folder' }
      ],
      columnDefs: [
        {
            targets: [ 0 ],
            visible: false
        }
    ]
    });

    $(document).ready(function() {
      $('#guideTypeDataTable tbody').on('click', 'tr', function () {
        if ( $(this).hasClass('info') ) {
          $(this).removeClass('info');
        } else {
          $('#guideTypeDataTable').DataTable().$('tr.info').removeClass('info');
            $(this).addClass('info');
        }
        const data = $('#guideTypeDataTable').DataTable().row(this).data();
        if (typeof data !== 'undefined') {
          thisClass.getGuidelineType(data.id);
        }
      });
    });
  }

  addGuidelineType(): void {
    if (this.guidelineType.id > 0) {
      this.updateGuidelineType();
    } else {
      this.guidelineTypeService.addGuidelineType(this.guidelineType).subscribe(result => {
        this.dataTable.DataTable().ajax.reload();
        this.messageHidden = false;
        this.message = 'Added new Guideline Type';
      });
    }
  }

  updateGuidelineType() {
    this.guidelineTypeService.updateGuidelineType(this.guidelineType).subscribe(result => {
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Updated the Guideline Type';
    });
  }

  getGuidelineType(id: number) {
    return this.guidelineTypeService.getGuidelineType(id)
      .subscribe(
        guidelineType => { this.guidelineType = guidelineType; },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.router.navigate(['/login']);
            }
          }
      });
  }

  getGuidelineTypes() {
    return this.guidelineTypeService.getGuidelineTypes()
      .subscribe(
        guidelineTypes => { this.guidelineTypes = guidelineTypes; },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 403) {
              this.router.navigate(['/login']);
            }
          }
      });
  }

  deleteGuidelineType() {
    this.guidelineTypeService.deleteGuidelineType(this.guidelineType.id).subscribe(result => {
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Deleted the Guideline Type';
    });
  }

}
