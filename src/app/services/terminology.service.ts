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
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { CoreOperation } from '../models/entities/core-operation.model';
import { SnomedConcept } from '../models/snomed-concept.model';
import { TerminologyConcept } from '../models/terminology-concept.model';
import { ApirequestService } from './apirequest.service';
import { EndpointsService } from './endpoints.service';

@Injectable()
export class TerminologyService implements OnDestroy {

  public findingTerminology: SnomedConcept[];
  public indicationTerminology: TerminologyConcept[];
  public anaestheticsTerminology: TerminologyConcept[];
  public positionTerminology: TerminologyConcept[];
  public antibioticTerminology: TerminologyConcept[];
  public skinPrepTerminology: TerminologyConcept[];
  public skinIncisionTerminology: TerminologyConcept[];
  public structureTerminology: SnomedConcept[];
  public problemTerminology: TerminologyConcept[];
  public surgnMrgnAssessmntTerminology: TerminologyConcept[];
  public affectedHowTerminology: SnomedConcept[];
  public fluidLossTerminology: SnomedConcept[];
  public deepClosureTerminology: TerminologyConcept[];
  public skinClosureTerminology: TerminologyConcept[];
  public repairedWithTerminology: TerminologyConcept[];
  public dressingTerminology: TerminologyConcept[];
  public unitsTerminology: TerminologyConcept[];
  public weightBearingStatusTerminology: TerminologyConcept[];
  public diagnosisTerminology: TerminologyConcept[];
  public procedureTerminology: TerminologyConcept[];
  public positionMeta=[];
  public weightBearingMeta=[];
  isTerminologyLoaded: boolean;

  constructor(private apiRequest: ApirequestService,
    private endpoints: EndpointsService) {
    this.isTerminologyLoaded = false;

    this.findingTerminology = [];
    this.indicationTerminology = [];
    this.anaestheticsTerminology = [];
    this.positionTerminology = [];
    this.antibioticTerminology = [];
    this.skinPrepTerminology = [];
    this.skinIncisionTerminology = [];
    this.structureTerminology = [];
    this.problemTerminology = [];
    this.surgnMrgnAssessmntTerminology = [];
    this.affectedHowTerminology = [];
    this.fluidLossTerminology = [];
    this.deepClosureTerminology = [];
    this.skinClosureTerminology = [];
    this.repairedWithTerminology = [];
    this.dressingTerminology = [];
    this.unitsTerminology = [];
    this.weightBearingStatusTerminology = [];
    this.diagnosisTerminology = [];
    this.procedureTerminology = [];
  }

  async initTerminologies() {
    if (!this.isTerminologyLoaded) {
      var terminologies = await forkJoin(
        //this.apiRequest.getRequest(this.endpoints.terminologyFindingUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyIndicationUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyAnaestheticUrl),
        this.apiRequest.getRequest(this.endpoints.metaPositioningUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyAntibioticUrl),
        this.apiRequest.getRequest(this.endpoints.terminologySkinPreparationUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologySkinIncisionUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyBodyStructureUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyProblemsUrl),
        this.apiRequest.getRequest(this.endpoints.terminologyMarginAssessmentsUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyBodyStructureAffectedAsUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyBodyFluidsUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyDeepClosureUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologySkinClosureUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologySkinRepairedWithUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyDressingsUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyVolumeUnitUrl),
        this.apiRequest.getRequest(this.endpoints.metaWeightBearingStatusUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyDiagnosisUrl),
        //this.apiRequest.getRequest(this.endpoints.terminologyProcedureUrl)
      ).toPromise();

      //this.findingTerminology = JSON.parse(terminologies[0]);
      //this.indicationTerminology = JSON.parse(terminologies[1]);
      //this.anaestheticsTerminology = JSON.parse(terminologies[0]);
      this.positionMeta = JSON.parse(terminologies[0]);
      //this.antibioticTerminology = JSON.parse(terminologies[2]);
      this.skinPrepTerminology = JSON.parse(terminologies[1]);
      //this.skinIncisionTerminology = JSON.parse(terminologies[6]);
      //this.structureTerminology = JSON.parse(terminologies[7]);
      //this.problemTerminology = JSON.parse(terminologies[8]);
      this.surgnMrgnAssessmntTerminology = JSON.parse(terminologies[2]);
      //this.affectedHowTerminology = JSON.parse(terminologies[10]);
      //this.fluidLossTerminology = JSON.parse(terminologies[11]);
      //this.deepClosureTerminology = JSON.parse(terminologies[12]);
      //this.skinClosureTerminology = JSON.parse(terminologies[13]);
      //this.repairedWithTerminology = JSON.parse(terminologies[14]);
      //this.dressingTerminology = JSON.parse(terminologies[15]);
      //this.unitsTerminology = JSON.parse(terminologies[16]);
      this.weightBearingMeta = JSON.parse(terminologies[3]);
      //this.diagnosisTerminology = JSON.parse(terminologies[18]);
      //this.procedureTerminology = JSON.parse(terminologies[19]);
      this.isTerminologyLoaded = true;
    }
  }

  ngOnDestroy() { }
}