import { Component, OnInit } from '@angular/core';
import { QuickAccessTool } from '@core/models/quickaccesstools';
import { QuickaccesstoolsService } from '@core/services/quickaccesstools.service';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { AgGridAngular } from 'ag-grid-angular';
@Component({
  selector: 'app-quick-access-tools',
  templateUrl: './quick-access-tools.component.html',
  styleUrls: ['./quick-access-tools.component.css']
})
export class QuickAccessToolsComponent implements OnInit {

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required),
  });

  @ViewChild('myGrid') myGrid: AgGridAngular;

  private quickaccesstool = new QuickAccessTool();
  private quickaccesstools: QuickAccessTool[];
  private selectedFile: File = null;
  private message = '';
  private uploadProgressPerc = '';
  private uploadIconProgressPerc = '';
  private token = '';
  private messageHidden: boolean;
  private uploadFolder = '';
  private columnDefs = [
    { field: '', width: 20, checkboxSelection: true },
    { field: 'title', width: 350, resizable: true },
    { field: 'content', width: 600, resizable: true },
    { field: 'icon', resizable: true }
  ];
  private gridOptions = {
    // PROPERTIES
    pagination: true,
    paginationAutoPageSize: true,
    rowSelection: 'single',

    // EVENTS
    // Add event handlers
    onRowClicked: event => null,
    onGridReady: event => null,
    firstDataRendered: event => this.myGrid.gridOptions.columnApi.autoSizeAllColumns(),

    // CALLBACKS
    isScrollLag: () => false
  };

  constructor(
    private quickAccessToolService: QuickaccesstoolsService,
    private router: Router,
    private loginService: LoginService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.getQuickAccessTools();
  }

  onSelectionChanged() {
    var selectedRows = this.myGrid.api.getSelectedRows();
    this.getQuickAccessTool(selectedRows[0].id);
  }

  addQuickAccessTool(): void {
    if (this.quickaccesstool.id > 0) {
      this.updateQuickAccessTool();
    } else {
      this.quickaccesstool.title = this.form.get('title').value;
      this.quickaccesstool.content = this.form.get('content').value;
      this.quickaccesstool.icon = this.form.get('icon').value;
      this.quickaccesstool.createdAt = new Date();
      this.uploadContent();
      this.uploadIcon();

      this.quickAccessToolService.addQuickAccessTool(this.quickaccesstool).subscribe(
        qatools => {
          if (qatools.id > 0) {
            this.messageHidden = false;
            this.message = 'Added new Quick Access Tool';
            this.getQuickAccessTools();
          } else {
            this.messageHidden = false;
            this.message = 'An Error Occured';
          }
        }
      );
    }
  }

  updateQuickAccessTool() {
    this.quickaccesstool.title = this.form.get('title').value;
    this.quickaccesstool.content = this.form.get('content').value;
    this.quickaccesstool.icon = this.form.get('icon').value;
    this.quickaccesstool.updatedAt = new Date();
    this.uploadContent();
    this.uploadIcon();

    this.quickAccessToolService.updateQuickAccessTool(this.quickaccesstool).subscribe(
      qatools => {
        this.messageHidden = false;
        this.message = 'Updated the Quick Access Tool';
        this.getQuickAccessTools();
      });
  }

  getQuickAccessTool(id: number) {
    return this.quickAccessToolService.getQuickAccessTool(id)
      .subscribe(
        qatools => {
          this.form.patchValue({
            id: qatools.id,
            title: qatools.title,
            content: qatools.content,
            icon: qatools.icon
          });
          this.quickaccesstool = qatools;
        });
  }

  getQuickAccessTools() {
    return this.quickAccessToolService.getQuickAccessTools()
      .subscribe(
        qatools => {
          this.quickaccesstools = qatools;
          this.form.reset({ title: '', content: '', icon: '' });
        });
  }

  deleteQuickAccessTool() {
    this.confirmDialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.quickAccessToolService.deleteQuickAccessTool(this.quickaccesstool.id)
            .subscribe(
              result => {
                this.messageHidden = false;
                this.message = 'Deleted the Quick Access Tool';
                this.getQuickAccessTools();
              });
        }
      });
  }

  onContentSelected(event) {
    this.selectedFile = event.target.files[0];
    this.form.patchValue({ content: 'Quick_Access_Tools/' + this.selectedFile.name });
  }

  onIconSelected(event) {
    this.selectedFile = event.target.files[0];
    this.form.patchValue({ icon: this.selectedFile.name });
  }

  uploadContent() {
    const fd = new FormData(document.forms["quickAccessForm"]);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.quickAccessToolService.uploadContent(fd).subscribe(event => {
      console.log(event);
    });
  }

  uploadIcon() {
    const fd = new FormData(document.forms["quickAccessForm"]);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.quickAccessToolService.uploadContent(fd).subscribe(event => {
      console.log(event);
    });
  }

}
