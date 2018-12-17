import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Memo } from '../models/memo';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MemoService } from '../services/memo.service';

declare var $;

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent implements OnInit {

  memo = new Memo();
  memos: Memo[];

  @ViewChild('memoDataTable') memoDT: ElementRef;
  dataTable: any;
  selectedFile: File = null;
  message = '';
  uploadProgressPerc = '';
  token = '';
  thisClass: any;
  messageHidden: boolean;

  constructor(private memoService: MemoService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.messageHidden = true;
    const thisClass = this;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.dataTable = $('#memoDataTable');
    this.dataTable.DataTable({
      ajax: {
        headers: {
          'Authorization': this.token
        },
        method: 'GET',
        url: 'http://zhcra.com:8788/api/memos',
        dataSrc: ''
      },
      responsive: true,
      columns: [
        { data: 'id' },
        { data: 'title' },
        { data: 'url' },
        { data: 'latest' }
      ],
      columnDefs: [
        {
          targets: [ 0 ],
          visible: false
        }
      ]
    });

    $(document).ready(function() {
      $('#memoDataTable tbody').on('click', 'tr', function () {
        if ( $(this).hasClass('info') ) {
          $(this).removeClass('info');
        } else {
          $('#memoDataTable').DataTable().$('tr.info').removeClass('info');
            $(this).addClass('info');
        }
        const data = $('#memoDataTable').DataTable().row(this).data();
        if (typeof data !== 'undefined') {
          thisClass.getMemo(data.id);
        }
      });
    });
  }

  addMemo(): void {
    if (this.memo.id > 0) {
      this.updateMemo();
    } else {
      this.memoService.addMemo(this.memo).subscribe(result => {
        this.dataTable.DataTable().ajax.reload();
        this.messageHidden = false;
        this.message = 'Added new Memo';
      });
    }
  }

  updateMemo() {
    this.memoService.updateMemo(this.memo).subscribe(result => {
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Updated the Memo';
    });
  }

  getMemo(id: number) {
    return this.memoService.getMemo(id)
      .subscribe(
        memo => { this.memo = memo; });
  }

  getMemos() {
    return this.memoService.getMemos()
        .subscribe(
          memos => { this.memos = memos; });
  }

  deleteMemo() {
    this.memoService.deleteMemo(this.memo.id).subscribe(result => {
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Deleted the Memo';
    });
  }

  onSelected(event) {
    this.selectedFile = event.target.files[0];
    this.memo.url = 'Memo/' + this.selectedFile.name;
  }

  uploadContent() {
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.memoService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log('Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%');
        this.uploadProgressPerc = 'Upload Progress ' + Math.round(event.loaded / event.total) * 100 + '%';
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
