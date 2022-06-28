//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

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
import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import AppConfig from "src/assets/config/operation-note.config.json";
import { ApirequestService } from '../services/apirequest.service';
import { Subscription, Subject } from 'rxjs';
import { Implants } from '../models/implants.model';
import { SelectItem } from 'primeng/api';
import { MultiSelect } from 'primeng/multiselect';
import { Dropdown } from 'primeng/dropdown';
import { CoreImplantComponentRule } from '../models/entities/core-implant-component-rule.model';
import { SubjectsService } from '../services/subjects.service';
import { CoreProcedure } from '../models/entities/core-procedure.model';
import { CoreProcedureImplant } from '../models/entities/core-procedure-implant.model';
import { IconsService } from '../services/icons.service';
import { ImplantComponentGroup } from '../models/component-group.model';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { sortJson } from '../utilities/sort-json.utility';

@Component({
    selector: 'app-procedure-implant',
    templateUrl: './procedure-implant.component.html',
    styleUrls: ['./procedure-implant.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ProcedureImplantComponent implements OnInit {

    implantDataInitialized = new Subject();
    isSubmitted : boolean = false;
    _procedure: CoreProcedure;

    ProcedureTypes = AppConfig.ProcedureTypes;

    @Input() set isSubmit(isSubmitted:boolean) {
        this.isSubmitted = isSubmitted;
    }
    @Input() set procedure(value: CoreProcedure) {
        this._procedure = value;
       
        this._procedure.proceduredetail.implantproceduretype = value.proceduredetail.implantproceduretype;

        this.subscriptions.add(
            this.apiRequest.getRequest(
                AppConfig.uris.dynamicApiUri +
                AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GetComponentRuleData").url
            ).subscribe((data: any) => {
                this.implantComponentRule = JSON.parse(data);

                this.subscriptions.add(
                    this.apiRequest.getRequest(
                        AppConfig.uris.dynamicApiUri +
                        AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "BvImplantData").url
                    )
                    .subscribe((data: any) => {
                        this.implantData = JSON.parse(data);
                        this.implantManufacturer = this.getManufacturers();                
        
                        if (this._procedure.procedureimplants && this._procedure.procedureimplants.length > 0) {

                            this._procedure.procedureimplants.map(impl => {
                                let implant = this.implantData.find(x => 
                                    (x.implantmanufacturer_id == impl.implantmanufacturer_id &&
                                    x.implantsystem_id == impl.implantsystem_id &&
                                    x.implantcomponent_id == impl.implantcomponent_id));
                                if (implant) {
                                    this.addedComponents.push(implant);
                                }
                                else {
                                    this.addedComponents.push({
                                        askforquantity: impl.askforquantity,
                                        componentidentifier: impl.componentidentifier,
                                        defaultquantity: impl.quantity,
                                        implantcomponentgroupname: impl.implantcomponentgroupname,
                                        implantcomponent_id: impl.implantcomponent_id,
                                        implantcomponentgroup_id: impl.implantcomponentgroup_id,
                                        implantcomponentname: impl.implantcomponentname,
                                        implantmanufacturer_id: impl.implantmanufacturer_id,
                                        implantsystem_id: impl.implantsystem_id,
                                        implantsystemname: impl.implantsystemname,
                                        manufacturername: impl.manufacturername
                                    });
                                }
                            });
        
                            this.initMissingComponentGroups();
                            
                            this.sortProcedureImplant();
                        }
                    })
                );
            })
        );
    }

    isChecked: boolean = false;
    showAddImplantButton: boolean = false;
    implantData: Implants[] = [];
    implantComponentRule: CoreImplantComponentRule[] = [];

    subscriptions: Subscription = new Subscription();

    implantManufacturer: SelectItem[] = [];
    implantSystem: SelectItem[] = [];
    componentGroup: ImplantComponentGroup[] = [];

    addedComponents: Implants[] = [];

    missingComponentGroups: any = [];
    //procedureComponents: CoreProcedureImplant[] = [];
    selectedSystemId: string;
    selectedSystemName: string;
    selectedManufacturerId: string;
    selectedManufacturerName: string;
    isViewPDF: boolean = false;
    @ViewChild('components') dvComponents: ElementRef;

    @ViewChildren('msComponents') msComponents: QueryList<MultiSelect>;
    @ViewChild('ddlImplantSystem') ddlImplantSystem: Dropdown;
    @ViewChild('ddlImplantManufacturer') ddlImplantManufacturer: Dropdown;

    constructor(private apiRequest: ApirequestService,
        private subjects: SubjectsService,
        public icons: IconsService ) {
            this.subscriptions.add(
                this.subjects.isViewPDF.subscribe((isViewPDF: boolean) => {
                    this.isViewPDF = isViewPDF;
                })
            );
         }

    ngOnInit() { }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    // helper functions

    getManufacturers(): SelectItem[] {
        let implantManufacturerData: any = [];
        implantManufacturerData.push(
            {
                label: "Select Manufacturer",
                value: "-1"
            });

        for (var i = 0; i < this.implantData.length; i++) {
            if (implantManufacturerData.find(x => x.value == this.implantData[i].implantmanufacturer_id) == undefined) {
                implantManufacturerData.push(
                    {
                        label: this.implantData[i].manufacturername,
                        value: this.implantData[i].implantmanufacturer_id
                    }
                );
            }
        }

        implantManufacturerData.push({
            label: "Other",
            value: "Other"
        });

        return implantManufacturerData;
    }

    getManufacturerSystems(implantManufacturerId: string): SelectItem[] {
        let system: SelectItem[] = [];
        system.push(
            {
                label: "Select Implant System",
                value: "-1"
            });

        for (var i = 0; i < this.implantData.length; i++) {
            if ((this.implantData[i].implantmanufacturer_id == implantManufacturerId) &&
                (system.find(x => x.value == this.implantData[i].implantsystem_id) == undefined)) {
                system.push(
                    {
                        label: this.implantData[i].implantsystemname,
                        value: this.implantData[i].implantsystem_id
                    }
                );
            }
        }

        system.push({
            label: "Other",
            value: "Other"
        });        

        return system;
    }

    getComponentGroup(implantSystemId: string): ImplantComponentGroup[] {
        let compGroups: ImplantComponentGroup[] = [];

        for (var i = 0; i < this.implantData.length; i++) {
            if ((this.implantData[i].implantsystem_id == implantSystemId) &&
                (compGroups.find(x => x.componentGroupId == this.implantData[i].implantcomponentgroup_id) == undefined)) {
                compGroups.push(
                    {
                        componentGroupName: this.implantData[i].implantcomponentgroupname,
                        componentGroupId: this.implantData[i].implantcomponentgroup_id,
                        implantComponents: this.getComponents(this.implantData[i].implantcomponentgroup_id, this.implantData[i].implantcomponentgroupname),
                        selectedComponents: [],
                        anyComponentSelected: false,
                        isRequired: false,
                        implantSystemId: this.selectedSystemId
                    }
                );
            }
        }

        return compGroups;
    }

    getComponents(componentGroupId: string, componentGroupName: string): SelectItem[] {
        let components: SelectItem[] = [];

        let selectedComps = this.getAddedComponents();

        let contradictingCompIds: string[] = []

        selectedComps.forEach(comp => {
            contradictingCompIds = contradictingCompIds.concat(this.getContradictingComponentIds(comp.implantcomponent_id));
        });

        for (var i = 0; i < this.implantData.length; i++) {
            if ((this.implantData[i].implantsystem_id == this.selectedSystemId) &&
                (this.implantData[i].implantcomponentgroup_id == componentGroupId) &&
                (components.find(x => x.value == this.implantData[i].implantcomponent_id) == undefined)) {
                components.push(
                    {
                        label: `${this.implantData[i].implantcomponentname} (${this.implantData[i].componentidentifier})`,
                        value: this.implantData[i],
                        disabled: (contradictingCompIds.find(id => id == this.implantData[i].implantcomponent_id) != undefined)
                    }
                );
            }
        }

        components.push({
            label: "Other",
            value: { 
                        "implantcomponent_id": "Other",
                        "implantcomponentname": null,
                        "implantmanufacturer_id": this.selectedManufacturerId,
                        "manufacturername": this.selectedManufacturerName,
                        "implantsystem_id": this.selectedSystemId,
                        "implantsystemname": this.selectedSystemName,
                        "implantcomponentgroup_id": componentGroupId,
                        "implantcomponentgroupname": componentGroupName,
                        "componentidentifier": null,
                        "askforquantity": false
                   }
        });

        return components;
    }

    clearAllSelection() {
        // this.ddlImplantManufacturer.clear(null);
        // this.ddlImplantSystem.clear(null);
        // this.implantSystem = [];
        // this.componentGroup = [];
    }

    getAddedComponents(): Implants[] {
        return this.addedComponents.filter(x => x.implantsystem_id == this.selectedSystemId);
    }

    getContradictingComponentIds(componentId: string): string[] {

        let contradictingComps: any = [];

        contradictingComps = this.implantComponentRule.filter(x => x.implantcomponent_id == componentId).map(
            compRules => {
                let rule = JSON.parse(compRules.componentrule);
                if(rule.conflicting) {
                    return rule.conflicting.implantcomponents.map(comp => 
                        comp.implantcomponent_id);
                }
            }
        );

        return contradictingComps[0];
    }    

    getExceptionComponentIds(componentId: string): string[] {

        let exceptionComps: any = [];

        exceptionComps = this.implantComponentRule.filter(x => x.implantcomponent_id == componentId).map(
            compRules => {
                let rule = JSON.parse(compRules.componentrule);
                if(rule.conflicting && rule.conflicting.exception) {
                    return rule.conflicting.exception.implantcomponents.map(comp => 
                        comp.implantcomponent_id);
                }
            }
        );
        
        if (exceptionComps[0]) {
            return exceptionComps[0];
        }
        else {
            return [];
        }
    }

    getSelectedComponents(): Implants[] {
        let components: Implants[] = [];

        this.msComponents.forEach(ms => {
            if (ms.value != undefined) {
                ms.value.forEach(val => components.push(val));
            }
        });

        return components;
    }

    disableComponents(selectedComps: Implants[], systemId: string) {
        let contradictingComps = [];

        selectedComps.forEach(comp => {
            contradictingComps = contradictingComps.concat(this.getContradictingComponentIds(comp.implantcomponent_id));
        });

        this.msComponents.forEach(ms => {
            ms.options.forEach(op => {
                if (contradictingComps.find(x => (x == op.value.implantcomponent_id))) {
                    op.disabled = true;
                }
                else {
                    op.disabled = false;
                }
            });
        });
    }

    enableExceptionComponents(selectedComps: Implants[], systemId: string) {
        let exceptionComps = [];

        selectedComps.forEach(comp => {
            exceptionComps = exceptionComps.concat(this.getExceptionComponentIds(comp.implantcomponent_id));
        });
        
        if (exceptionComps[0] != undefined) {
            this.msComponents.forEach(ms => {
                ms.options.forEach(op => {
                    if (exceptionComps.find(x => (x == op.value.implantcomponent_id))) {
                        op.disabled = false;
                    }
                });
            });
        }
    }

    markRequiredComponentGroups() {
        // reset all groups
        this.componentGroup.map(cg => {
            cg.isRequired = false;
            cg.anyComponentSelected = false;
        });

        let selectedComps = this.getSelectedComponents();

        if (selectedComps.length > 0) {
            let reqGroupsOfSelectedComps = [];

            selectedComps.forEach(comp => {
                if (comp.implantsystem_id == this.selectedSystemId) {
                    reqGroupsOfSelectedComps = reqGroupsOfSelectedComps.concat(this.getRequiredComponentGroups(comp.implantcomponent_id));
                }
            });

            reqGroupsOfSelectedComps.map(rg => {
                let cg = this.componentGroup.find(x => x.componentGroupId == rg);
                if (cg) {
                    cg.isRequired = true;
                    cg.anyComponentSelected = false;
                    for (var i = 0; i < cg.implantComponents.length; i++) {
                        if (selectedComps.filter(sc => (sc.implantcomponent_id == cg.implantComponents[i].value.implantcomponent_id) &&
                        (sc.implantcomponentgroup_id == cg.componentGroupId)).length > 0) {
                            cg.anyComponentSelected = true;
                            break;
                        }
                    }

                    // if (!cg.anyComponentSelected) {
                    //     this.missingComponentGroups.push(cg.componentGroupName);
                    // }
                }                
            });
        }
    }

    initMissingComponentGroups() {
        this.missingComponentGroups = [];

        if (this.addedComponents.length > 0) {

            // Init required groups for all components
            this.addedComponents.forEach(comp => {
                let reqGroups = this.getRequiredComponentGroups(comp.implantcomponent_id);
                if (reqGroups && reqGroups.length > 0) {
                    reqGroups.map(gr => {
                        let addedGroup = this.addedComponents.find(x => 
                            (x.implantsystem_id == comp.implantsystem_id &&
                            x.implantcomponentgroup_id == gr));
                        if (!addedGroup) {
                            let missingGroup = this.implantData.find(x => {
                                return (x.implantsystem_id == comp.implantsystem_id &&
                                x.implantcomponentgroup_id == gr);
                            });
                            let sys: any = this.missingComponentGroups.find(x => x.implantSystemName == missingGroup.implantsystemname);
                            if (sys) {
                                sys.missingComponentGroups = sys.missingComponentGroups.concat(missingGroup.implantcomponentgroupname);
                            }
                            else {
                                sys = new Object();
                                sys.implantSystemName = missingGroup.implantsystemname;
                                sys.missingComponentGroups = [];
                                sys.missingComponentGroups.push(missingGroup.implantcomponentgroupname);
                                this.missingComponentGroups.push(sys);
                            }
                        }
                    });
                }
            });
        }
    }

    sortProcedureImplant() {
        this._procedure.procedureimplants.sort(sortJson("implantmanufacturer_id", "implantsystemname", "implantcomponent_id"));
    }

    getRequiredComponentGroups(componentId: string): string[] {
        let requiredCompGroupIds: any;

        requiredCompGroupIds = this.implantComponentRule.filter(x => x.implantcomponent_id == componentId).map(
            compRules => {
                let rule = JSON.parse(compRules.componentrule);
                if (rule.required) {
                return rule.required.implantcomponentgroups.map(cg => 
                    cg.implantcomponentgroup_id);
                }
            }
        );

        return requiredCompGroupIds[0];
    }

    // Control events

    onImplantManufacturerChange(event) {
        if (event.value != "-1") {
            this.implantSystem = this.getManufacturerSystems(event.value);
            this.selectedManufacturerId = event.value;
            this.selectedManufacturerName = this.implantManufacturer.find(x => x.value == event.value).label;
        }
        else {
            this.implantSystem = [];
        }

        this.componentGroup = [];
    }

    onImplantSystemChange(event) {
        this.selectedSystemId = event.value;
        this.selectedSystemName = this.implantSystem.find(x => x.value == event.value).label;
        this.showAddImplantButton = true;
        this.componentGroup = this.getComponentGroup(event.value);

        // Reselect components which have already been added by user
        this.addedComponents.forEach(comp => {
            if (comp.implantsystem_id == this.selectedSystemId) {
                let cg = this.componentGroup.find(x => x.componentGroupId == comp.implantcomponentgroup_id);
                if (cg) {
                    if (comp.implantcomponent_id == "Other") {
                        cg.selectedComponents.push({
                            implantcomponent_id: "Other",
                            implantcomponentname: null,
                            implantmanufacturer_id: this.selectedManufacturerId,
                            manufacturername: this.selectedManufacturerName,
                            implantsystem_id: this.selectedSystemId,
                            implantsystemname: this.selectedSystemName,
                            implantcomponentgroup_id: cg.componentGroupId,
                            implantcomponentgroupname: cg.componentGroupName,
                            componentidentifier: null,
                            askforquantity: false
                        });
                    }
                    else {
                        cg.selectedComponents.push(comp);
                    }
                }
            }
        });
        
        // Timeout added to wait for the primeng multiselect to initialise
        setTimeout(() => {
            this.markRequiredComponentGroups();
        }, 100);
    }

    onAddImplantData() {

        let selectedComponents = this.getSelectedComponents();

        if(this.selectedManufacturerId == "Other" || this.selectedSystemId == "Other") {
            let procComp = new CoreProcedureImplant();
            
            procComp.implantcomponent_id = "Other";
            procComp.implantcomponentname = null;
            procComp.componentidentifier = null;
            procComp.isothercomponent = true;
            procComp.implantcomponentgroup_id = "Other";
            procComp.implantcomponentgroupname = "Other";
            procComp.implantsystem_id = this.selectedSystemId;
            procComp.implantsystemname = null;
            procComp.isothersystem = true;
            procComp.implantmanufacturer_id = this.selectedManufacturerId;
            procComp.isothermanufacturer = this.selectedManufacturerId == "Other";
            procComp.manufacturername = this.selectedManufacturerName == "Other" ? null : this.selectedManufacturerName;
            procComp.procedure_id = this._procedure.procedure_id;
            procComp.askforquantity = false;
            procComp.quantity = null;
            procComp.procedureimplant_id = uuidv4();

            this._procedure.procedureimplants.push(procComp);
            this.addedComponents.push(procComp);
        }
        else if (selectedComponents.length > 0) {
            selectedComponents.forEach(comp => {
                let addedComp = this.addedComponents.find(x => (
                    x.implantcomponent_id == comp.implantcomponent_id &&
                    x.implantcomponentgroup_id == comp.implantcomponentgroup_id &&
                    x.implantsystem_id == comp.implantsystem_id &&
                    x.implantmanufacturer_id == comp.implantmanufacturer_id
                ));

                if (addedComp == undefined) {
                    let procComp = new CoreProcedureImplant();
                    procComp.implantcomponent_id = comp.implantcomponent_id;
                    procComp.implantcomponentname = comp.implantcomponentname;
                    procComp.componentidentifier = comp.componentidentifier;
                    procComp.quantity = comp.defaultquantity;
                    procComp.isothercomponent = comp.implantcomponent_id == 'Other';
                    procComp.implantcomponentgroup_id = comp.implantcomponentgroup_id;
                    procComp.implantcomponentgroupname = comp.implantcomponentgroupname;
                    procComp.implantsystem_id = comp.implantsystem_id;
                    procComp.implantsystemname = comp.implantsystemname;
                    procComp.isothersystem = comp.implantsystem_id == 'Other';
                    procComp.implantmanufacturer_id = comp.implantmanufacturer_id;
                    procComp.isothermanufacturer = comp.implantmanufacturer_id == 'Other';
                    procComp.manufacturername = comp.manufacturername;
                    procComp.procedure_id = this._procedure.procedure_id;
                    procComp.askforquantity = comp.askforquantity;
                    if (comp.implantcomponent_id != "Other") {
                        procComp.procedureimplant_id = comp.componentidentifier + '|' + comp.implantsystem_id + '|' + this._procedure.procedure_id;
                    }
                    else {
                        procComp.procedureimplant_id = uuidv4();
                    }
                    this._procedure.procedureimplants.push(procComp);
                    this.addedComponents.push(comp);
                }
            });            
            // let filterBy = { implantcomponent_id: selectedComponents.map(comp => comp.implantcomponent_id), implantsystem_id: [this.selectedSystemId] };
            // let result = this.implantData.filter(function (o) {
            //     return Object.keys(filterBy).every(function (k) {
            //         return filterBy[k].some(function (f) {
            //             return o[k] === f;
            //         });
            //     });
            // });

            // result.forEach(r => {
            //     if (this.addedComponents.find(x => x.implantcomponent_id == r.implantcomponent_id && 
            //         x.implantsystem_id == this.selectedSystemId) == undefined) {
                    
            //     }
            // });
            
            this.initMissingComponentGroups();
        }

        this.sortProcedureImplant();

        this.clearAllSelection();
    }

    onRemoveComponent(component: CoreProcedureImplant) {
        this.addedComponents = this.addedComponents.filter(x => {
            return !((x.implantcomponent_id == component.implantcomponent_id) &&
            (x.implantsystem_id == component.implantsystem_id) &&
            (x.implantmanufacturer_id == component.implantmanufacturer_id));
        });

        this._procedure.procedureimplants = this._procedure.procedureimplants.filter(x => {
            return !(x.procedureimplant_id == component.procedureimplant_id);
        });

        this.sortProcedureImplant();
        this.initMissingComponentGroups();
    }

    onComponentChange(event) {
        let selectedComps = this.getSelectedComponents();

        selectedComps = selectedComps.concat(this.getAddedComponents())

        this.disableComponents(selectedComps, this.selectedSystemId);
        this.enableExceptionComponents(selectedComps, this.selectedSystemId);

        this.markRequiredComponentGroups();
    }
}
