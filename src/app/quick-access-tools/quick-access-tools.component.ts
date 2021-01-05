import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QuickAccessTool } from '../models/quickaccesstools';
import { QuickaccesstoolsService } from '../services/quickaccesstools.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { LoginService } from '../services/login.service';

declare var $;

@Component({
  selector: 'app-quick-access-tools',
  templateUrl: './quick-access-tools.component.html',
  styleUrls: ['./quick-access-tools.component.css']
})
export class QuickAccessToolsComponent implements OnInit {

  quickaccesstool = new QuickAccessTool();
  quickaccesstools: QuickAccessTool[];
  dataTable: any;
  selectedFile: File = null;
  message = '';
  uploadProgressPerc = '';
  uploadIconProgressPerc = '';
  token = '';
  thisClass: any;
  messageHidden: boolean;

  constructor(private quickAccessToolService: QuickaccesstoolsService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.messageHidden = true;
    const thisClass = this;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.dataTable = $('#qatDataTable');
    this.dataTable.DataTable({
      ajax: {
        headers: {
          'Authorization': this.token
        },
        method: 'GET',
        url: 'http://localhost:5000/api/quickaccesstools',
        dataSrc: ''
      },
      responsive: true,
      columns: [
        { data: 'id' },
        { data: 'title' },
        { data: 'content' }
      ],
      columnDefs: [
        {
            targets: [ 0 ],
            visible: false
        }
      ]
    });

    $(document).ready(function() {
      $('#qatDataTable tbody').on('click', 'tr', function () {
        if ( $(this).hasClass('info') ) {
          $(this).removeClass('info');
        } else {
          $('#qatDataTable').DataTable().$('tr.info').removeClass('info');
            $(this).addClass('info');
        }
        const data = $('#qatDataTable').DataTable().row(this).data();
        if (typeof data !== 'undefined') {
          thisClass.getQuickAccessTool(data.id);
        }
      });
    });

  }

  addQuickAccessTool(): void {
    if (this.quickaccesstool.id > 0) {
      this.updateQuickAccessTool();
    } else {
      this.quickAccessToolService.addQuickAccessTool(this.quickaccesstool).subscribe();
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Added new Quick Access Tool';
    }
  }

  updateQuickAccessTool() {
    this.quickAccessToolService.updateQuickAccessTool(this.quickaccesstool).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Updated the Quick Access Tool';
  }

  getQuickAccessTool(id: number) {
    return this.quickAccessToolService.getQuickAccessTool(id)
      .subscribe(
        quickaccesstool => { this.quickaccesstool = quickaccesstool; });
  }

  getQuickAccessTools() {
    return this.quickAccessToolService.getQuickAccessTools()
      .subscribe(
        quickaccesstools => { this.quickaccesstools = quickaccesstools; });
  }

  deleteQuickAccessTool() {
    this.quickAccessToolService.deleteQuickAccessTool(this.quickaccesstool.id).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Deleted the Quick Access Tool';
  }

  onContentSelected(event) {
    this.selectedFile = event.target.files[0];
    this.quickaccesstool.content = 'Quick_Access_Tools/' + this.selectedFile.name;
  }

  onIconSelected(event) {
    this.selectedFile = event.target.files[0];
    this.quickaccesstool.icon = this.selectedFile.name;
  }

  uploadContent() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.quickAccessToolService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgressPerc = 'Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%';
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

  uploadIcon() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.quickAccessToolService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadIconProgressPerc = 'Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%';
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
