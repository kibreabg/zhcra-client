import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Guideline } from '../models/guideline';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { GuidelineService } from '../services/guideline.service';
import { GuidelineTypeService } from '../services/guideline-type.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuidelineType } from '../models/guidelinetype';

declare var $;

@Component({
  selector: 'app-guidelines',
  templateUrl: './guidelines.component.html',
  styleUrls: ['./guidelines.component.css']
})
export class GuidelinesComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    order: new FormControl('', Validators.required),
  });

  guideline = new Guideline();
  guidelines: Guideline[];
  guidelinetypes: GuidelineType[];
  dataTable: any;
  selectedFile: File = null;
  uploadProgressPerc = '';
  token = '';
  message = '';
  thisClass: any;
  messageHidden: boolean;
  uploadFolder = '';

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
        url: 'http://localhost:5000/api/guidelines',
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
          targets: [0],
          visible: false
        }
      ]
    });

    this.guidelineService.getGuidelineTypes()
      .subscribe(
        guidelinetypes => {
          this.guidelinetypes = guidelinetypes;
        });

    $(document).ready(function () {
      $('#guidelineDataTable tbody').on('click', 'tr', function () {
        if ($(this).hasClass('info')) {
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
    });
  }
  addGuideline(): void {
    if (this.guideline.id > 0) {
      this.updateGuideline();
    } else {
      this.guideline.title = this.form.get('title').value;
      this.guideline.type = this.form.get('type').value;
      this.guideline.content = this.form.get('content').value;
      this.guideline.order = this.form.get('order').value;
      this.guideline.createdAt = new Date();

      this.guidelineService.addGuideline(this.guideline).subscribe(
        guideline => {
          if (guideline.id > 0) {
            this.dataTable.DataTable().ajax.reload();
            this.messageHidden = false;
            this.message = 'Added new Guideline';
          } else {
            this.messageHidden = false;
            this.message = 'An Error Occured';
          }
        }
      );

    }
  }
  updateGuideline() {
    this.guideline.title = this.form.get('title').value;
    this.guideline.type = this.form.get('type').value;
    this.guideline.content = this.form.get('content').value;
    this.guideline.order = this.form.get('order').value;
    this.guideline.updatedAt = new Date();

    this.guidelineService.updateGuideline(this.guideline).subscribe(
      guideline => {
        this.dataTable.DataTable().ajax.reload();
        this.messageHidden = false;
        this.message = 'Updated the Guideline';
      });
  }
  getGuideline(id: number) {
    return this.guidelineService.getGuideline(id)
      .subscribe(
        guideline => {
          this.form.patchValue({
            id: guideline.id,
            title: guideline.title,
            type: guideline.type,
            content: guideline.content,
            order: guideline.order
          });
          this.guideline = guideline;
        });
  }
  getGuidelines() {
    return this.guidelineService.getGuidelines()
      .subscribe(
        guidelines => {
          this.guidelines = guidelines;
        });
  }
  deleteGuideline() {
    this.guidelineService.deleteGuideline(this.guideline.id)
      .subscribe(
        result => {
          this.dataTable.DataTable().ajax.reload();
          this.messageHidden = false;
          this.message = 'Deleted the Guideline';
        });
  }
  onTypeSelected(event) {
    const guidelineTypeId = event.target.selectedOptions[0].value;
    const guidelineType = this.guidelineService.getGuidelineType(guidelineTypeId);
    guidelineType.subscribe(gType => {
      this.uploadFolder = gType.folder;
    });
  }
  onSelected(event) {
    this.selectedFile = event.target.files[0];
    this.form.patchValue({ content: this.selectedFile.name });
  }
  uploadContent() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    fd.append('type', this.uploadFolder);
    this.guidelineService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
