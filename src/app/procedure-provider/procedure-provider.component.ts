//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
// Interneuron Terminus
// Copyright(C) 2023  Interneuron Holdings Ltd
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.If not, see<http://www.gnu.org/licenses/>.

import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreProvider } from '../models/entities/core-provider.model';
import { AutoComplete } from 'primeng/autocomplete';
import { SubjectsService } from '../services/subjects.service';
import { CoreProcedureProvider } from '../models/entities/core-procedure-provider.model';
import { ProviderService } from '../services/provider.service';
import { CoreProcedure } from '../models/entities/core-procedure.model';
import { CoreOperationProvider } from '../models/entities/core-operation-provider.model';
import { AppService } from '../services/app.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-procedure-provider',
    templateUrl: './procedure-provider.component.html',
    styleUrls: ['./procedure-provider.component.css']
})
export class ProcedureProviderComponent implements OnInit, OnDestroy {

    _commonProviders: CoreOperationProvider[] = [];
    @Input() set commonProviders(value: CoreOperationProvider[]) {
        this._commonProviders = value;
        //this.initProcedureProviders();
    };

    procedure: CoreProcedure;
    @Input() set operationProcedure(value: CoreProcedure) {
        this.selectedConsultants = [];
        this.selectedAnaesthetists = [];
        this.selectedAssistants = [];
        this.selectedSurgeons = [];

        this.providers = this.providerService.allProviders;
        this.procedure = value;

        this.procedureProviders = value.procedureproviders;

        if (this.procedure.proceduredetail.isdifferentteam) {
            let conIds = this.procedureProviders.filter(con => con.rolecode == "OC").map(id => id.provider_id);
            conIds.map(id => {
                this.providers.forEach(x => {
                    if (x.provider_id == id) {
                        this.selectedConsultants.push(x);
                    }
                });
            });
            this.procedureProviders.filter(con => con.rolecode == "OC" && con.provider_id.startsWith("Consultant")).forEach(element => {
                let newprovider = new CoreProvider();
                newprovider.displayname = element.providername;
                newprovider.provider_id = element.provider_id;
                this.selectedConsultants.push(newprovider);
            });
            let surIds = this.procedureProviders.filter(con => {
                if (con.rolecode) {
                    return con.rolecode.startsWith("LS");
                }
                return false;
            }).map(id => id.provider_id);

            surIds.map(id => {
                this.providers.forEach(x => {
                    if (x.provider_id == id) {
                        this.selectedSurgeons.push(x);
                    }
                });
            });

            this.procedureProviders.filter(con => { 
                if(con.rolecode && con.provider_id.startsWith("Surgeons")) {
                    return con.rolecode.startsWith("LS");
                }
                return false;
            }).forEach(element => {
                let newprovider = new CoreProvider();
                newprovider.displayname = element.providername;
                newprovider.provider_id = element.provider_id;
                this.selectedSurgeons.push(newprovider);
            });
            


            let asIds = this.procedureProviders.filter(con => {
                if (con.rolecode) {
                    return con.rolecode.startsWith("AS");
                }
                return false;
            }).map(id => id.provider_id);

            asIds.map(id => {
                this.providers.forEach(x => {
                    if (x.provider_id == id) {
                        this.selectedAssistants.push(x);
                    }
                });
            });

            this.procedureProviders.filter(con => { 
                if(con.rolecode && con.provider_id.startsWith("Assistants")) {
                    return con.rolecode.startsWith("AS");
                }
                return false;
            }).forEach(element => {
                let newprovider = new CoreProvider();
                newprovider.displayname = element.providername;
                newprovider.provider_id = element.provider_id;
                this.selectedAssistants.push(newprovider);
            });
            

            let laIds = this.procedureProviders.filter(con => {
                if (con.rolecode) {
                    return con.rolecode.startsWith("LA");
                }
                return false;
            }).map(id => id.provider_id);

            laIds.map(id => {
                this.providers.forEach(x => {
                    if (x.provider_id == id) {
                        this.selectedAnaesthetists.push(x);
                    }
                });
            });

            this.procedureProviders.filter(con => { 
                if(con.rolecode && con.provider_id.startsWith("Anaesthetists")) {
                    return con.rolecode.startsWith("LA");
                }
                return false;
            }).forEach(element => {
                let newprovider = new CoreProvider();
                newprovider.displayname = element.providername;
                newprovider.provider_id = element.provider_id;
                this.selectedAnaesthetists.push(newprovider);
            });

        }
        this.initProcedureProviders();
    }

    @ViewChild('consultantautocomplete') ac: AutoComplete;

    @ViewChild('surgeonautocomplete') sac: AutoComplete;

    @ViewChild('assistantautocomplete') aac: AutoComplete;

    @ViewChild('anaesthetistautocomplete') anac: AutoComplete;

    procedureProviders: CoreProcedureProvider[] = [];

    consultants: CoreProvider[] = [];

    consultant: CoreProvider;

    selectedConsultants: CoreProvider[] = [];

    surgeons: CoreProvider[] = [];

    selectedSurgeons: CoreProvider[] = [];

    assistants: CoreProvider[] = [];

    selectedAssistants: CoreProvider[] = [];

    anaesthetists: CoreProvider[] = [];

    selectedAnaesthetists: CoreProvider[] = [];

    providers: CoreProvider[];

    subscriptions: Subscription = new Subscription();
    isViewPDF: boolean = false;
    constructor(
        private subjects: SubjectsService,
        private changeDetector: ChangeDetectorRef,
        private providerService: ProviderService,
        private appService: AppService) {
        this.subscriptions.add(
            this.subjects.operationProviders.subscribe((opProv: CoreOperationProvider[]) => {
                this.commonProviders = opProv;
                this.initProcedureProviders();
            })
        );
        this.subscriptions.add(
            this.subjects.isViewPDF.subscribe((isViewPDF: boolean) => {
                this.isViewPDF = isViewPDF;
            })
        );
    }

    ngOnInit() {
    }

    initProcedureProviders() {
        if (this.procedure != undefined) {
            this.procedureProviders.splice(0, this.procedureProviders.length);
            if (this.procedure.proceduredetail.isdifferentteam) {

                this.selectedConsultants.forEach(con => {
                    let consultant: CoreProcedureProvider = new CoreProcedureProvider();

                    consultant.procedureprovider_id = con.provider_id + "|OC|" + this.procedure.procedure_id;
                    consultant.procedure_id = this.procedure.procedure_id;
                    consultant.provider_id = con.provider_id;
                    consultant.rolecode = 'OC';
                    consultant.roletext = 'Owning Consultant';
                    consultant.providername = con.displayname;
                    this.procedureProviders.push(consultant);
                });

                if (Array.isArray(this.selectedSurgeons) && this.selectedSurgeons.length > 0) {
                    for (var i = 0; i < this.selectedSurgeons.length; i++) {
                        let surgeon: CoreProcedureProvider = new CoreProcedureProvider();

                        surgeon.procedureprovider_id = this.selectedSurgeons[i].provider_id + "|LS" + (i + 1) + "|" + this.procedure.procedure_id;
                        surgeon.procedure_id = this.procedure.procedure_id;
                        surgeon.provider_id = this.selectedSurgeons[i].provider_id;
                        surgeon.rolecode = 'LS' + (i + 1);
                        surgeon.roletext = 'Lead Surgeon ' + (i + 1);
                        surgeon.providername = this.selectedSurgeons[i].displayname;
                        this.procedureProviders.push(surgeon);
                    }
                }

                if (Array.isArray(this.selectedAssistants) && this.selectedAssistants.length > 0) {
                    for (var i = 0; i < this.selectedAssistants.length; i++) {
                        let assistant: CoreProcedureProvider = new CoreProcedureProvider();

                        assistant.procedureprovider_id = this.selectedAssistants[i].provider_id + "|AS" + (i + 1) + "|" + this.procedure.procedure_id;
                        assistant.procedure_id = this.procedure.procedure_id;
                        assistant.provider_id = this.selectedAssistants[i].provider_id;
                        assistant.rolecode = 'AS' + (i + 1);
                        assistant.roletext = 'Assistant ' + (i + 1);
                        assistant.providername = this.selectedAssistants[i].displayname;
                        this.procedureProviders.push(assistant);
                    }
                }

                if (Array.isArray(this.selectedAnaesthetists) && this.selectedAssistants.length > 0) {
                    for (var i = 0; i < this.selectedAnaesthetists.length; i++) {
                        let anaesthetist: CoreProcedureProvider = new CoreProcedureProvider();

                        anaesthetist.procedureprovider_id = this.selectedAnaesthetists[i].provider_id + "|LA" + (i + 1) + "|" + this.procedure.procedure_id;
                        anaesthetist.procedure_id = this.procedure.procedure_id;
                        anaesthetist.provider_id = this.selectedAnaesthetists[i].provider_id;
                        anaesthetist.rolecode = 'LA' + (i + 1);
                        anaesthetist.roletext = 'Lead Anaesthetist ' + (i + 1);
                        anaesthetist.providername = this.selectedAnaesthetists[i].displayname;
                        this.procedureProviders.push(anaesthetist);
                    }
                }
            }
            else {
                for (var i = 0; i < this._commonProviders.length; i++) {
                    let provider = new CoreProcedureProvider();

                    provider.procedureprovider_id = this._commonProviders[i].provider_id + '|' + this.procedure.procedure_id;
                    provider.procedure_id = this.procedure.procedure_id;
                    provider.provider_id = this._commonProviders[i].provider_id;
                    provider.rolecode = this._commonProviders[i].rolecode;
                    provider.roletext = this._commonProviders[i].roletext;

                    this.procedureProviders.push(provider);
                }
            }
        }

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    clearAllData() {
        this.selectedConsultants.forEach(con => {
            this.onRemoveConsultant(con);
        });

        this.selectedSurgeons.forEach(sur => {
            this.onRemoveSurgeon(sur);
        });

        this.selectedAnaesthetists.forEach(anae => {
            this.onRemoveAnaesthetist(anae);
        });

        this.selectedAssistants.forEach(assist => {
            this.onRemoveAssistant(assist);
        });
    }

    searchConsultant(event) {
        let regex = new RegExp(event.query, 'gi');
        this.consultants = this.providers.filter(
            x => (x.displayname).match(regex)
        );
        if (this.consultants.length == 0) {
            let cp: CoreProvider = new CoreProvider();           
            cp.displayname = event.query;
            cp.provider_id = "Consultant|" + uuidv4();
            cp.role= "Consultant";            
            this.consultants.push(cp);           
        }
        //&& x.role == 'Consultant');
    }

    selectedConsultant(event) {
        var addedConsultants = this.selectedConsultants.filter(x => x.provider_id == event.value.provider_id);
        if (addedConsultants.length == 0 && this.selectedConsultants.length == 0) {
            this.selectedConsultants.push(event.value);
        }

        this.initProcedureProviders();
    }

    unSelectedConsultant(event) {
        for (var i = 0; i < this.selectedConsultants.length; i++) {
            if (this.selectedConsultants[i].provider_id === event.provider_id) {
                this.selectedConsultants.splice(i, 1);
                i--;
            }
        }

        this.initProcedureProviders();
    }

    blurConsultant() {
        // let item = document.getElementById(this.procedure.procedure_id + 'paConsultant').firstElementChild.firstElementChild as HTMLInputElement;
        // item.style.color = 'transparent';
    }

    focusConsultant() {
      
        // let item = document.getElementById(this.procedure.procedure_id + 'paConsultant').firstElementChild.firstElementChild as HTMLInputElement;
        // item.style.color = 'black';
        // if (this.selectedConsultants && this.selectedConsultants.length > 0) {
        //     item.value = this.selectedConsultants[0].displayname;
        // }
    }

    onRemoveConsultant(consultant) {
        this.consultant = null;
        this.ac.onUnselect.emit(consultant);
    }

    searchSurgeon(event) {
        let regex = new RegExp(event.query, 'gi');
        this.surgeons = this.providers.filter(
            x => (x.displayname).match(regex)
        );
        if (this.surgeons.length == 0) {
            let cp: CoreProvider = new CoreProvider();           
            cp.displayname = event.query;
            cp.provider_id = "Surgeons|" + uuidv4();
            cp.role= "Surgeons";            
            this.surgeons.push(cp);           
        }
        //&& x.role == 'Surgeon');
    }

    selectedSurgeon(event) {
        var addedSurgeons = this.selectedSurgeons.filter(x => x.provider_id == event.value.provider_id);
        if (addedSurgeons.length == 0) {
            this.selectedSurgeons.push(event.value);
        }

        this.initProcedureProviders();
    }

    unSelectedSurgeon(event) {
        let value=event.value
        if(!value){
            value=event;
        }
        for (var i = 0; i < this.selectedSurgeons.length; i++) {
            if (this.selectedSurgeons[i].provider_id === value.provider_id) {
                this.selectedSurgeons.splice(i, 1);
                i--;
            }
        }

        this.initProcedureProviders();
    }

    onRemoveSurgeon(surgeon) {
        if( this.sac.value){
        this.sac.value.forEach((element,index )=> {
            if(element.provider_id == surgeon.provider_id)
                (<Array<any>>this.sac.value).splice(index,1);
        });
    }
        this.sac.onUnselect.emit(surgeon);
    }

    searchAssistant(event) {
        let regex = new RegExp(event.query, 'gi');
        this.assistants = this.providers.filter(
            x => (x.displayname).match(regex)
        );
        if (this.assistants.length == 0) {
            let cp: CoreProvider = new CoreProvider();           
            cp.displayname = event.query;
            cp.provider_id = "Assistants|" + uuidv4();
            cp.role= "Assistants";            
            this.assistants.push(cp);           
        }
        //&& x.role == 'Assistant');
    }

    selectedAssistant(event) {
        var addedAssistants = this.selectedAssistants.filter(x => x.provider_id == event.value.provider_id);
        if (addedAssistants.length == 0) {
            this.selectedAssistants.push(event.value);
        }

        this.initProcedureProviders();
    }

    unSelectedAssistant(event) {
        let value=event.value
        if(!value){
            value=event;
        }
        for (var i = 0; i < this.selectedAssistants.length; i++) {
            if (this.selectedAssistants[i].provider_id === value.provider_id) {
                this.selectedAssistants.splice(i, 1);
                i--;
            }
        }

        this.initProcedureProviders();
    }

    onRemoveAssistant(assistant) {
       if(this.aac.value){
        this.aac.value.forEach((element,index )=> {
            if(element.provider_id == assistant.provider_id)
                (<Array<any>>this.aac.value).splice(index,1);
        });
       }
        this.aac.onUnselect.emit(assistant);
    }

    searchAnaesthetist(event) {
        let regex = new RegExp(event.query, 'gi');
        this.anaesthetists = this.providers.filter(
            x => (x.displayname).match(regex)
        );
        if (this.anaesthetists.length == 0) {
            let cp: CoreProvider = new CoreProvider();           
            cp.displayname = event.query;
            cp.provider_id = "Anaesthetists|" + uuidv4();
            cp.role= "Anaesthetists";            
            this.anaesthetists.push(cp);           
        }
        
        //&& x.role == 'Anaesthetist');
    }

    selectedAnaesthetist(event) {
        var addedAnaesthetists = this.selectedAnaesthetists.filter(x => x.provider_id == event.value.provider_id);
        if (addedAnaesthetists.length == 0) {
            this.selectedAnaesthetists.push(event.value);
        }

        this.initProcedureProviders();
    }

    unSelectedAnaesthetist(event) {
        let value=event.value
        if(!value){
            value=event;
        }
        for (var i = 0; i < this.selectedAnaesthetists.length; i++) {
            if (this.selectedAnaesthetists[i].provider_id === value.provider_id) {
                this.selectedAnaesthetists.splice(i, 1);
                i--;
            }
        }

        this.initProcedureProviders();
    }

    onRemoveAnaesthetist(anaesthetist) {
        if(this.anac.value){
        this.anac.value.forEach((element,index )=> {
            if(element.provider_id == anaesthetist.provider_id)
                (<Array<any>>this.anac.value).splice(index,1);
        });
    }
        this.anac.onUnselect.emit(anaesthetist);
    }

    onChkNewTeamInfoChange() {
        this.changeDetector.detectChanges();

        this.clearAllData();

        this.initProcedureProviders();
    }
}
