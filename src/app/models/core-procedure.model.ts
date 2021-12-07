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
import { CoreIndication } from './entities/core-indication.model'
import { TerminologyConcept } from './terminology-concept.model'
import { CoreProcedureDetail } from './entities/core-procedure-detail.model'
import { CoreProcedureFinding } from './entities/core-procedure-finding.model'
import { SnomedConcept } from './snomed-concept.model'
import { StructuresAffected } from './structures-affected.model'
import { FluidLoss } from './fluid-loss.model'
import { CoreProblem } from './entities/core-problem.model'
import { CoreProcedureImplant } from './entities/core-procedure-implant.model'
import { CoreProcedureProvider } from './entities/core-procedure-provider.model'

export class CoreProcedure
{
    //_terminologysystem: string = "OPCS4"
	procedure_id: string;
	proceduredate: Date;
	duration: number;
	person_id: string;
	encounter_id: string;
	isprimary: boolean;
	operation_id: string;
	name: string;
	anaesthesiacode: string;
	proceduremodifiercode: string;
	proceduremodifiertext: string;
	setid: number;
	anaesthesiaminutes: number;
	status: string;
	code: string;
    
    indications: CoreIndication[];
    selectedIndications: TerminologyConcept[];
    procedureDetail: CoreProcedureDetail;
    findings: CoreProcedureFinding[];
    selectedFindings: SnomedConcept[];
    problems: CoreProblem[];
    selectedProblems: TerminologyConcept[];
    selectedStructures: StructuresAffected[];
    deepClosure: TerminologyConcept;
    skinClosure: TerminologyConcept;
    repairWith: TerminologyConcept;
    selectedFluidLosses: FluidLoss[];
	selectedImplants: CoreProcedureImplant[];
	selectedProviders: CoreProcedureProvider[];
}