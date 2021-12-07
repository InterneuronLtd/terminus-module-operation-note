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
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { CoreProvider } from '../models/entities/core-provider.model';
import { Subscription } from 'rxjs';
import { SubjectsService } from '../services/subjects.service';
import { CoreOperationProvider } from '../models/entities/core-operation-provider.model';
import { AppService } from '../services/app.service';
import { CoreOperation } from '../models/entities/core-operation.model';
import { ProviderService } from '../services/provider.service';
import { v4 as uuidv4 } from 'uuid';
@Component({
    selector: 'app-operation-provider',
    templateUrl: './operation-provider.component.html',
    styleUrls: ['./operation-provider.component.css']
})
export class OperationProviderComponent implements OnInit, OnDestroy {

    operationId: string;

    @ViewChild('consultantautocomplete') ac: AutoComplete;

    @ViewChild('surgeonautocomplete') sac: AutoComplete;

    @ViewChild('assistantautocomplete') aac: AutoComplete;

    @ViewChild('anaesthetistautocomplete') anac: AutoComplete;

    operationProviders: CoreOperationProvider[] = [];
 
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

    isViewPDF: boolean = false;

    subscriptions: Subscription = new Subscription();

    constructor(private subjectsService: SubjectsService,
        private providerService: ProviderService,
        private appService: AppService) {
        this.subscriptions.add(
            this.subjectsService.operation.subscribe((op: CoreOperation) => {
                this.operationId = op.operation_id;
                this.selectedConsultants = [];
                this.selectedAnaesthetists = [];
                this.selectedAssistants = [];
                this.selectedSurgeons = [];               
                this.providers = this.providerService.allProviders;             
                this.operationProviders = op.operationproviders;
                let opConsultant = this.operationProviders.filter(con => con.rolecode == "OC");
                opConsultant.map(con => {
                    this.providers.forEach(x => {
                        if (x.provider_id == con.provider_id) {
                            x.isfrompas = con.isfrompas; 
                            x._createdsource = con._createdsource;
                            this.selectedConsultants.push(x);
                        }
                    });
                });
                this.operationProviders.filter(con => con.rolecode == "OC" && con.provider_id.startsWith("Consultant")).forEach(element => {
                    let newprovider = new CoreProvider();
                    newprovider.displayname = element.providername;
                    newprovider.provider_id = element.provider_id;
                    newprovider.isfrompas = element.isfrompas;
                    newprovider._createdsource = element._createdsource;
                    this.selectedConsultants.push(newprovider);
                });

                let surIds = this.operationProviders.filter(con => { 
                    if(con.rolecode) {
                        return con.rolecode.startsWith("LS");
                    }
                    return false;
                });         
                surIds.map(id => {
                    this.providers.forEach(x => {
                        if (x.provider_id == id.provider_id) {
                            x.isfrompas = id.isfrompas; 
                            x._createdsource = id._createdsource;
                            this.selectedSurgeons.push(x);
                        }
                    });
                });

                this.operationProviders.filter(con => { 
                    if(con.rolecode && con.provider_id.startsWith("Surgeons")) {
                        return con.rolecode.startsWith("LS");
                    }
                    return false;
                }).forEach(element => {
                    let newprovider = new CoreProvider();
                    newprovider.displayname = element.providername;
                    newprovider.provider_id = element.provider_id;
                    newprovider.isfrompas = element.isfrompas;
                    newprovider._createdsource = element._createdsource;
                    this.selectedSurgeons.push(newprovider);
                });
                
                let asIds = this.operationProviders.filter(con => {
                    if(con.rolecode) {
                        return con.rolecode.startsWith("AS");
                    }
                    return false;
                });

                asIds.map(id => {
                    this.providers.forEach(x => {
                        if (x.provider_id == id.provider_id) {
                            x.isfrompas = id.isfrompas; 
                            x._createdsource = id._createdsource;
                            this.selectedAssistants.push(x);
                        }
                    });
                });

                this.operationProviders.filter(con => { 
                    if(con.rolecode && con.provider_id.startsWith("Assistants")) {
                        return con.rolecode.startsWith("AS");
                    }
                    return false;
                }).forEach(element => {
                    let newprovider = new CoreProvider();
                    newprovider.displayname = element.providername;
                    newprovider.provider_id = element.provider_id;
                    newprovider.isfrompas = element.isfrompas;
                    newprovider._createdsource = element._createdsource;
                    this.selectedAssistants.push(newprovider);
                });
                

                let laIds = this.operationProviders.filter(con => {
                    if(con.rolecode) {
                        return con.rolecode.startsWith("LA");
                    }
                    return false;
                });

                laIds.map(id => {
                    this.providers.forEach(x => {
                        if (x.provider_id == id.provider_id) {
                            x.isfrompas = id.isfrompas;
                            x._createdsource = id._createdsource;
                            this.selectedAnaesthetists.push(x);
                        }
                    });
                });

                this.operationProviders.filter(con => { 
                    if(con.rolecode && con.provider_id.startsWith("Anaesthetists")) {
                        return con.rolecode.startsWith("LA");
                    }
                    return false;
                }).forEach(element => {
                    let newprovider = new CoreProvider();
                    newprovider.displayname = element.providername;
                    newprovider.provider_id = element.provider_id;
                    newprovider.isfrompas = element.isfrompas;
                    newprovider._createdsource = element._createdsource;
                    this.selectedAnaesthetists.push(newprovider);
                });
 
                this.initOperationProviders();
            })
        );

        this.subscriptions.add(
            this.subjectsService.isViewPDF.subscribe((isViewPDF: boolean) => {
                this.isViewPDF = isViewPDF;
            })
        );
    }

    ngOnInit() { }

    initOperationProviders() {
        this.operationProviders.splice(0, this.operationProviders.length);

        this.selectedConsultants.forEach(con => {
            let consultant: CoreOperationProvider = new CoreOperationProvider();

            consultant.operationprovider_id = con.provider_id + "|OC|" + this.operationId;
            consultant.operation_id = this.operationId;
            consultant.provider_id = con.provider_id;
            consultant.rolecode = 'OC';
            consultant.roletext = 'Owning Consultant';
            consultant.providername = con.displayname;
            consultant.isfrompas = con.isfrompas;
            consultant._createdsource = con._createdsource;
            this.operationProviders.push(consultant);
        });

        if (Array.isArray(this.selectedSurgeons) && this.selectedSurgeons.length > 0) {
            for (var i = 0; i < this.selectedSurgeons.length; i++) {
                let surgeon: CoreOperationProvider = new CoreOperationProvider();

                surgeon.operationprovider_id = this.selectedSurgeons[i].provider_id + "|LS" + (i + 1) + "|" + this.operationId;
                surgeon.operation_id = this.operationId;
                surgeon.provider_id = this.selectedSurgeons[i].provider_id;
                surgeon.rolecode = 'LS' + (i + 1);
                surgeon.roletext = 'Lead Surgeon ' + (i + 1);
                surgeon.providername = this.selectedSurgeons[i].displayname;
                surgeon.isfrompas = this.selectedSurgeons[i].isfrompas;
                surgeon._createdsource = this.selectedSurgeons[i]._createdsource;
                this.operationProviders.push(surgeon);
            }
        }

        if (Array.isArray(this.selectedAssistants) && this.selectedAssistants.length > 0) {
            for (var i = 0; i < this.selectedAssistants.length; i++) {
                let assistant: CoreOperationProvider = new CoreOperationProvider();

                assistant.operationprovider_id = this.selectedAssistants[i].provider_id + "|AS" + (i + 1) + "|" + this.operationId;
                assistant.operation_id = this.operationId;
                assistant.provider_id = this.selectedAssistants[i].provider_id;
                assistant.rolecode = 'AS' + (i + 1);
                assistant.roletext = 'Assistant ' + (i + 1);
                assistant.providername = this.selectedAssistants[i].displayname;
                assistant.isfrompas = this.selectedAssistants[i].isfrompas;
                assistant._createdsource = this.selectedAssistants[i]._createdsource;
                this.operationProviders.push(assistant);
            }
        }

        if (Array.isArray(this.selectedAnaesthetists) && this.selectedAnaesthetists.length > 0) {
            for (var i = 0; i < this.selectedAnaesthetists.length; i++) {
                let anaesthetist: CoreOperationProvider = new CoreOperationProvider();

                anaesthetist.operationprovider_id = this.selectedAnaesthetists[i].provider_id + "|LA" + (i + 1) + "|" + this.operationId;
                anaesthetist.operation_id = this.operationId;
                anaesthetist.provider_id = this.selectedAnaesthetists[i].provider_id;
                anaesthetist.rolecode = 'LA' + (i + 1);
                anaesthetist.roletext = 'Lead Anaesthetist ' + (i + 1);
                anaesthetist.providername = this.selectedAnaesthetists[i].displayname;
                anaesthetist.isfrompas = this.selectedAnaesthetists[i].isfrompas;
                anaesthetist._createdsource = this.selectedAnaesthetists[i]._createdsource;
                this.operationProviders.push(anaesthetist);
            }
        }
        this.subjectsService.nextOperationProvider(this.operationProviders);
    }

   
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
    simpleClone(obj: any) {
        return Object.assign({}, obj);
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
        var addedConsultants = this.selectedConsultants.filter(x => x.provider_id == event.provider_id);
        if (addedConsultants.length == 0 && this.selectedConsultants.length == 0) {
            var obj = this.simpleClone(event);
            obj.isfrompas = false;
            this.selectedConsultants.push(obj);
        }    
        this.initOperationProviders();     
        //this.initOperationProvidersConsultant();
    }

    unSelectedConsultant(event) {
        for (var i = 0; i < this.selectedConsultants.length; i++) {
            if (this.selectedConsultants[i].provider_id === event.provider_id) {
                this.selectedConsultants.splice(i, 1);
                i--;
            }
        }        
        //this.initOperationProvidersConsultant();
        this.initOperationProviders();
    }

    blurConsultant() {
        let item = document.getElementById(this.operationId + '|paConsultant').firstElementChild.firstElementChild as HTMLInputElement;
        item.style.color = 'transparent';
    }

    focusConsultant() {
        let item = document.getElementById(this.operationId + '|paConsultant').firstElementChild.firstElementChild as HTMLInputElement;
        item.style.color = 'black';
        if(this.selectedConsultants && this.selectedConsultants.length > 0) {
            item.value = this.selectedConsultants[0].displayname;      
        }
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
        var addedSurgeons = this.selectedSurgeons.filter(x => x.provider_id == event.provider_id);
        if (addedSurgeons.length == 0) {
            var obj = this.simpleClone(event);
            obj.isfrompas = false;
            this.selectedSurgeons.push(obj);
        }
        this.initOperationProviders();
      // this.initOperationProvidersSurgeons();
    }

    unSelectedSurgeon(event) {
        for (var i = 0; i < this.selectedSurgeons.length; i++) {
            if (this.selectedSurgeons[i].provider_id === event.provider_id) {
                this.selectedSurgeons.splice(i, 1);
                i--;
            }
        }
        this.initOperationProviders();
       // this.initOperationProvidersSurgeons();
    }

    onRemoveSurgeon(surgeon) {
        var item = document.getElementById(this.operationId + '|' + surgeon.provider_id);
        if (item) {
            this.sac.removeItem(item.parentElement);
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
        var addedAssistants = this.selectedAssistants.filter(x => x.provider_id == event.provider_id);
        if (addedAssistants.length == 0) {
            var obj = this.simpleClone(event);
            obj.isfrompas = false;
            this.selectedAssistants.push(obj);
        }
        this.initOperationProviders();
        //this.initOperationProvidersAssistants();
    }

    unSelectedAssistant(event) {
        for (var i = 0; i < this.selectedAssistants.length; i++) {
            if (this.selectedAssistants[i].provider_id === event.provider_id) {
                this.selectedAssistants.splice(i, 1);
                i--;
            }
        }
        this.initOperationProviders();
        //this.initOperationProvidersAssistants();
    }

    onRemoveAssistant(assistant) {
        var item = document.getElementById(this.operationId + '|' + assistant.provider_id);
        if (item) {
            this.aac.removeItem(item.parentElement);
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
        var addedAnaesthetists = this.selectedAnaesthetists.filter(x => x.provider_id == event.provider_id);
        if (addedAnaesthetists.length == 0) {
            var obj = this.simpleClone(event);
            obj.isfrompas = false;
            this.selectedAnaesthetists.push(obj);
        }
        this.initOperationProviders();
        //this.initOperationProvidersAnaesthetists();
    }

    unSelectedAnaesthetist(event) {
        for (var i = 0; i < this.selectedAnaesthetists.length; i++) {
            if (this.selectedAnaesthetists[i].provider_id === event.provider_id) {
                this.selectedAnaesthetists.splice(i, 1);
                i--;
            }
        }
        this.initOperationProviders();
        //this.initOperationProvidersAnaesthetists();
    }

    onRemoveAnaesthetist(anaesthetist) {
        var item = document.getElementById(this.operationId + '|' + anaesthetist.provider_id);
        if (item) {
            this.anac.removeItem(item.parentElement);
        }
        this.anac.onUnselect.emit(anaesthetist);
    }
}
