import { Component, OnInit } from '@angular/core';
import { PrescriptionTool } from '@core/models/prescriptiontool';
import { PrescriptionToolService } from '@core/services/prescription-tool.service';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@core/services/confirm-dialog.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-prescription-tool',
  templateUrl: './prescription-tool.component.html',
  styleUrls: ['./prescription-tool.component.css']
})
export class PrescriptionToolComponent implements OnInit {

  form = new FormGroup({
    description: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
    parentid: new FormControl('', Validators.required),
  });

  @ViewChild('myGrid') myGrid: AgGridAngular;

  prescriptionTool = new PrescriptionTool();
  prescriptionTools: PrescriptionTool[];
  message = '';
  messageHidden: boolean;
  token = '';
  private columnDefs = [
    { field: '', width: 20, checkboxSelection: true },
    { field: 'description', width: 150, resizable: true },
    { field: 'content', width: 700, resizable: true },
    { field: 'parentId', resizable: true }
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
    private prescriptionToolService: PrescriptionToolService,
    private router: Router,
    private loginService: LoginService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.getPrescriptionTools();
  }

  onSelectionChanged() {
    var selectedRows = this.myGrid.api.getSelectedRows();
    this.getPrescriptionTool(selectedRows[0].id);
  }

  addPrescriptionTool(): void {
    if (this.prescriptionTool.id > 0) {
      this.updatePrescriptionTool();
    } else {
      this.prescriptionTool.description = this.form.get('description').value;
      this.prescriptionTool.parentId = this.form.get('parentid').value;
      this.prescriptionTool.content = this.form.get('content').value;
      this.prescriptionTool.createdAt = new Date();

      this.prescriptionToolService.addPrescriptionTool(this.prescriptionTool).subscribe(
        prestool => {
          if (prestool.id > 0) {
            this.messageHidden = false;
            this.message = 'Added new Prescription Tool';
            this.getPrescriptionTools();
          } else {
            this.messageHidden = false;
            this.message = 'An Error Occured';
          }
        }
      );
    }
  }
  updatePrescriptionTool() {
    this.prescriptionTool.description = this.form.get('description').value;
    this.prescriptionTool.parentId = this.form.get('parentid').value;
    this.prescriptionTool.content = this.form.get('content').value;
    this.prescriptionTool.updatedAt = new Date();
    this.prescriptionToolService.updatePrescriptionTool(this.prescriptionTool).subscribe(
      prestool => {
        this.messageHidden = false;
        this.message = 'Updated the PrescriptionTool';
        this.getPrescriptionTools();
      }
    );
  }
  getPrescriptionTool(id: number) {
    return this.prescriptionToolService.getPrescriptionTool(id)
      .subscribe(
        prestool => {
          this.form.patchValue({
            id: prestool.id,
            description: prestool.description,
            parentid: prestool.parentId,
            content: prestool.content
          });
          this.prescriptionTool = prestool;
        });
  }
  getPrescriptionTools() {
    return this.prescriptionToolService.getPrescriptionTools()
      .subscribe(
        prescriptiontools => {
          this.prescriptionTools = prescriptiontools;
          this.form.reset({ description: '', content: '', parentid: '' });
        });
  }
  getChildrenPrescTools(parentId: number) {
    return this.prescriptionToolService.getChildrenPrescTools(parentId).subscribe(
      children => {
        this.prescriptionTools = children;
      });
  }
  getChildren() {
    this.getChildrenPrescTools(this.form.get('parentid').value);
  }

  deletePrescriptionTool() {
    this.confirmDialogService.openConfirmDialog()
      .afterClosed().subscribe(res => {
        if (res) {
          this.prescriptionToolService.deletePrescriptionTool(this.prescriptionTool.id)
            .subscribe(
              result => {
                this.messageHidden = false;
                this.message = 'Deleted the Prescription Tool';
                this.getPrescriptionTools();
              });
        }
      });
  }

}
