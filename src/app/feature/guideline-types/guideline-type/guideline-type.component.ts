import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../auth/services/login.service';
import { GuidelineType } from '@core/models/guidelinetype';
import { GuidelineTypeService } from '@core/services/guideline-type.service';
import { DataTableComponent } from '@shared/data-table/data-table.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';

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
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    folder: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required)
  });

  @ViewChild(DataTableComponent) dataTableComponent: DataTableComponent;

  constructor(
    private guidelineTypeService: GuidelineTypeService,
    private loginService: LoginService,
    private confirmDialogService: ConfirmDialogService) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.getGuidelineTypes();
  }

  onRowSelected(row: number) {
    this.getGuidelineType(row);
  }

  addGuidelineType(): void {
    if (this.guidelineType.id > 0) {
      this.updateGuidelineType();
    } else {
      this.guidelineType.name = this.form.get('name').value;
      this.guidelineType.folder = this.form.get('folder').value;
      this.guidelineType.icon = this.form.get('icon').value;
      this.guidelineType.createdAt = new Date();
      this.uploadIcon();

      this.guidelineTypeService.addGuidelineType(this.guidelineType).subscribe(
        guidelineType => {
          if (guidelineType.id > 0) {
            this.messageHidden = false;
            this.message = 'Added new Guideline Type';
            this.getGuidelineTypes();
          } else {
            this.messageHidden = false;
            this.message = 'An Error Occured';
          }
        }
      );
    }
  }

  updateGuidelineType() {
    this.guidelineType.name = this.form.get('name').value;
    this.guidelineType.folder = this.form.get('folder').value;
    this.guidelineType.icon = this.form.get('icon').value;
    this.guidelineType.updatedAt = new Date();
    this.uploadIcon();

    this.guidelineTypeService.updateGuidelineType(this.guidelineType).subscribe(result => {
      this.getGuidelineTypes();
      this.messageHidden = false;
      this.message = 'Updated the Guideline Type';
    });
  }

  getGuidelineType(id: number) {
    return this.guidelineTypeService.getGuidelineType(id)
      .subscribe(
        guidelineType => {
          this.form.patchValue({
            name: guidelineType.name,
            icon: guidelineType.icon,
            folder: guidelineType.folder
          });
          this.guidelineType = guidelineType;
        });
  }

  getGuidelineTypes() {
    return this.guidelineTypeService.getGuidelineTypes()
      .subscribe(
        guidelineTypes => {
          this.guidelineTypes = guidelineTypes;
          this.dataTableComponent.onReloadGrid(guidelineTypes);
        });
  }

  deleteGuidelineType() {
    this.confirmDialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.guidelineTypeService.deleteGuidelineType(this.guidelineType.id)
            .subscribe(
              result => {
                this.messageHidden = false;
                this.message = 'Deleted the Guideline Type';
                this.getGuidelineTypes();
              });
        }
      });
  }

  onSelected(event) {
    this.selectedFile = event.target.files[0];
    this.form.patchValue({ icon: this.selectedFile.name });
  }

  uploadIcon() {
    const fd = new FormData(document.forms["guidelinetypeform"]);
    fd.append('file', this.selectedFile, this.selectedFile.name);
    this.guidelineTypeService.uploadIcon(fd).subscribe(event => {
      console.log(event);
    });
  }

}
