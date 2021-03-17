import { Component, OnInit, ViewChild } from '@angular/core';
import { Guideline } from '@core/models/guideline';
import { LoginService } from '../../auth/services/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuidelineType } from '@core/models/guidelinetype';
import { DataTableComponent } from '@shared/data-table/data-table.component';
import { ConfirmDialogService } from '@core/index';
import { GuidelineService } from '@core/index';

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

  @ViewChild(DataTableComponent) dataTableComponent: DataTableComponent;

  guideline = new Guideline();
  guidelines: Guideline[];
  guidelinetypes: GuidelineType[];
  selectedFile: File = null;
  token = '';
  message = '';
  thisClass: any;
  messageHidden: boolean;
  uploadFolder = '';

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
  }

  onRowSelected(row: number) {
    this.getGuideline(row);
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
          this.dataTableComponent.onReloadGrid(guidelines);
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
