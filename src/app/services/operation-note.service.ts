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
/* Interneuron Observation App
Copyright(C) 2019  Interneuron CIC
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */

import { Injectable } from '@angular/core';
import AppConfig from "src/assets/config/operation-note.config.json";
import { ApirequestService } from './apirequest.service';
import { CoreOperation } from '../models/core-operation.model';
import { CoreOperation as CoreOp } from '../models/entities/core-operation.model';
import { forkJoin } from 'rxjs';
import { CoreOperationNoteHistory } from '../models/entities/core-operation-note-history.model';
import { OperationNoteHendersonOutcome } from '../models/entities/core-operationnote-henderson-outcome.model';

@Injectable({
    providedIn: 'root'
})
export class OperationNoteService {
    private readonly postOperationanaesthetic: string = AppConfig.uris.dynamicApiUri +
    AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostOperationanaesthetic").url;

    private readonly deleteAnaestheticByOperation: string = AppConfig.uris.dynamicApiUri +
    AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeletemetaAnaesthetic").url;

    private readonly postOperationantibiotics: string = AppConfig.uris.dynamicApiUri +
    AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostOperationantibiotics").url;

    private readonly deleteAntibioticsByOperation: string = AppConfig.uris.dynamicApiUri +
    AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeletOperationantibiotics").url;

    private readonly postOperationUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostOperation").url;

    private readonly postOperationPreparationUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostOperationPreparation").url;

    private readonly postPostOperativeInstructionsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostPostOperativeInstruction").url;

    private readonly postOperationProviderUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostOperationProvider").url;

    private readonly postDiagnosesUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostDiagnoses").url;

    private readonly postProceduresUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedures").url;

    private readonly PostProcedureDetailUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureDetail").url;

    private readonly postProcedureImplantsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureImplants").url;

    private readonly postProcedureFindingsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureFindings").url;

    private readonly postProcedureStructuresAffectedUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureStructuresAffected").url;

    private readonly postProcedureFluidLossUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureFluidLoss").url;

    private readonly postProcedureDrainsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureDrains").url;

    private readonly postProcedureTeamUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProcedureProvider").url;

    private readonly postProblemsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostProblems").url;

    private readonly postIndicationsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostIndications").url;

    private readonly deleteOperationPreparationUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteOperationPreparation").url;

    private readonly deleteOperationProviderUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteOperationProvider").url;    

    private readonly deletePostOpInstructionUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeletePostOpInstruction").url;

    private readonly deleteOperationDiagnosisUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteOperationDiagnosis").url;

    private readonly deleteOperationProcedureUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteOperationProcedure").url;

    private readonly deleteProcedureDetailUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureDetail").url;

    private readonly deleteProcedureImplantUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureImplant").url;

    private readonly deleteProcedureFindingUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureFinding").url;

    private readonly deleteProcedureStructureAffectedUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureStructureAffected").url;

    private readonly deleteProcedureFluidLossUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureFluidLoss").url;
    
        private readonly deleteProcedureDrainsUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureDrains").url;    

    private readonly deleteProcedureProviderUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProcedureProvider").url;

    private readonly deleteProblemUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteProblem").url;

    private readonly deleteIndicationUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteIndication").url;

    private readonly getOperationUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetOperation").url;

    private readonly postOperationNoteHistory: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostOperationNoteHistory").url;

    private readonly postHendersonOutcomeURL: string = AppConfig.uris.dynamicApiUri +
    AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "PostHendersonOutcome").url;

    private readonly deleteHendersonOutcomeURL: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "DeleteHendersonOutcome").url;

    private readonly personIdentifierUrl: string = AppConfig.uris.dynamicApiUri +
        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetPersonIdentifiers").url;

    constructor(private apiRequestService: ApirequestService) { }

    public async saveOperationNote(operation: CoreOp, operationNoteStatus: string) {

        let opData = await this.apiRequestService.getRequest(this.getOperationUrl + operation.operation_id).toPromise();

        let dbOperation: CoreOperation =  <CoreOperation> JSON.parse(opData);
        dbOperation.operationnotestatuscode = operationNoteStatus;
        dbOperation.operationnotestatustext = operationNoteStatus;
        dbOperation.operationqualifiercode = operation.operationqualifiercode;
        dbOperation.operationqualifiertext = operation.operationqualifiertext;
        dbOperation.isretrospectivedata = operation.isretrospectivedata;

        dbOperation.asagradecode=operation.asagradecode;
        dbOperation.asagradetext=operation.asagradetext;

        operation.operationpreparation._createdsource = "operationNoteModule";
        operation.operationpreparation._contextkey = operation.operationpreparation.operationpreparation_id;
        
        operation.operationpostopinstructions._createdsource = "operationNoteModule";
        operation.operationpostopinstructions._contextkey = operation.operationpostopinstructions.operationpostopinstructions_id;
        
        operation.diagnoses.forEach(diag => {
            diag._createdsource = "operationNoteModule";
            diag._contextkey = diag.diagnosis_id;
        });
        
        let procs: any = [];
        let procedureDetail: any = [];
        let indications: any = [];
        let problems: any = [];
        let findings: any = [];
        let procProviders: any = [];
        let implants: any = [];
        let opProviders: any = [];
        let fluidLoss: any = [];
        let drains: any = [];
        let procStruct: any = [];

        operation.procedures.map(pr => {
			procs.push({
				procedure_id: pr.procedure_id,
				proceduredate: pr.proceduredate,
				duration: pr.duration,
				person_id: pr.person_id,
				encounter_id: pr.encounter_id,
				isprimary: pr.isprimary,
				operation_id: pr.operation_id,
				name: pr.name,
				anaesthesiacode: pr.anaesthesiacode,
				proceduremodifiercode: pr.proceduremodifiercode,
				proceduremodifiertext: pr.proceduremodifiertext,
				setid: pr.setid,
				anaesthesiaminutes: pr.anaesthesiaminutes,
				status: pr.status,
                code: pr.code,
                _contextkey: pr.procedure_id,
                _createdsource: "operationNoteModule"
			});
        });
        
		operation.procedures.map(pr => {
			if (pr.proceduredetail != null) {
                pr.proceduredetail._contextkey = pr.proceduredetail.proceduredetail_id;                
                pr.proceduredetail._createdsource = "operationNoteModule";
                pr.proceduredetail.bloodloss = !pr.proceduredetail.bloodloss ? null : parseFloat(pr.proceduredetail.bloodloss+"");
				procedureDetail.push(pr.proceduredetail);
			}
        });
        
		operation.procedures.map(pr => {
			pr.indications.map(ind => {
                ind._contextkey = ind.indication_id;                
                ind._createdsource = "operationNoteModule";
				indications.push(ind);
			});
        });
        
		operation.procedures.map(pr => {
			pr.problems.map(prb => {
                prb._contextkey = prb.problem_id;                
                prb._createdsource = "operationNoteModule";
				problems.push(prb);
			});
        });
        
		operation.procedures.map(pr => {
			pr.procedurefindings.map(fnd => {
                fnd._contextkey = fnd.procedurefinding_id;
                fnd._createdsource = "operationNoteModule";
				findings.push(fnd);
			});
        });
        
		operation.procedures.map(pr => {
			pr.procedureproviders.map(prv => {
                prv._contextkey = prv.procedureprovider_id;
                prv._createdsource = "operationNoteModule";
				procProviders.push(prv);
			});
        });
        
        operation.procedures.map(pr => {
			pr.procedureimplants.map(imp => {
                imp._contextkey = imp.procedureimplant_id;
                imp._createdsource = "operationNoteModule";
				implants.push(imp);
			});
        });
        
        operation.operationproviders.filter(x => x.isfrompas == false).map(prv => {
            prv._contextkey = prv.operationprovider_id;
            prv._createdsource =  prv.isfrompas == true ? prv._createdsource :  "operationNoteModule";
            delete prv.isfrompas
			opProviders.push(prv);
        });
         
        operation.procedures.map(pr => {
			pr.procedurefluidloss.map(fl => {
                fl._contextkey = fl.procedurefluidloss_id;
                fl._createdsource = "operationNoteModule";
				fluidLoss.push(fl);
			});
        });
        operation.procedures.map(pr => {
			pr.proceduredrains.map(dr => {
                dr._contextkey = dr.proceduredrains_id;
                dr._createdsource = "operationNoteModule";
				drains.push(dr);
			});
        });
        operation.procedures.map(pr => {
			pr.procedurestructuresaffected.map(str => {
                str._contextkey = str.procedurestructureaffected_id;
                str._createdsource = "operationNoteModule";
				procStruct.push(str);
			});
		});

        await forkJoin(
            this.apiRequestService.postRequest(this.postOperationanaesthetic, operation.operationanaesthetic),
            this.apiRequestService.postRequest(this.postOperationantibiotics, operation.operationantibiotics),
            this.apiRequestService.postRequest(this.postOperationUrl, dbOperation),
            this.apiRequestService.postRequest(this.postOperationPreparationUrl, operation.operationpreparation),
            this.apiRequestService.postRequest(this.postPostOperativeInstructionsUrl, operation.operationpostopinstructions),
            this.apiRequestService.postRequest(this.postDiagnosesUrl, operation.diagnoses),
            this.apiRequestService.postRequest(this.postProceduresUrl, procs),
            this.apiRequestService.postRequest(this.PostProcedureDetailUrl, procedureDetail),
            this.apiRequestService.postRequest(this.postIndicationsUrl, indications),
            this.apiRequestService.postRequest(this.postProblemsUrl, problems),
            this.apiRequestService.postRequest(this.postProcedureFindingsUrl, findings),
            this.apiRequestService.postRequest(this.postProcedureTeamUrl, procProviders),
            this.apiRequestService.postRequest(this.postProcedureImplantsUrl, implants),
            this.apiRequestService.postRequest(this.postOperationProviderUrl, opProviders),
            this.apiRequestService.postRequest(this.postProcedureFluidLossUrl, fluidLoss),
            this.apiRequestService.postRequest(this.postProcedureDrainsUrl, drains),
            this.apiRequestService.postRequest(this.postProcedureStructuresAffectedUrl, procStruct)
        ).toPromise();
    }

    public async saveOperationNoteHistory(opHistory: CoreOperationNoteHistory) {
        opHistory._contextkey = opHistory.operationnotehistory_id;
        opHistory._createdsource = "operationNoteModule";

        await forkJoin(
            this.apiRequestService.getDocumentByPost(this.postOperationNoteHistory, opHistory)
        ).toPromise();
    }

    public async deleteOperationNote(op: CoreOp) {
        // Delete operation note
        let dbOperation: CoreOperation;

        let opData = await this.apiRequestService.getRequest(AppConfig.uris.dynamicApiUri +
            AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetOperation").url +
            op.operation_id)
            .toPromise();

        dbOperation = <CoreOperation>JSON.parse(opData);

        dbOperation.operationnotestatuscode = null;
        dbOperation.operationnotestatustext = null;
        dbOperation.operationqualifiercode = null;
        dbOperation.operationqualifiertext = null;
        dbOperation.asagradecode = null;
        dbOperation.asagradetext = null;

        await this.apiRequestService.postRequest(this.postOperationUrl, dbOperation).toPromise();

        await this.apiRequestService.deleteRequest(this.deleteAnaestheticByOperation + op.operation_id).toPromise();
        await this.apiRequestService.deleteRequest(this.deleteAntibioticsByOperation + op.operation_id).toPromise();
        
        if (op.operationproviders != null && op.operationproviders.length > 0) {            
            await Promise.all(op.operationproviders.filter(x => x.isfrompas == false).map(async (provider) => {
                await this.apiRequestService.deleteRequest(this.deleteOperationProviderUrl + provider.operationprovider_id).toPromise();
            }));
        }

        if (op.operationpreparation != null && op.operationpreparation.operationpreparation_id != null) {
            await this.apiRequestService.deleteRequest(this.deleteOperationPreparationUrl + op.operationpreparation.operationpreparation_id).toPromise();
        }

        if (op.operationpostopinstructions != null && op.operationpostopinstructions.operationpostopinstructions_id != null) {
            await this.apiRequestService.deleteRequest(this.deletePostOpInstructionUrl + op.operationpostopinstructions.operationpostopinstructions_id).toPromise();
        }

        if (op.diagnoses != null && op.diagnoses.length > 0) {
            await Promise.all(op.diagnoses.map(async (diag) => {
                await this.apiRequestService.deleteRequest(this.deleteOperationDiagnosisUrl + diag.diagnosis_id).toPromise();
            }));
        }

        if (op.procedures != null && op.procedures.length > 0) {
            await Promise.all(
                op.procedures.map(async (proc) => {

                    if (proc.procedure_id != null) {
                        await this.apiRequestService.deleteRequest(this.deleteOperationProcedureUrl + proc.procedure_id).toPromise();
                    }

                    if (proc.proceduredetail != null && proc.proceduredetail.proceduredetail_id != null) {
                        await this.apiRequestService.deleteRequest(this.deleteProcedureDetailUrl + proc.proceduredetail.proceduredetail_id).toPromise();
                    }

                    if (proc.procedureimplants != null && proc.procedureimplants.length > 0) {
                        await Promise.all(proc.procedureimplants.map(async (procImp) => {
                            await this.apiRequestService.deleteRequest(this.deleteProcedureImplantUrl + procImp.procedureimplant_id).toPromise();
                        }));
                    }

                    if (proc.procedurefindings != null && proc.procedurefindings.length > 0) {
                        await Promise.all(proc.procedurefindings.map(async (procFinding) => {
                            await this.apiRequestService.deleteRequest(this.deleteProcedureFindingUrl + procFinding.procedurefinding_id).toPromise();
                        }));
                    }

                    if (proc.procedurestructuresaffected != null && proc.procedurestructuresaffected.length > 0) {
                        await Promise.all(proc.procedurestructuresaffected.map(async (procStructAffect) => {
                            await this.apiRequestService.deleteRequest(this.deleteProcedureStructureAffectedUrl + procStructAffect.procedurestructureaffected_id).toPromise();
                        }));
                    }

                    if (proc.procedurefluidloss != null && proc.procedurefluidloss.length > 0) {
                        await Promise.all(proc.procedurefluidloss.map(async (procFluidLoss) => {
                            await this.apiRequestService.deleteRequest(this.deleteProcedureFluidLossUrl + procFluidLoss.procedurefluidloss_id).toPromise();
                        }));
                    }
                    if (proc.proceduredrains != null && proc.proceduredrains.length > 0) {
                        await Promise.all(proc.proceduredrains.map(async (procDrains) => {
                            await this.apiRequestService.deleteRequest(this.deleteProcedureDrainsUrl + procDrains.proceduredrains_id).toPromise();
                        }));
                    }
                    if (proc.procedureproviders != null && proc.procedureproviders.length > 0) {
                        await Promise.all(proc.procedureproviders.map(async (procProvider) => {
                            await this.apiRequestService.deleteRequest(this.deleteProcedureProviderUrl + procProvider.procedureprovider_id).toPromise();
                        }));
                    }

                    if (proc.problems != null && proc.problems.length > 0) {
                        await Promise.all(proc.problems.map(async (problem) => {
                            await this.apiRequestService.deleteRequest(this.deleteProblemUrl + problem.problem_id).toPromise();
                        }));
                    }

                    if (proc.indications != null && proc.indications.length > 0) {
                        await Promise.all(proc.indications.map(async (indication) => {
                            await this.apiRequestService.deleteRequest(this.deleteIndicationUrl + indication.indication_id).toPromise;
                        }));
                    }
                }
            ));
        }
    }

    public async saveHendersonOutcome(hendersonOutcome: OperationNoteHendersonOutcome) {
        await this.apiRequestService.postRequest(this.postHendersonOutcomeURL, hendersonOutcome).toPromise();
    }

    public async deleteHendersonOutcome(hendersonOutcome: OperationNoteHendersonOutcome) {
        await this.apiRequestService.deleteRequest(this.deleteHendersonOutcomeURL + hendersonOutcome.operationnotehendersonoutcome_id).toPromise();
    }

    public async getPersonHospitalNumber(personId: string) {
        let personIdentifiersJson = await this.apiRequestService.getRequest(this.personIdentifierUrl + personId).toPromise();        
        
        let personIdentifiers = JSON.parse(personIdentifiersJson);
        let hospitalNo = personIdentifiers.find(x => x.idtypecode == AppConfig.hospitalNumberTypeCode);
        return hospitalNo.idnumber;
    }

    // public async postOperation(operation: CoreOperation) {
    //     await this.apiRequestService.postRequest(this.postOperationUrl, operation).toPromise();
    // }
}