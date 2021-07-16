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
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';

@Component({
  selector: 'app-memo',
  templateUrl: './memo.component.html',
  styleUrls: ['./memo.component.css']
})
export class MemoComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
    latest: new FormControl(''),
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

  constructor(
    private memoService: MemoService,
    private router: Router,
    private loginService: LoginService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.getMemos();
  }

  onRowSelected(row: number) {
    this.getMemo(row);
  }


  addMemo(): void {
    if (this.memo.id > 0) {
      this.updateMemo();
    } else {
      this.memo.title = this.form.get('title').value;
      this.memo.url = this.form.get('url').value;
      this.memo.latest = this.form.get('latest').value;
      this.memo.createdAt = new Date();
      this.uploadContent();

      this.memoService.addMemo(this.memo).subscribe(
        memo => {
          if (memo.id > 0) {
            this.messageHidden = false;
            this.message = 'Added new memo';
            this.getMemos();
          } else {
            this.messageHidden = false;
            this.message = 'An Error Occured';
          }
        }
      );
    }
  }

  updateMemo() {
    this.memo.title = this.form.get('title').value;
    this.memo.url = this.form.get('url').value;
    this.memo.latest = this.form.get('latest').value;
    this.memo.createdAt = new Date();
    this.uploadContent();

    this.memoService.updateMemo(this.memo).subscribe(
      memo => {
        this.messageHidden = false;
        this.message = 'Updated the Memo';
        this.getMemos();
      });

  }

  getMemo(id: number) {
    return this.memoService.getMemo(id)
      .subscribe(
        memo => {
          this.form.patchValue({
            id: memo.id,
            title: memo.title,
            url: memo.url,
            latest: memo.latest
          });
          this.memo = memo;
        });
  }

  getMemos() {
    return this.memoService.getMemos()
      .subscribe(
        memos => {
          this.memos = memos;
          this.dataTableComponent.onReloadGrid(memos);
          this.form.reset({ title: '', url: '', latest: '' });
        });
  }

  deleteMemo() {
    this.confirmDialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.memoService.deleteMemo(this.memo.id)
            .subscribe(
              result => {
                this.messageHidden = false;
                this.message = 'Deleted the Memo';
                this.getMemos();
              });
        }
      });
  }

  onSelected(event) {
    this.selectedFile = event.target.files[0];
    this.form.patchValue({ url: 'Memos/' + this.selectedFile.name });
  }

  uploadContent() {
    const fd = new FormData(document.forms["memoForm"]);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.memoService.uploadContent(fd).subscribe(event => {
      console.log(event);
    });
  }

}
