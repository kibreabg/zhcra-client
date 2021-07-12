import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Memo } from '@core/models/memo';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { HttpEventType } from '@angular/common/http';
import { MemoService } from '@core/services/memo.service';
import { DataTableComponent } from '@shared/data-table/data-table.component';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
    latest: new FormControl('', Validators.required),
  });

  @ViewChild(DataTableComponent) dataTableComponent: DataTableComponent;

  memo = new Memo();
  memos: Memo[];
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
    this.token = 'Bearer ' + this.loginService.getToken();
    this.getMemos();
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
    this.memo.url = 'Memos/' + this.selectedFile.name;
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
