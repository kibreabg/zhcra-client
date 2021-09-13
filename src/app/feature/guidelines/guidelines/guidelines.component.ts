import { Component, OnInit, ViewChild } from '@angular/core';
import { Guideline } from '@core/models/guideline';
import { LoginService } from '../../auth/services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuidelineType } from '@core/models/guidelinetype';
import { ConfirmDialogService } from '@core/index';
import { GuidelineService } from '@core/index';
import { AgGridAngular } from 'ag-grid-angular';

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

  @ViewChild('myGrid') myGrid: AgGridAngular;

  private guideline = new Guideline();
  private guidelines: Guideline[];
  private guidelinetypes: GuidelineType[];
  private selectedFile: File = null;
  private token = '';
  private message = '';
  private messageHidden: boolean;
  private uploadFolder = '';
  private columnDefs = [
    { field: '', checkboxSelection: true },
    { field: 'title', width: 500, resizable: true },
    { field: 'content', resizable: true },
    { field: 'order', resizable: true }
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
    private guidelineService: GuidelineService,
    private loginService: LoginService,
    private confirmDialogService: ConfirmDialogService) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.guidelineService.getGuidelineTypes()
      .subscribe(
        guidelinetypes => {
          this.guidelinetypes = guidelinetypes;
        });
    this.getGuidelines();
    ;
  }

  onSelectionChanged() {
    var selectedRows = this.myGrid.api.getSelectedRows();
    this.getGuideline(selectedRows[0].id);
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
      this.uploadContent();

      this.guidelineService.addGuideline(this.guideline).subscribe(
        guideline => {
          if (guideline.id > 0) {
            this.messageHidden = false;
            this.message = 'Added new Guideline';
            this.getGuidelines();
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
    this.uploadContent();

    this.guidelineService.updateGuideline(this.guideline).subscribe(
      guideline => {
        this.messageHidden = false;
        this.message = 'Updated the Guideline';
        this.getGuidelines();
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
          this.form.reset({ title: '', type: '', content: '', order: '' });
        });
  }
  deleteGuideline() {
    this.confirmDialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.guidelineService.deleteGuideline(this.guideline.id)
            .subscribe(
              result => {
                this.messageHidden = false;
                this.message = 'Deleted the Guideline';
                this.getGuidelines();
              });
        }
      });
  }
  onTypeSelected(event) {
    const guidelineTypeId = event.value;
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
    const fd = new FormData(document.forms["guidelineForm"]);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    fd.append('gtype', this.uploadFolder);
    this.guidelineService.uploadContent(fd).subscribe(event => {
      console.log(event);
    });
  }

}
