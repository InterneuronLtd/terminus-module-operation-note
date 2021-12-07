//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2021  Interneuron CIC

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
import { CoreOperationPreparation } from '../models/entities/core-operation-preparation.model';
import { SelectItem } from 'primeng/api';
import { TerminologyService } from '../services/terminology.service';
import { CoreOperationAnaesthetic } from '../models/entities/core-operationanaesthetic';
import AppConfig from "src/assets/config/operation-note.config.json"
import { ApirequestService } from '../services/apirequest.service';
import { Anaesthetic, Antibiotics } from '../models/anaesthetic';
import { v4 as uuidv4 } from 'uuid';
import { CoreOperationantibiotics } from '../models/entities/core-operationantibiotics';

@Component({
  selector: 'app-operation-preparation',
  templateUrl: './operation-preparation.component.html',
  styleUrls: ['./operation-preparation.component.css']
})
export class OperationPreparationComponent implements OnInit, OnDestroy {
  @Input() set isSubmit(isSubmitted:boolean) {
    this.isSubmitted = isSubmitted;
  }
  subscriptions: Subscription = new Subscription();

  isViewPDF: boolean = false;
  isSubmitted : boolean = false;
  anaesthetics: SelectItem[] = [];

  antibiotics: SelectItem[] = [];
  Operation: CoreOperation;
  operationPreparation: CoreOperationPreparation = new CoreOperationPreparation();
  VManaesthetic: Anaesthetic = new Anaesthetic();
  VMantibiotics: Antibiotics = new Antibiotics();

  metaAnaesthetic = [];
  metantibiotics = [];

  anaestheticNotes: string = "";

  constructor(private subjects: SubjectsService, private apiRequest: ApirequestService,
    private terminologies: TerminologyService) {
    this.subscriptions.add(this.subjects.operation.subscribe(
      (op: CoreOperation) => {
        this.applyTerminologies();
        this.Operation = op == null ? new CoreOperation() : op;
        this.Operation.operationanaesthetic = null ? [] : op.operationanaesthetic;
        op.operationpreparation = op.operationpreparation == null ? new CoreOperationPreparation() : op.operationpreparation;

        this.operationPreparation = op.operationpreparation;
        this.operationPreparation.operationpreparation_id = op.operation_id;
        this.operationPreparation.operation_id = op.operation_id;

        this.loadAnaesthetic();
        this.loadAntibiotics();

      }
    ));

    this.subscriptions.add(
      this.subjects.isViewPDF.subscribe((isViewPDF: boolean) => {
        this.isViewPDF = isViewPDF;
      })
    );
  }

  ngOnInit() { }

  loadAnaesthetic() {
    this.subscriptions.add(
      this.apiRequest.getRequest(AppConfig.uris.dynamicApiUri + AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetmetaAnaesthetic").url).subscribe(
        (data: any) => {
          this.metaAnaesthetic = JSON.parse(data);
          let populate = JSON.parse(data);
          this.VManaesthetic = new Anaesthetic();
          let items = this.Operation.operationanaesthetic.slice();
          this.Operation.operationanaesthetic = [];
          for (var product of items) {

            if (product.anaesthetic_id === populate.find(x => x.code == "Epidural").anaesthetic_id) { 
              this.VManaesthetic.anaestheticEpiduralonly = true; 
              this.onAnaestheticChange("Epidural"); 
            }
            else if (product.anaesthetic_id === populate.find(x => x.code == "LA").anaesthetic_id) { 
              this.VManaesthetic.anaestheticLAonly = true;  
              this.onAnaestheticChange("LA"); 
            }
            else if (product.anaesthetic_id === populate.find(x => x.code == "GA").anaesthetic_id) { 
              this.VManaesthetic.anaestheticGA = true;  
              this.onAnaestheticChange("GA"); 
            }
            else if (product.anaesthetic_id === populate.find(x => x.code == "Regional block").anaesthetic_id) { 
              this.VManaesthetic.anaestheticRegionalblock = true;  
              this.onAnaestheticChange("Regional block");  
            }
            else if (product.anaesthetic_id === populate.find(x => x.code == "Spinal").anaesthetic_id) {
              this.VManaesthetic.anaestheticSpinal = true;  
              this.onAnaestheticChange("Spinal");  
            }
            else if (product.anaesthetic_id === populate.find(x => x.code == "Other").anaesthetic_id) {
              this.VManaesthetic.anaestheticOther = true;
              this.VManaesthetic.notes = product.anaestheticnotes;
              this.onAnaestheticChange("Other");
            }
          }
        }
      ))

  }

  loadAntibiotics() {
    this.subscriptions.add(
      this.apiRequest.getRequest(AppConfig.uris.dynamicApiUri + AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetmetaAntibiotics").url).subscribe(
        (data: any) => {
          this.metantibiotics = JSON.parse(data);
          let populate = JSON.parse(data);

          let items = this.Operation.operationantibiotics.slice();
          this.Operation.operationantibiotics = [];
          this.VMantibiotics = new Antibiotics();
          for (var item of items) {
            if (item.antibiotics_id === populate.find(x => x.code == "Metronidazole").antibiotics_id) { this.VMantibiotics.metronidazole = true; this.onAntibioticsChange("Metronidazole"); }
            else if (item.antibiotics_id === populate.find(x => x.code == "Teicoplanin").antibiotics_id) { this.VMantibiotics.teicoplanin = true; this.onAntibioticsChange("Teicoplanin"); }
            else if (item.antibiotics_id === populate.find(x => x.code == "Gentamicin").antibiotics_id) { this.VMantibiotics.gentamicin = true; this.onAntibioticsChange("Gentamicin"); }
            else if (item.antibiotics_id === populate.find(x => x.code == "Flucloxacillin").antibiotics_id) { this.VMantibiotics.flucloxacillin = true; this.onAntibioticsChange("Flucloxacillin"); }

            else if (item.antibiotics_id === populate.find(x => x.code == "Other").antibiotics_id) {
              this.VMantibiotics.other = true;
              this.VMantibiotics.notes = item.antibioticsnote;
              this.onAntibioticsChange("Other");
            }
          }
        }
      ))

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  applyTerminologies() {
    for (var i = 0; i < this.terminologies.anaestheticsTerminology.length; i++) {
      this.anaesthetics.push({
        label: this.terminologies.anaestheticsTerminology[i].conceptname,
        value: this.terminologies.anaestheticsTerminology[i].conceptcode
      });
    }

    for (var i = 0; i < this.terminologies.antibioticTerminology.length; i++) {
      this.antibiotics.push({
        label: this.terminologies.antibioticTerminology[i].conceptname,
        value: this.terminologies.antibioticTerminology[i].conceptcode
      });
    }
  }

  // checkbox change events:



  onAnaestheticChange(inputValue: string) {
    if (inputValue == "Epidural") {
      if (this.VManaesthetic.anaestheticEpiduralonly) {

        this.VManaesthetic.anaestheticEpiduralonly = true;


        this.metaAnaesthetic
        let epiduralObject = new CoreOperationAnaesthetic();
        epiduralObject.operationanaesthetic_id = uuidv4();
        epiduralObject.operation_id = this.Operation.operation_id;
        epiduralObject.anaesthetic_id = this.metaAnaesthetic.find(x => x.code == "Epidural").anaesthetic_id;
        this.Operation.operationanaesthetic.push(epiduralObject);
      }
      else {
        this.VManaesthetic.anaestheticEpiduralonly = false;
        this.Operation.operationanaesthetic = this.Operation.operationanaesthetic.filter(obj => obj.anaesthetic_id !== this.metaAnaesthetic.find(x => x.code == "Epidural").anaesthetic_id);
      }

    }
    else if (inputValue == "LA") {

      if (this.VManaesthetic.anaestheticLAonly) {


        this.VManaesthetic.anaestheticLAonly = true;


        let laObject = new CoreOperationAnaesthetic();

        laObject.operationanaesthetic_id = uuidv4();
        laObject.operation_id = this.Operation.operation_id;
        laObject.anaesthetic_id = this.metaAnaesthetic.find(x => x.code == "LA").anaesthetic_id;
        this.Operation.operationanaesthetic.push(laObject);

      }
      else {
        this.VManaesthetic.anaestheticLAonly = false;
        this.Operation.operationanaesthetic = this.Operation.operationanaesthetic.filter(obj => obj.anaesthetic_id !== this.metaAnaesthetic.find(x => x.code == "LA").anaesthetic_id);
      }

    }
    else if (inputValue == "GA") {
      if (this.VManaesthetic.anaestheticGA) {
        this.VManaesthetic.anaestheticGA = true;


        let gaEpiduralObject = new CoreOperationAnaesthetic();
        gaEpiduralObject.operationanaesthetic_id = uuidv4();
        gaEpiduralObject.operation_id = this.Operation.operation_id;
        gaEpiduralObject.anaesthetic_id = this.metaAnaesthetic.find(x => x.code == "GA").anaesthetic_id;
        this.Operation.operationanaesthetic.push(gaEpiduralObject);
      }

      else {
        this.VManaesthetic.anaestheticGA = false;
        this.Operation.operationanaesthetic = this.Operation.operationanaesthetic.filter(obj => obj.anaesthetic_id !== this.metaAnaesthetic.find(x => x.code == "GA").anaesthetic_id);
      }


    }
    else if (inputValue == "Regional block") {
      if (this.VManaesthetic.anaestheticRegionalblock) {
        this.VManaesthetic.anaestheticRegionalblock = true;

        let gaEpiduralObject = new CoreOperationAnaesthetic();
        gaEpiduralObject.operationanaesthetic_id = uuidv4();
        gaEpiduralObject.operation_id = this.Operation.operation_id;
        gaEpiduralObject.anaesthetic_id = this.metaAnaesthetic.find(x => x.code == "Regional block").anaesthetic_id;
        this.Operation.operationanaesthetic.push(gaEpiduralObject);
      }

      else {
        this.VManaesthetic.anaestheticRegionalblock = false;
        this.Operation.operationanaesthetic = this.Operation.operationanaesthetic.filter(obj => obj.anaesthetic_id !== this.metaAnaesthetic.find(x => x.code == "Regional block").anaesthetic_id);
      }

    }
    else if (inputValue == "Spinal") {
      if (this.VManaesthetic.anaestheticSpinal) {
        this.VManaesthetic.anaestheticSpinal = true;

        let spinalAnesthetic = new CoreOperationAnaesthetic();
        spinalAnesthetic.operationanaesthetic_id = uuidv4();
        spinalAnesthetic.operation_id = this.Operation.operation_id;
        spinalAnesthetic.anaesthetic_id = this.metaAnaesthetic.find(x => x.code == "Spinal").anaesthetic_id

        this.Operation.operationanaesthetic.push(spinalAnesthetic);
      }
      else {
        this.VManaesthetic.anaestheticSpinal = false;
        this.Operation.operationanaesthetic = this.Operation.operationanaesthetic.filter(obj => obj.anaesthetic_id !== this.metaAnaesthetic.find(x => x.code == "Spinal").anaesthetic_id);
      }
    }
    else if (inputValue == "Other") {
      if (this.VManaesthetic.anaestheticOther) {
        this.VManaesthetic.anaestheticOther=true;

        let Other = new CoreOperationAnaesthetic();
        Other.operationanaesthetic_id = uuidv4();
        Other.operation_id = this.Operation.operation_id;
        Other.anaestheticnotes = this.VManaesthetic.notes;
        Other.anaesthetic_id = this.metaAnaesthetic.find(x => x.code == "Other").anaesthetic_id;
        this.Operation.operationanaesthetic.push(Other);

      }

      else {
        this.VManaesthetic.anaestheticOther=false;
        this.Operation.operationanaesthetic = this.Operation.operationanaesthetic.filter(obj => obj.anaesthetic_id !== this.metaAnaesthetic.find(x => x.code == "Other").anaesthetic_id);
      }

    }



    // this.operationPreparation.anaesthetictext = this.anaesthetics.find(x => x.value == event.value).label;
  }
  anaesthetiNoteChange() {
    let otherObject = this.Operation.operationanaesthetic.find(x => x.anaesthetic_id == this.metaAnaesthetic.find(x => x.code == "Other").anaesthetic_id)
    otherObject.anaestheticnotes = this.VManaesthetic.notes;
  }
  onAntibioticsChange(inputValue: any) {
    
    if (inputValue == "Metronidazole") {
      if (this.VMantibiotics.metronidazole) {
        let NoneObject = new CoreOperationantibiotics();
        NoneObject.operationantibiotics_id = uuidv4();
        NoneObject.operation_id = this.Operation.operation_id;
        NoneObject.antibioticsnote = "";
        NoneObject.antibiotics_id = this.metantibiotics.find(x => x.code == "Metronidazole").antibiotics_id;
        this.Operation.operationantibiotics.push(NoneObject);
      }
      else {
        this.Operation.operationantibiotics = this.Operation.operationantibiotics.filter(obj => obj.antibiotics_id !== this.metantibiotics.find(x => x.code == "Metronidazole").antibiotics_id);

      }
    }
    if (inputValue == "Teicoplanin") {
      if (this.VMantibiotics.teicoplanin) {
        let antibioticsObject = new CoreOperationantibiotics();
        antibioticsObject.operationantibiotics_id = uuidv4();
        antibioticsObject.operation_id = this.Operation.operation_id;
        antibioticsObject.antibioticsnote = "";
        antibioticsObject.antibiotics_id = this.metantibiotics.find(x => x.code == "Teicoplanin").antibiotics_id;
        this.Operation.operationantibiotics.push(antibioticsObject);
      }
      else {
        this.Operation.operationantibiotics = this.Operation.operationantibiotics.filter(obj => obj.antibiotics_id !== this.metantibiotics.find(x => x.code == "Teicoplanin").antibiotics_id);
      }
    }
    if (inputValue == "Gentamicin") {
      if (this.VMantibiotics.gentamicin) {
        let antibioticsObject = new CoreOperationantibiotics();
        antibioticsObject.operationantibiotics_id = uuidv4();
        antibioticsObject.operation_id = this.Operation.operation_id;
        antibioticsObject.antibioticsnote = "";
        antibioticsObject.antibiotics_id = this.metantibiotics.find(x => x.code == "Gentamicin").antibiotics_id;
        this.Operation.operationantibiotics.push(antibioticsObject);
      }
      else {
        this.Operation.operationantibiotics = this.Operation.operationantibiotics.filter(obj => obj.antibiotics_id !== this.metantibiotics.find(x => x.code == "Gentamicin").antibiotics_id);

      }
    }
    if (inputValue == "Flucloxacillin") {
      if (this.VMantibiotics.flucloxacillin) {
        let antibioticsObject = new CoreOperationantibiotics();
        antibioticsObject.operationantibiotics_id = uuidv4();
        antibioticsObject.operation_id = this.Operation.operation_id;
        antibioticsObject.antibioticsnote = "";
        antibioticsObject.antibiotics_id = this.metantibiotics.find(x => x.code == "Flucloxacillin").antibiotics_id;
        this.Operation.operationantibiotics.push(antibioticsObject);
      }
      else {
        this.Operation.operationantibiotics = this.Operation.operationantibiotics.filter(obj => obj.antibiotics_id !== this.metantibiotics.find(x => x.code == "Flucloxacillin").antibiotics_id);

      }
    }
    if (inputValue == "Other") {
      if (this.VMantibiotics.other) {
        let antibioticsObject = new CoreOperationantibiotics();
        antibioticsObject.operationantibiotics_id = uuidv4();
        antibioticsObject.operation_id = this.Operation.operation_id;
        antibioticsObject.antibioticsnote = this.VMantibiotics.notes;
        antibioticsObject.antibiotics_id = this.metantibiotics.find(x => x.code == "Other").antibiotics_id;
        this.Operation.operationantibiotics.push(antibioticsObject);
      }
      else {
        this.Operation.operationantibiotics = this.Operation.operationantibiotics.filter(obj => obj.antibiotics_id !== this.metantibiotics.find(x => x.code == "Other").antibiotics_id);

      }
    }
    // this.operationPreparation.antibioticsatinductiontext = this.antibiotics.find(x => x.value == event.value).label;
  }
  antibioticsNoteChange() {
    let otherObject = this.Operation.operationantibiotics.find(x => x.antibiotics_id == this.metantibiotics.find(x => x.code == "Other").antibiotics_id)
    otherObject.antibioticsnote = this.VMantibiotics.notes;
  }
  tourniquetChange() {
    this.operationPreparation.torniquettime = null;
    this.operationPreparation.torniquetpressure = null;
    this.operationPreparation.torniquettext = "";
  }
  antibioticsLebel() {
    let label= "";
    if(this.VMantibiotics.teicoplanin) {
      label = label + "Teicoplanin, ";
    }
    if(this.VMantibiotics.gentamicin) {
      label = label + "Gentamicin, ";
    }
    if(this.VMantibiotics.metronidazole) {
      label = label + "Metronidazole, ";
    }
    if(this.VMantibiotics.flucloxacillin) {
      label = label + "Flucloxacillin, ";
    }
    if(this.VMantibiotics.other) {
      label = label + "Other, ";
    }
   return label.slice(0, -2);
  }

  anaestheticLabel() {
    let label= "";
    if(this.VManaesthetic.anaestheticGA) {
      label = label + "GA, ";
    }
    if(this.VManaesthetic.anaestheticEpiduralonly) {
      label = label + "Epidural, ";
    }
    if(this.VManaesthetic.anaestheticLAonly) {
      label = label + "LA, ";
    }
    if(this.VManaesthetic.anaestheticRegionalblock) {
      label = label + "Regional block, ";
    }
    if(this.VManaesthetic.anaestheticSpinal) {
      label = label + "Spinal, ";
    }
    if(this.VManaesthetic.anaestheticOther) {
      label = label + "Other, ";
    }
   return label.slice(0, -2);
  }
}
