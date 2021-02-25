import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Guideline } from '../models/guideline';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { GuidelineService } from '../services/guideline.service';
import { GuidelineTypeService } from '../services/guideline-type.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GuidelineType } from '../models/guidelinetype';
import { EventEmitterService } from '../services/event-emitter.service';

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
    private router: Router,
    private loginService: LoginService,
    private eventEmitterService: EventEmitterService) { }

  ngOnInit() {
    this.messageHidden = true;
    this.token = 'Bearer ' + this.loginService.getToken();
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        callBindFunction.subscribe((id: number) => {
          this.getGuideline(id);
        });
    }

    this.guidelineService.getGuidelineTypes()
      .subscribe(
        guidelinetypes => {
          this.guidelinetypes = guidelinetypes;
        });
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

      this.guidelineService.addGuideline(this.guideline).subscribe(
        guideline => {
          if (guideline.id > 0) {
            this.messageHidden = false;
            this.message = 'Added new Guideline';
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
        });
  }
  deleteGuideline() {
    this.guidelineService.deleteGuideline(this.guideline.id)
      .subscribe(
        result => {
          this.messageHidden = false;
          this.message = 'Deleted the Guideline';
        });
  }
  onTypeSelected(event) {
    const guidelineTypeId = event.target.selectedOptions[0].value;
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
    const fd = new FormData();
    fd.append('file', this.selectedFile, this.selectedFile.name);
    fd.append('type', this.uploadFolder);
    this.guidelineService.uploadContent(fd).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
      } else if (event.type === HttpEventType.Response) {
        console.log(event);
      }
    });
  }

}
