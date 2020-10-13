import { Component, OnInit } from '@angular/core';
import { PrescriptionTool } from '../models/prescriptiontool';
import { PrescriptionToolService } from '../services/prescription-tool.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

declare var $;

@Component({
  selector: 'app-prescription-tool',
  templateUrl: './prescription-tool.component.html',
  styleUrls: ['./prescription-tool.component.css']
})
export class PrescriptionToolComponent implements OnInit {

  prescriptionTool = new PrescriptionTool();
  prescriptionTools: PrescriptionTool[];
  message = '';
  thisClass: any;
  messageHidden: boolean;
  dataTable: any;
  token = '';

  constructor(private prescriptionToolService: PrescriptionToolService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.messageHidden = true;
    const thisClass = this;
    this.token = 'Bearer ' + this.loginService.getToken();
    this.dataTable = $('#prescriptionToolDataTable');
    this.dataTable.DataTable({
      ajax: {
        headers: {
          'Authorization': this.token
        },
        method: 'GET',
        url: 'http://zhcra.com:8788/api/prescriptiontools',
        dataSrc: ''
      },
      columns: [
        { data: 'id'},
        { data: 'description' },
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
      $('#prescriptionToolDataTable tbody').on('click', 'tr', function () {
        if ( $(this).hasClass('info') ) {
          $(this).removeClass('info');
        } else {
          $('#prescriptionToolDataTable').DataTable().$('tr.info').removeClass('info');
            $(this).addClass('info');
        }
        const data = $('#prescriptionToolDataTable').DataTable().row(this).data();
        if (typeof data !== 'undefined') {
          thisClass.getPrescriptionTool(data.id);
        }
      });

      thisClass.prescriptionToolService.getChildrenPrescTools(0)
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
          });
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
