//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2023  Interneuron Holdings Ltd

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubjectsService } from '../services/subjects.service';
import { CoreOperation } from '../models/entities/core-operation.model';
import { CoreOperationPostopInstruction } from '../models/entities/core-operation-postop-instruction.model';
import { SelectItem } from 'primeng/api';
import { TerminologyService } from '../services/terminology.service';
import * as moment from 'moment';

@Component({
  selector: 'app-operation-postop-instruction',
  templateUrl: './operation-postop-instruction.component.html',
  styleUrls: ['./operation-postop-instruction.component.css']
})
export class OperationPostopInstructionComponent implements OnInit, OnDestroy {
  @Input() set isSubmit(isSubmitted:boolean) {
    this.isSubmitted = isSubmitted;
  }
  subscriptions: Subscription = new Subscription();

  isViewPDF: boolean = false;

  weightBearingStatus: SelectItem[] = [];
  prophylaxistype: SelectItem[] = [];
  //mechanicalsection: SelectItem[] = [];
  mechanicaltedoptions: SelectItem[] = [];
  mechanicalscdoptions: SelectItem[] = [];
  postOperativeInstruction: CoreOperationPostopInstruction = new CoreOperationPostopInstruction();

  anticipatedDayofDischarge: Date;
  isSubmitted : boolean = false;
  constructor(private subjects: SubjectsService,
    private terminologies: TerminologyService) {       
    this.subscriptions.add(this.subjects.operation.subscribe(
      (op: CoreOperation) => {       
        this.applyTerminologyData();
        op.operationpostopinstructions = op.operationpostopinstructions == null ? new CoreOperationPostopInstruction() : op.operationpostopinstructions;

        this.postOperativeInstruction = op.operationpostopinstructions;
        this.postOperativeInstruction.operationpostopinstructions_id = op.operation_id;
        this.postOperativeInstruction.operation_id = op.operation_id;

        this.anticipatedDayofDischarge = this.postOperativeInstruction.anticipateddayofdischarge == null ? null : new Date(moment(this.postOperativeInstruction.anticipateddayofdischarge, moment.ISO_8601).toString());
      }
    ));

    this.subscriptions.add(
        this.subjects.isViewPDF.subscribe((isViewPDF: boolean) => {
            this.isViewPDF = isViewPDF;
        })
    );
   
        
  }

  ngOnInit() {
    this.prophylaxistype.push({label:'Please select',value: ''});
    this.prophylaxistype.push({label:'Chemical',value: 'Chemical'});
    this.prophylaxistype.push({label:'Mechanical',value: 'Mechanical'});
    this.prophylaxistype.push({label:'Chemical & Mechanical',value: 'Chemical & Mechanical'});
    this.prophylaxistype.push({label:'None required',value: 'None required'});

    this.mechanicaltedoptions.push({label:'Both',value: 'Both'});
    this.mechanicaltedoptions.push({label:'Left only',value: 'Left only'});
    this.mechanicaltedoptions.push({label:'Right only',value: 'Right only'});
    this.mechanicaltedoptions.push({label:'None',value: 'None'});

    this.mechanicalscdoptions = this.mechanicaltedoptions;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  applyTerminologyData() {
    this.weightBearingStatus = [];
    for (var i = 0; i < this.terminologies.weightBearingMeta.length; i++) {
      this.weightBearingStatus.push({
        label: this.terminologies.weightBearingMeta[i].text,
        value: this.terminologies.weightBearingMeta[i].code
      });
    }
  }

  // Dropdown change events:

  onWeightBearingChange(event) {
      this.postOperativeInstruction.weightbearingstatustext = this.weightBearingStatus.find(x => x.value == event.value).label;
  }
  onProphylaxistypeChange(event) {
      this.postOperativeInstruction.prophylaxis = "";
      this.postOperativeInstruction.bedresttext = "";
      this.postOperativeInstruction.mechanicalscdoption = "";
      this.postOperativeInstruction.mechanicaltedoption = "";
      this.postOperativeInstruction.mechanicalted= false;
      this.postOperativeInstruction.mechanicalscd= false;
    //this.postOperativeInstruction.prophylaxistype = this.weightBearingStatus.find(x => x.value == event.value).label;
  }
  
  onAnticipatedDischargeSelect(event) {
      var m = moment(); // Initial moment object

      var newDate = moment(event);

      m.set(newDate.toObject());

      this.postOperativeInstruction.anticipateddayofdischarge = m.format("YYYY-MM-DDT00:00:00");
  }
}
