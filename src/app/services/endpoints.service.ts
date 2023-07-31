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
import { Injectable } from '@angular/core';
import AppConfig from "src/assets/config/operation-note.config.json"

@Injectable({
    providedIn: 'root'
})
export class EndpointsService {

    //Baseviews
    public readonly getProviderUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetProviders").url;

    public readonly procedureProviderUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvProcedureProviders").url;
    
    public readonly operationProviderUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvOperationProviders").url;

    public readonly getOperationUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetOperation").url;

    public readonly getOperationJsonUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvOperationJson").url;

    public readonly getAllOperationsUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvAllOperations").url;


    // Terminology Endpoints
    public readonly terminologyFindingUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationFindings").url
    
    public readonly terminologyIndicationUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyIndications").url

    public readonly terminologyAnaestheticUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyAnaesthetics").url

    public readonly terminologyPositioningUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyPositioning").url

    public readonly metaPositioningUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetMetaPositioning").url

    public readonly metaWeightBearingStatusUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetMetaWeightBearingStatus").url   

    public readonly terminologyAntibioticUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationAntibiotics").url

    public readonly terminologySkinPreparationUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationSkinPreparation").url
    
    public readonly terminologySkinIncisionUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationSkinIncision").url

    public readonly terminologyBodyStructureUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationBodyStructure").url

    public readonly terminologyProblemsUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationProblems").url

    public readonly terminologyMarginAssessmentsUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationMarginAssessments").url

    public readonly terminologyBodyStructureAffectedAsUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationBodyStructureAffectedAs").url
    
    public readonly terminologyBodyFluidsUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationBodyFluids").url

    public readonly terminologyDeepClosureUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationDeepClosure").url

    public readonly terminologySkinClosureUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationSkinClosure").url

    public readonly terminologySkinRepairedWithUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationSkinRepairedWith").url

    public readonly terminologyDressingsUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationDressings").url

    public readonly terminologyVolumeUnitUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationVolumeUnit").url

    public readonly terminologyWeightBearingStatusUrl: string = AppConfig.uris.dynamicApiUri + 
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyOperationWeightBearingStatus").url

    public readonly terminologyDiagnosisUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyDiagnoses").url

    public readonly terminologyProcedureUrl = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvTerminologyProcedures").url;
}