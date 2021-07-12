import { Component, OnInit } from '@angular/core';
import { PrescriptionTool } from '@core/models/prescriptiontool';
import { PrescriptionToolService } from '@core/services/prescription-tool.service';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { DataTableComponent } from '@shared/data-table/data-table.component';
import { ViewChild } from '@angular/core';

declare var $;

@Component({
  selector: 'app-prescription-tool',
  templateUrl: './prescription-tool.component.html',
  styleUrls: ['./prescription-tool.component.css']
})
export class PrescriptionToolComponent implements OnInit {

  form = new FormGroup({
    description: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),
  });

  @ViewChild(DataTableComponent) dataTableComponent: DataTableComponent;

  prescriptionTool = new PrescriptionTool();
  prescriptionTools: PrescriptionTool[];
  message = '';
  thisClass: any;
  messageHidden: boolean;
  dataTable: any;
  token = '';

  constructor(
    private prescriptionToolService: PrescriptionToolService,
    private router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.getPrescriptionTools();

    $(document).ready(function () {

      /*thisClass.prescriptionToolService.getChildrenPrescTools(0)
        .subscribe(
          prescriptionTooltypes => {
            $('#parent').append($('<option></option>').attr('value', 0).text('--Select Parent Content--'));
            $.each(prescriptionTooltypes, function (key, entry) {
              $('#parent').append($('<option></option>').attr('value', entry.id).text(entry.content));
            });
          });

      $('#getChildren').on('click', function () {
        thisClass.prescriptionToolService.getChildrenPrescTools($('#parent option:selected').val())
          .subscribe(
            prescriptionTooltypes => {
              $('#parent option').remove();
              $('#parent').append($('<option></option>').attr('value', 0).text('--Select Parent Content--'));
              $.each(prescriptionTooltypes, function (key, entry) {
                $('#parent').append($('<option></option>').attr('value', entry.id).text(entry.content));
              });
            });
      });*/
    });
  }

  addPrescriptionTool(): void {
    if (this.prescriptionTool.id > 0) {
      this.updatePrescriptionTool();
    } else {
      this.prescriptionToolService.addPrescriptionTool(this.prescriptionTool).subscribe();
      this.dataTable.DataTable().ajax.reload();
      this.messageHidden = false;
      this.message = 'Added new PrescriptionTool';
    }
  }
  updatePrescriptionTool() {
    this.prescriptionToolService.updatePrescriptionTool(this.prescriptionTool).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Updated the PrescriptionTool';
  }
  getPrescriptionTool(id: number) {
    return this.prescriptionToolService.getPrescriptionTool(id)
      .subscribe(
        prescriptionTool => { this.prescriptionTool = prescriptionTool; });
  }
  getPrescriptionTools() {
    return this.prescriptionToolService.getPrescriptionTools()
      .subscribe(
        prescriptionTools => { this.prescriptionTools = prescriptionTools; });
  }
  getChildrenPrescTools(parentId: number) {
    return this.prescriptionToolService.getChildrenPrescTools(parentId).subscribe(children => {

    });
  }
  getChildren() {
    this.getChildrenPrescTools(0);
  }

  deletePrescriptionTool() {
    this.prescriptionToolService.deletePrescriptionTool(this.prescriptionTool.id).subscribe();
    this.dataTable.DataTable().ajax.reload();
    this.messageHidden = false;
    this.message = 'Deleted the PrescriptionTool';
  }

}
