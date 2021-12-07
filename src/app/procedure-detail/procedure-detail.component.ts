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
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SubjectsService } from '../services/subjects.service';
import { TerminologyConcept } from '../models/terminology-concept.model';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AutoComplete } from 'primeng/autocomplete';
import { SnomedConcept } from '../models/snomed-concept.model';
import { v4 as uuidv4 } from 'uuid';
import { CoreIndication } from '../models/entities/core-indication.model';
import { CoreProcedureFinding } from '../models/entities/core-procedure-finding.model';
import { CoreProblem } from '../models/entities/core-problem.model';
import { CoreProcedure } from '../models/entities/core-procedure.model';
import { ProcedureImplantComponent } from '../procedure-implant/procedure-implant.component';
import { ProcedureProviderComponent } from '../procedure-provider/procedure-provider.component';
import { AppService } from '../services/app.service';
import { DatePipe } from '@angular/common';
import { TerminologyService } from '../services/terminology.service';
import { CoreProcedureStructureAffected } from '../models/entities/core-procedure-structure-affected.model';
import { CoreProcedureFluidLoss } from '../models/entities/core-procedure-fluid-loss.model';
import { CoreProcedureDetail } from '../models/entities/core-procedure-detail.model';
import { CoreProcedureDrains } from '../models/entities/core-procedure-drains.model';
import { SNOMED } from '../models/snomed.model';
import { ApirequestService } from '../services/apirequest.service';
import AppConfig from "src/assets/config/operation-note.config.json"

@Component({
    selector: 'app-procedure-detail',
    templateUrl: './procedure-detail.component.html',
    styleUrls: ['./procedure-detail.component.css']
})

export class ProcedureDetailComponent implements OnInit {

    subscriptions: Subscription = new Subscription();

    procedure: CoreProcedure;

    equipmentList: string;

    Indications = AppConfig.Indications;

    @Input() procedureNo: number;
    @Input() set isSubmit(isSubmitted:boolean) {
        this.isSubmitted = isSubmitted;
    }
    @Input() set operationProcedure(proc: CoreProcedure) {
         
        this.assignTerminologyData();
        this.procedure = proc;        

        this.procedure.proceduredetail = this.procedure.proceduredetail == null ? new CoreProcedureDetail() : this.procedure.proceduredetail;
        this.procedure.proceduredetail.proceduredetail_id = this.procedure.procedure_id;
        this.procedure.proceduredetail.procedure_id = this.procedure.procedure_id;

        this.procedure.indications = this.procedure.indications == null ? [] : this.procedure.indications;
        this.procedure.procedurefindings = this.procedure.procedurefindings == null ? [] : this.procedure.procedurefindings;
        this.procedure.problems = this.procedure.problems == null ? [] : this.procedure.problems;

        this.procedure.proceduredetail.otherindication = this.procedure.proceduredetail.otherindication;
        this.procedure.proceduredetail.otherindicationnotes = this.procedure.proceduredetail.otherindicationnotes;

        this.opIndications = [];

        let drain: CoreProcedureDrains = new CoreProcedureDrains();
        drain.proceduredrains_id = uuidv4(); 
        drain.procedure_id = this.procedure.procedure_id;
        drain.drainlabel = "";        
        if(this.procedure.proceduredrains.length==0) {
            //this.procedure.proceduredrains.push(drain);           
        } else {
            var len = this.procedure.proceduredrains.length-1;
            if(this.procedure.proceduredrains[len].drainlabel!="" || this.procedure.proceduredrains[len].drainplacement || this.procedure.proceduredrains[len].drainwhentoremove || this.procedure.proceduredrains[len].suction || this.procedure.proceduredrains[len].freedrainage){                                
                //this.procedure.proceduredrains.push(drain);
            }  
        }
        for(var i = 0; i < this.procedure.indications.length; i++)
        {
            let indication: SNOMED = new SNOMED();
            indication.code = this.procedure.indications[i].code;
            indication.term = this.procedure.indications[i].name;

            this.opIndications.push(indication); 
        }

        this.opFindings = [];

        for(var i = 0; i < this.procedure.procedurefindings.length; i++)
        {
            let finding: SNOMED = new SNOMED();
            finding.code = this.procedure.procedurefindings[i].findingcode;
            finding.term = this.procedure.procedurefindings[i].findingtext;

            this.opFindings.push(finding); 
        }

        this.opProblems = [];

        for(var i = 0; i < this.procedure.problems.length; i++)
        {
            let problem: SNOMED = new SNOMED();
            problem.code = this.procedure.problems[i].problemcode;
            problem.term = this.procedure.problems[i].problemtext;

            this.opProblems.push(problem); 
        }
        //this.initProcedureDetail();

        // if (this.procedure.proceduredetail && this.procedure.proceduredetail.deepclosurecode != null) {
        //     this.deepClosure = this.terminologies.deepClosureTerminology.filter(x => x.conceptcode == this.procedure.proceduredetail.deepclosurecode)[0];
        // }
        // else if (this.procedure.proceduredetail && this.procedure.proceduredetail.deepclosuretext != null) {
        //     this.deepClosure = {
        //         conceptcode: null,
        //         conceptname: this.procedure.proceduredetail.deepclosuretext,
        //         concept_id: null
        //     };
        // }
        // else {
        //     this.deepClosure = new TerminologyConcept();
        // }

        // if (this.procedure.proceduredetail && this.procedure.proceduredetail.skinclosurecode != null) {
        //     this.skinClosure = this.terminologies.skinClosureTerminology.filter(x => x.conceptcode == this.procedure.proceduredetail.skinclosurecode)[0];
        // }
        // else if (this.procedure.proceduredetail && this.procedure.proceduredetail.skinclosuretext != null) {
        //     this.skinClosure = { conceptcode: null, conceptname: this.procedure.proceduredetail.skinclosuretext, concept_id: null };
        // }
        // else {
        //     this.skinClosure = new TerminologyConcept();
        // }

        // if (this.procedure.proceduredetail && this.procedure.proceduredetail.skinrepairedwithcode != null) {
        //     this.repairWith = this.terminologies.repairedWithTerminology.filter(x => x.conceptcode == this.procedure.proceduredetail.skinrepairedwithcode)[0];
        // }
        // else if (this.procedure.proceduredetail && this.procedure.proceduredetail.skinrepairedwithtext != null) {
        //     this.repairWith = { conceptcode: null, conceptname: this.procedure.proceduredetail.skinrepairedwithtext, concept_id: null };
        // }
        // else {
        //     this.repairWith = new TerminologyConcept();
        // }
    }

    datePipe = new DatePipe('en-GB');

    otherConcept: TerminologyConcept = {
        concept_id: 9177,
        conceptcode: "74964007",
        conceptname: "Other"
    }

    //procedures: CoreProcedure[] = [];

    @ViewChild('findingautocomplete') facs: AutoComplete;

    @ViewChild('structureautocomplete') sacs: AutoComplete;

    @ViewChild('problemautocomplete') pacs: AutoComplete;

    @ViewChild('indicationautocomplete') iacs: AutoComplete;

    @ViewChild('fluidlossautocomplete') flacs: AutoComplete;

    @ViewChild('opImplantComponents') opImplantComponents: ProcedureImplantComponent;

    @ViewChild('procProviderComponents') procProviderComponents: ProcedureProviderComponent;

    @ViewChild('closeDeleteConfirm') closeDeleteConfirmModalButton: ElementRef;

    //resultProblems: TerminologyConcept[];
    resultProblems: SNOMED[] = [];

    opProblems: SNOMED[] = [];

    resultStructures: SnomedConcept[];

    //resultFindings: SnomedConcept[];
    resultFindings: SNOMED[] = [];

    opFindings: SNOMED[] = [];

    //resultIndications: TerminologyConcept[];
    resultIndications: SNOMED[] = [];

    opIndications: SNOMED[] = [];

    selectedAnaesthetic: string;

    positioning: SelectItem[] = [];

    skinPreps: SelectItem[] = [];

    skinIncisions: SelectItem[] = [];

    surgnMrgnAssessmnts: SelectItem[] = [];

    affectedHows: SelectItem[] = [];

    dressings: SelectItem[] = [];

    units: SelectItem[] = [];

    resultFluidLosses: SnomedConcept[];

    resultDeepClosures: TerminologyConcept[];

    resultSkinClosures: TerminologyConcept[];

    resultRepairedWiths: TerminologyConcept[];

    deepClosure: TerminologyConcept;

    skinClosure: TerminologyConcept;

    repairWith: TerminologyConcept;

    isViewPDF: boolean = false;
    isSubmitted : boolean = false;
    constructor(private subjects: SubjectsService,
        public appService: AppService,
        private confirmationService: ConfirmationService,
        private terminologies: TerminologyService,
        private apiRequest: ApirequestService) {

        this.subscriptions.add(
            this.subjects.isViewPDF.subscribe((isViewPDF: boolean) => {
                this.isViewPDF = isViewPDF;    
            })
        );
       
    }    

    equipmentLabel() {
        let equipmentList = "";

        if (this.procedure.proceduredetail.armtable) {
            equipmentList += "Arm table, ";
        }
        if (this.procedure.proceduredetail.beanbag) {
            equipmentList += "Bean bag, ";
        }
        if (this.procedure.proceduredetail.beachchair) {
            equipmentList += "Beach chair, ";
        }
        if (this.procedure.proceduredetail.jacksontable) {
            equipmentList += "Jackson table, ";
        }
        if (this.procedure.proceduredetail.sidesupport) {
            equipmentList += "Side Support, ";
        }
        if (this.procedure.proceduredetail.footsupport) {
            equipmentList += "Foot Support, ";
        }
        if (this.procedure.proceduredetail.equipmentother) {
            equipmentList += "Other, ";
        }
        
        return equipmentList.slice(0, -2);
    }

    loadPositioning() {
        this.subscriptions.add(
          this.apiRequest.getRequest(AppConfig.uris.dynamicApiUri + AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetMetaPositioning").url).subscribe(
            (data: any) => {
              var positionData = JSON.parse(data);
              for (var i = 0; i < positionData.length; i++) {
                this.positioning.push({
                    label: positionData[i].text,
                    value: positionData[i].code
                });
            }
            }
          ))
    
   }
    assignTerminologyData() {
        for (var i = 0; i < this.terminologies.positionMeta.length; i++) {
            this.positioning.push({
                label: this.terminologies.positionMeta[i].text,
                value: this.terminologies.positionMeta[i].code
            });
        }
        
        for (var i = 0; i < this.terminologies.skinPrepTerminology.length; i++) {
            this.skinPreps.push({
                label: this.terminologies.skinPrepTerminology[i].conceptname,
                value: this.terminologies.skinPrepTerminology[i].conceptcode
            });
        }

        for (var i = 0; i < this.terminologies.skinIncisionTerminology.length; i++) {
            this.skinIncisions.push({
                label: this.terminologies.skinIncisionTerminology[i].conceptname,
                value: this.terminologies.skinIncisionTerminology[i].conceptcode
            });
        }

        for (var i = 0; i < this.terminologies.surgnMrgnAssessmntTerminology.length; i++) {
            this.surgnMrgnAssessmnts.push({
                label: this.terminologies.surgnMrgnAssessmntTerminology[i].conceptname,
                value: this.terminologies.surgnMrgnAssessmntTerminology[i].conceptcode
            });
        }

        for (var i = 0; i < this.terminologies.affectedHowTerminology.length; i++) {
            this.affectedHows.push({
                label: this.terminologies.affectedHowTerminology[i].target_concept_name,
                value: this.terminologies.affectedHowTerminology[i].target_concept_code
            });
        }

        for (var i = 0; i < this.terminologies.dressingTerminology.length; i++) {
            this.dressings.push({
                label: this.terminologies.dressingTerminology[i].conceptname,
                value: this.terminologies.dressingTerminology[i].conceptcode
            });
        }

        for (var i = 0; i < this.terminologies.unitsTerminology.length; i++) {
            this.units.push({
                label: this.terminologies.unitsTerminology[i].conceptname,
                value: this.terminologies.unitsTerminology[i].conceptcode
            });
        }
    }

    ngOnInit() {
    }

    searchFinding(event) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.terminologyBaseURI.replace("VALUE", event.query + "/finding?api-version=1.0"))
            .subscribe((response) => {
                let resultsFromDb:SNOMED[] = [];
                response.data.forEach((item)=>{
                    let snomedData: SNOMED = new SNOMED();
                    snomedData.code = item.code;
                    snomedData.fsn = item.fsn;
                    snomedData.level = item.level;
                    snomedData.parentCode = item.parentCode;
                    snomedData.term = item.term;
                    resultsFromDb.push(snomedData);
                })
                if (resultsFromDb.length == 0) {
                    let concept: SNOMED = new SNOMED();
                    concept.code = this.otherConcept.conceptcode;
                    concept.term = event.query + ' (Other)';
                            
                    resultsFromDb.push(concept);
                }
                this.resultFindings = resultsFromDb;
            })
        );

        
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    selectFinding(event) {
        let addedFindings = [];

        if (event.code == this.otherConcept.conceptcode) {
            addedFindings = this.procedure.procedurefindings.filter(x =>
                (x.findingtext.toLowerCase().replace(/ /g, '') == event.term.toLowerCase().replace(/ /g, '')));
        }
        else {
            addedFindings = this.procedure.procedurefindings.filter(x => x.findingcode == event.code);
        }

        if (addedFindings.length == 0) {
            let finding: CoreProcedureFinding = new CoreProcedureFinding();
            finding.procedurefinding_id = uuidv4();
            finding.findingcode = event.code;
            finding.findingtext = event.term;
            finding.procedure_id = this.procedure.procedure_id;
            //finding._terminology = event.terminology;

            this.procedure.procedurefindings.push(finding);
        }
    }

    unSelectFinding(event) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this finding?',
            accept: () => {
                for (var i = 0; i < this.procedure.procedurefindings.length; i++) {
                    if (this.procedure.procedurefindings[i].findingtext === event.term) {
                        this.procedure.procedurefindings.splice(i, 1);
                        i--;
                    }
                }
            },
            reject: () => {
                this.facs.selectItem(event);
            }
        });
    }

    searchStructure(event) {
        let regex = new RegExp(event.query, 'gi');
        this.resultStructures = this.terminologies.structureTerminology.filter(x => (x.target_concept_name).match(regex));
    }

    selectStructure(event) {
        var addedStructures = this.procedure.procedurestructuresaffected.filter(x => x.structuretext == event.target_concept_name);
        if (addedStructures.length == 0) {
            let structure: CoreProcedureStructureAffected = new CoreProcedureStructureAffected();
            structure.procedurestructureaffected_id = uuidv4();
            structure.structurecode = event.target_concept_code;
            structure.structuretext = event.target_concept_name;
            structure.actioncode = null;
            structure.actiontext = null;
            structure.additionalcomments = null;
            structure.procedure_id = this.procedure.procedure_id;

            this.procedure.procedurestructuresaffected.push(structure);
        }
    }

    unSelectStructure(event) {
        for (var i = 0; i < this.procedure.procedurestructuresaffected.length; i++) {
            if (this.procedure.procedurestructuresaffected[i].structuretext === event.structuretext) {
                this.procedure.procedurestructuresaffected.splice(i, 1);
                i--;
            }
        }
    }

    removeStructure(structure: CoreProcedureStructureAffected) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete the structure affected record?',
            accept: () => {
                var item = document.getElementById(structure.structurecode + '|' + this.procedure.code);
                if (item != undefined) {
                    this.sacs.removeItem(item.parentElement);
                }
                this.sacs.onUnselect.emit(structure);
            }
        });
    }

    searchProblem(event) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.terminologyBaseURI.replace("VALUE", event.query + "/disorder?api-version=1.0"))
            .subscribe((response) => {
                let resultsFromDb:SNOMED[] = [];
                response.data.forEach((item)=>{
                    let snomedData: SNOMED = new SNOMED();
                    snomedData.code = item.code;
                    snomedData.fsn = item.fsn;
                    snomedData.level = item.level;
                    snomedData.parentCode = item.parentCode;
                    snomedData.term = item.term;
                    resultsFromDb.push(snomedData);
                })
                if (resultsFromDb.length == 0) {
                    let concept: SNOMED = new SNOMED();
                    concept.code = this.otherConcept.conceptcode;
                    concept.term = event.query + ' (Other)';
                            
                    resultsFromDb.push(concept);
                }
                this.resultProblems = resultsFromDb;
            })
        );
    }

    selectProblem(event) {
        let addedProblems = [];

        if (event.code != this.otherConcept.conceptcode) {
            addedProblems = this.procedure.problems.filter(x => x.problemcode == event.code);
        }
        else if (event.code == this.otherConcept.conceptcode) {
            addedProblems = this.procedure.problems.filter(x =>
                (x.problemtext.toLowerCase().replace(/ /g, '') == event.term.toLowerCase().replace(/ /g, '')));
        }

        if (addedProblems.length == 0) {
            let problem: CoreProblem = new CoreProblem();
            problem.problem_id = uuidv4();
            problem.problemcode = event.code;
            problem.problemtext = event.term;
            problem.procedure_id = this.procedure.procedure_id;
            //problem._terminology = event.terminology;            

            this.procedure.problems.push(problem);
        }
    }

    unSelectProblem(event) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this problem?',
            accept: () => {
                for (var i = 0; i < this.procedure.problems.length; i++) {
                    if (this.procedure.problems[i].problemtext === event.term) {
                        this.procedure.problems.splice(i, 1);
                        i--;
                    }
                }
            },
            reject: () => {
                this.pacs.selectItem(event);
            }
        });
        
    }

    searchIndication(event) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.terminologyBaseURI.replace("VALUE", event.query + "/disorder?api-version=1.0"))
            .subscribe((response) => {
                let resultsFromDb:SNOMED[] = [];
                response.data.forEach((item)=>{
                    let snomedData: SNOMED = new SNOMED();
                    snomedData.code = item.code;
                    snomedData.fsn = item.fsn;
                    snomedData.level = item.level;
                    snomedData.parentCode = item.parentCode;
                    snomedData.term = item.term;
                    resultsFromDb.push(snomedData);
                })
                if (resultsFromDb.length == 0) {
                    let concept: SNOMED = new SNOMED();
                    concept.code = this.otherConcept.conceptcode;
                    concept.term = event.query + ' (Other)';
                            
                    resultsFromDb.push(concept);
                }
                this.resultIndications = resultsFromDb;
            })
        );
    }

    selectIndication(event) {
        let addedIndications = [];
        if (event.code != this.otherConcept.conceptcode) {
            addedIndications = this.procedure.indications.filter(x => x.code == event.code);
        }
        else if (event.code == this.otherConcept.conceptcode) {
            addedIndications = this.procedure.indications.filter(x =>
                (x.name.toLowerCase().replace(/ /g, '') == event.term.toLowerCase().replace(/ /g, '')));
        }

        if (addedIndications.length == 0) {
            let indication: CoreIndication = new CoreIndication();
            indication.indication_id = uuidv4();
            indication.name = event.term;
            indication.code = event.code;
            indication.procedure_id = this.procedure.procedure_id;
            //indication._terminology = event.terminology;
            
            this.procedure.indications.push(indication);
        }
    }

    unSelectIndication(event) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this indication?',
            accept: () => {
                for (var i = 0; i < this.procedure.indications.length; i++) {
                    if (this.procedure.indications[i].name === event.term) {
                        this.procedure.indications.splice(i, 1);
                        i--;
                    }
                }
            },
            reject: () => {
                this.iacs.selectItem(event);
            }
        });
    }

    searchFluidLoss(event) {
        let regex = new RegExp(event.query, 'gi');
        this.resultFluidLosses = this.terminologies.fluidLossTerminology.filter(x => (x.target_concept_name).match(regex));
    }

    selectFluidLoss(event: SnomedConcept) {
        var addedFluidLosses = this.procedure.procedurefluidloss.filter(x => x.componentcode == event.target_concept_code);
        if (addedFluidLosses.length == 0) {
            let fluid: CoreProcedureFluidLoss = new CoreProcedureFluidLoss();
            fluid.procedurefluidloss_id = uuidv4();
            fluid.componentcode = event.target_concept_code;
            fluid.componenttext = event.target_concept_name;
            fluid.unitcode = null;
            fluid.unittext = null;
            fluid.procedure_id = this.procedure.procedure_id;
            fluid.quantity = null;

            this.procedure.procedurefluidloss.push(fluid);
        }
    }

    unSelectFluidLoss(event) {
        for (var i = 0; i < this.procedure.procedurefluidloss.length; i++) {
            if (this.procedure.procedurefluidloss[i].componenttext === event.componenttext) {
                this.procedure.procedurefluidloss.splice(i, 1);
                i--;
            }
        }
    }

    removeFluidLoss(fluidLoss: CoreProcedureFluidLoss) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete the fluid loss record?',
            accept: () => {
                var item = document.getElementById(fluidLoss.componentcode + '|' + this.procedure.code);
                if (item != undefined) {
                    this.flacs.removeItem(item.parentElement);
                }
                this.flacs.onUnselect.emit(fluidLoss);
            }
        });
    }
     
    suctionFreedrainage($event)
    {                      
        var number = event.target['id'] .split('_')[1];
        if( event.target['id'] ===  this.procedureNo + 'idSuction_' + number) {              
            this.procedure.proceduredrains[number].suction= true;
            this.procedure.proceduredrains[number].freedrainage= false;
        } else {            
            this.procedure.proceduredrains[number].suction= false;
            this.procedure.proceduredrains[number].freedrainage= true;      
        }
    }
    addDrain() {
        let drain: CoreProcedureDrains = new CoreProcedureDrains();
        drain.proceduredrains_id = uuidv4(); 
        drain.procedure_id = this.procedure.procedure_id; 
        drain.drainlabel="";        
        this.procedure.proceduredrains.push(drain);
    }

    removeDrain(drain: CoreProcedureDrains) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to delete the drain record?',
            accept: () => {                
                this.procedure.proceduredrains = this.procedure.proceduredrains.filter(item => item.proceduredrains_id !== drain.proceduredrains_id);
            }
        });
    }
    clearDrainData(index) {
        this.procedure.proceduredrains[index].drainplacement="";
        this.procedure.proceduredrains[index].drainwhentoremove="";
        this.procedure.proceduredrains[index].suction=false;
        this.procedure.proceduredrains[index].freedrainage=false;
    }
    showDrainForPDF() {
         
       return this.procedure.proceduredrains.filter(x=>(x.drainlabel!="" && x.drainlabel!=null) 
       || (x.drainplacement!="" && x.drainplacement!=null)
       || (x.drainwhentoremove!="" && x.drainwhentoremove!=null) || x.freedrainage!=false || x.suction!=false)
    }
    setIntraoperative() {
        if(!this.procedure.proceduredetail.unexpectedintraoperative) {
            this.procedure.proceduredetail.candourthresholdreached = "";
        }
    }
    // searchDeepClosure(event) {
    //     let regex = new RegExp(event.query, 'gi');
    //     this.resultDeepClosures = this.terminologies.deepClosureTerminology.filter(x => (x.conceptname).match(regex));
    // }

    // searchSkinClosure(event) {
    //     let regex = new RegExp(event.query, 'gi');
    //     this.resultSkinClosures = this.terminologies.skinClosureTerminology.filter(x => (x.conceptname).match(regex));
    // }

    // searchRepairedWith(event) {
    //     let regex = new RegExp(event.query, 'gi');
    //     this.resultRepairedWiths = this.terminologies.repairedWithTerminology.filter(x => (x.conceptname).match(regex));
    // }

    // // Autocomplete blur event

    // onDeepClousureBlur(event) {
    //     let value = event.srcElement.value;
    //     let deepClosure = this.terminologies.deepClosureTerminology.find(x => x.conceptname == value);
    //     if(deepClosure != undefined) {
    //         this.procedure.proceduredetail.deepclosurecode = deepClosure.conceptcode;
    //     }
    //     this.procedure.proceduredetail.deepclosuretext = value;
    // }

    // onSkinClousureBlur(event) {
    //     let value = event.srcElement.value;
    //     let skinClosure = this.terminologies.skinClosureTerminology.find(x => x.conceptname == value);
    //     if(skinClosure != undefined) {
    //         this.procedure.proceduredetail.skinclosurecode = skinClosure.conceptcode;
    //     }
    //     this.procedure.proceduredetail.skinclosuretext = value;
    // }

    // onRepairedWithBlur(event) {
    //     let value = event.srcElement.value;
    //     let repairedWith = this.terminologies.repairedWithTerminology.find(x => x.conceptname == value);
    //     if(repairedWith != undefined) {
    //         this.procedure.proceduredetail.skinrepairedwithcode = repairedWith.conceptcode;
    //     }
    //     this.procedure.proceduredetail.skinrepairedwithtext = value;
    // }

    // Dropdown change events:

    onDressingChange(event) {
        this.procedure.proceduredetail.dressingtext = this.dressings.find(x => x.value == event.value).label;
    }

    onSkinPrepChange(event) {
        this.procedure.proceduredetail.skinpreparationtext = this.skinPreps.find(x => x.value == event.value).label;
    }
    showEquipmentOtherText() {
        if(!this.procedure.proceduredetail.equipmentother) {
            this.procedure.proceduredetail.equipmentothertext="";
        }
    }
    onPositioningChange(event) {
        this.procedure.proceduredetail.positioningtext = this.positioning.find(x => x.value == event.value).label;
        if(this.procedure.proceduredetail.positioningtext!="Other") {
            this.procedure.proceduredetail.positioningothertext="";
        }
    }

    onSkinIncisionChange(event) {
        this.procedure.proceduredetail.skinincisionandapproachtext = this.skinIncisions.find(x => x.value == event.value).label;
    }

    onMarginChange(event) {
        this.procedure.proceduredetail.assessmentofmargintext = this.surgnMrgnAssessmnts.find(x => x.value == event.value).label;
    }

    onAffectedHowChange(event, str: CoreProcedureStructureAffected){
        str.actiontext = this.affectedHows.find(x => x.value == event.value).label;
    }

    onUnitsChange(event, fl: CoreProcedureFluidLoss) {
        fl.unittext = this.units.find(x => x.value == event.value).label;
    }

    onIndicationsChange() {
        this.procedure.proceduredetail.otherindication = AppConfig.Indications.find((x: { Name: string }) => x.Name == this.procedure.proceduredetail.otherindication).Id;

        // if(this.procedure.proceduredetail.otherindication != 'Other' && this.procedure.proceduredetail.otherindication != 'Revision arthroplasty: Failure of previous implant')
        // {
        //     this.procedure.proceduredetail.otherindicationnotes = "";
        // }
    }
}
