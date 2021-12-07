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



import { Component, Input, OnInit, OnDestroy, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AppService } from './services/app.service';
import { SubjectsService } from './services/subjects.service';
import { ApirequestService } from './services/apirequest.service';
import { OperationDiagnosisComponent } from './operation-diagnosis/operation-diagnosis.component';
import { OperationProcedureComponent } from './operation-procedure/operation-procedure.component';
import { ProcedureDetailComponent } from './procedure-detail/procedure-detail.component';
import { ErrorHandlerService } from './services/error-handler.service';
import AppConfig from "src/assets/config/operation-note.config.json"
import { saveAs } from 'file-saver';
import { OperationNoteService } from './services/operation-note.service';
import { ProcedureImplantComponent } from './procedure-implant/procedure-implant.component';
import { CoreOperation } from './models/entities/core-operation.model';
import { EndpointsService } from './services/endpoints.service';
import { OperationProviderComponent } from './operation-provider/operation-provider.component';
import { OperationDetailComponent } from './operation-detail/operation-detail.component';
import { TerminologyService } from './services/terminology.service';
import { ProviderService } from './services/provider.service';
import { filters, filter, filterParams, filterparam, selectstatement, orderbystatement } from './models/filter.model';
import { CoreOperationNoteHistory } from './models/entities/core-operation-note-history.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    isLoading: boolean = true;
    isProcessing: boolean = false;
    isTerminologyLoaded: boolean = false;
    isDraft: boolean = false;
    isSubmitted: boolean = false;
    isLoadingJSON: boolean = true;
    isAddOrEditMode: boolean = false;
    isViewOnlyMode: boolean = false;
    allowSaveAsDraft: boolean = false;
    modalRef: BsModalRef;
    title = 'terminus-module-operation-note';
    isViewPDF: boolean = false;

    isRecordDeleted: Subject<boolean> = new Subject();

    @ViewChild('closeDeleteConfirm') closeDeleteConfirmModalButton: ElementRef;
    @ViewChild('closeModal') closeComponentModalButton: ElementRef;
    @ViewChild('opProviderComp') opProviderComp: OperationProviderComponent;
    @ViewChild('diagnoses') opDiagnoses: OperationDiagnosisComponent;
    @ViewChild('procedures') opProcedures: OperationProcedureComponent;
    @ViewChildren('procedureDetail') opProcedureDetail: QueryList<ProcedureDetailComponent>;
    @ViewChild('opImplants') opImplants: ProcedureImplantComponent;
    @ViewChild('operationDetailComp') operationDetailComp: OperationDetailComponent;

    @ViewChild("pdfBodyDiv") divPdfBody: ElementRef;

    @ViewChild("pdfHeaderDiv") divPdfHeader: ElementRef;
    @ViewChild("implantValidationModal") implantValidationModal: ModalDirective;
    @ViewChild("confirmSaveModal") confirmSaveModal: ModalDirective;
    @ViewChild("hendersonOutcomeModal") hendersonOutcomeModal: ModalDirective;
    @ViewChild("confirmCloseHendersonModal") confirmCloseHendersonModal: ModalDirective;
    @ViewChild("pdfViewer") pdfViewer: ElementRef;

    isModalShown = false;

    //isDocumentDownloaded: boolean = true;

    pdfCssUrl: string = AppConfig.pdfSettings.pdfCssUrl;

    popupHeader: string = "OperationNote";

    subscriptions: Subscription = new Subscription();

    //operationId: string;

    //personId: string;

    dbOperation: CoreOperation;
    operation: CoreOperation = new CoreOperation();

    opNoteToDelete: CoreOperation = null;

    allOperations: CoreOperation[] = [];

    operationNoteHistories: CoreOperationNoteHistory[] = [];

    proceduresWithMissingComponentGroups: any = [];
    implantValidationErrorCode: string = "";

    operationNoteHistory: CoreOperationNoteHistory;
    isPdfGenerated: boolean = false;
    isCurrentPdfVersion: boolean = false;

    @Input() set datacontract(value: any) {

        this.appService.personId = value.personId;
        this.appService.contexts = value.contexts;
        if (value.contexts.length > 0) {
            this.appService.operationId = value.contexts[0].operation_id;
        }
        this.subjects.unload = value.unload;
        //this.personId = value.personId;

        if (!this.appService.apiService) {
            this.initConfig(value);
        }
        else {
            this.subjects.contextChange.next();
        }
    }

    async initConfig(value: any) {
        this.appService.apiService = value.apiService;

        let decodedToken: any;
        if (this.appService.apiService) {
            decodedToken = this.appService.decodeAccessToken(this.appService.apiService.authService.user.access_token);
            if (decodedToken != null)
                this.appService.loggedInUserName = decodedToken.name ? (Array.isArray(decodedToken.name) ? decodedToken.name[0] : decodedToken.name) : decodedToken.IPUId;
        }

        await this.terminologyService.initTerminologies();

        await this.providerService.initAllProviders();

        // Initialise configuration
        this.subscriptions.add(
            this.apiRequest.getRequest("./assets/config/operation-note.config.json").subscribe(
                (response) => {
                    this.appService.appConfig = response;
                    this.appService.baseURI = this.appService.appConfig.uris.dynamicApiUri;
                    this.appService.terminologyBaseURI = this.appService.appConfig.uris.terminologyApiUri;
                    this.appService.enableLogging = this.appService.appConfig.enablelogging;

                    //emit events after getting initial config. //this happens on first load only.
                    this.appService.logToConsole("Context is being published from init config");
                    this.subjects.contextChange.next();
                }
            )
        );
        
        this.hendersonOutcomeModal.config.backdrop = "static";
        this.hendersonOutcomeModal.config.keyboard = false;
        
        this.confirmCloseHendersonModal.config.backdrop = "static";
        this.confirmCloseHendersonModal.config.keyboard = false;
    }

    constructor(public appService: AppService,
        private subjects: SubjectsService,
        private apiRequest: ApirequestService,
        private errorHandlerService: ErrorHandlerService,
        private operationNoteService: OperationNoteService,
        private endpoints: EndpointsService,
        public terminologyService: TerminologyService,
        private providerService: ProviderService,
        private modalService: BsModalService) {
        this.isLoading = true;
        this.subscriptions.add(
            this.subjects.contextChange.subscribe(async () => {

                await this.getAllOperation();
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.appService.destructor();
        this.subscriptions.unsubscribe();
        this.subjects.unload.next("app-operation-note");
    }

    validateForm() {
        return this.operation.operationpreparation.torniquetpressure == 0 ||
            this.operation.operationpreparation.torniquettime == 0;
    }

    async getAllOperation() {
        let opData = await this.apiRequest.getRequest(this.endpoints.getAllOperationsUrl + this.appService.personId).toPromise();

        this.allOperations = JSON.parse(opData);
        this.allOperations.forEach(op => {
            op.procedures = JSON.parse(op.procedures.toString());
            op.diagnoses = JSON.parse(op.diagnoses.toString());
            op.operationproviders = JSON.parse(op.operationproviders.toString());
            op.hendersonoutcome = op.hendersonoutcome != null ? JSON.parse(op.hendersonoutcome.toString()) : null;
        });
        
        this.isLoading = false;
    }

    getMissingComponentGroups() {
        let procs = [];
        
        this.opProcedureDetail.map(proc => {
            if (proc.opImplantComponents.missingComponentGroups.length > 0) {
                let procMissingGroup: any = new Object();
                procMissingGroup.procedureName = proc.procedure.name;
                procMissingGroup.missingComponentGroups = proc.opImplantComponents.missingComponentGroups;

                procs.push(procMissingGroup);
            }
        });

        return procs;
    }

    async getBase64Pdf(pdfBlob: Blob) {
        return new Promise<string>((resolve) => {
            var reader = new FileReader();
            reader.readAsDataURL(pdfBlob); 
            reader.onloadend = function() {
                resolve(reader.result.toString());
            };
        });
    }

    showImplantValidationModal(): void {
        this.implantValidationModal.show();
    }

    hideImplantValidationModal(): void {
        this.implantValidationModal.hide();
    }

    async onSaveOperationNote() {

        this.proceduresWithMissingComponentGroups = this.getMissingComponentGroups();
        
        if (this.proceduresWithMissingComponentGroups.length > 0) {
            this.implantValidationErrorCode = "ERROR";
            setTimeout(() => {
                this.showImplantValidationModal();
            }, 500);
        }
        else {
            // Show confirmation modal
            this.generateOperationNotePdf();            
            this.confirmSaveModal.show();
        }
    }

    async onConfirmSave() {
        this.isProcessing = true;

        if (this.dbOperation.operationnotestatuscode != null) {
            await this.operationNoteService.deleteOperationNote(this.dbOperation);
        }
        this.operation._createdby = this.appService.loggedInUserName;
        await this.operationNoteService.saveOperationNote(this.operation, "SUBMITTED");
        
        await this.operationNoteService.saveOperationNoteHistory(this.operationNoteHistory);
        
        this.isAddOrEditMode = false;
        this.isProcessing = false;
        
        this.confirmSaveModal.hide();

        this.isLoading = true;
        await this.getAllOperation();
    }

    async onSaveAsDraft() {
        
        this.proceduresWithMissingComponentGroups = this.getMissingComponentGroups();        

        if (this.proceduresWithMissingComponentGroups.length > 0 && !this.allowSaveAsDraft) {
            this.allowSaveAsDraft = true;
            this.implantValidationErrorCode = "WARNING";
            setTimeout(() => {
                this.showImplantValidationModal();
            }, 200);
        }
        else {
            this.hideImplantValidationModal();
            this.isProcessing = true;

            if (this.dbOperation.operationnotestatuscode != null) {
                await this.operationNoteService.deleteOperationNote(this.dbOperation);
            }
            this.operation._createdby = this.appService.loggedInUserName;
            await this.operationNoteService.saveOperationNote(this.operation, "DRAFT");

            //this.getOperationJson();

            this.isProcessing = false;
            setTimeout(() => {
                this.closeComponentModalButton.nativeElement.click();
                this.isAddOrEditMode = false;
            }, 100);

            this.isLoading = true;
            await this.getAllOperation();
        }
    }

    onModalClose() {
        this.isViewPDF = false;
        this.subjects.isViewPDF.next(false);
        this.isViewPDF = false;
        this.isAddOrEditMode = false;
        //this.closeComponentModalButton.nativeElement.click();
    }

    onEditOperationNote(operationId) {
        this.isLoadingJSON = true;
        this.isAddOrEditMode = true;

        this.subscriptions.add(
            this.apiRequest.getRequest(this.endpoints.getOperationJsonUrl + operationId).subscribe(
                (data: any) => {
                    let opNoteData = JSON.parse(data);

                    if (opNoteData.operationjson != undefined) {                      
                        this.operation = JSON.parse(opNoteData.operationjson);
                        this.dbOperation = JSON.parse(opNoteData.operationjson);

                        this.isDraft = true;
                        this.subjects.operation.next(this.operation);
                        
                        this.operation._createdby = this.appService.loggedInUserName;
                        
                        this.isLoadingJSON = false;

                    }
                    else {
                        throw ("Unable to load operation JSON")
                    }
                }
            )
        );
    }

    onViewOperationNote(op: CoreOperation) {
        
        this.isViewOnlyMode = true;
        this.isPdfGenerated = false;
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.baseURI + AppConfig.dynamicApiEndpoints.find(x => x.endpointName == "BvGetOperationNotePdf").url + op.operation_id).subscribe(
                (response) => {
                    this.operationNoteHistory = JSON.parse(response)[0];
                    this.isPdfGenerated = true;
                    this.isCurrentPdfVersion = true;
            })
        );
    }

    onOpenOperationPDFHistory(operationNoteHistoryId: string, filename: string, isCurrentVersion: boolean) {
        this.isViewOnlyMode = true;
        this.isPdfGenerated = false;
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.baseURI + AppConfig.dynamicApiEndpoints.find(x => x.endpointName == "GetOperationNoteHistory").url + operationNoteHistoryId).subscribe(
                (response) => {
                    this.operationNoteHistory = JSON.parse(response);
                    this.operationNoteHistory.filename = filename;                    

                    this.isPdfGenerated = true;
                    this.isCurrentPdfVersion = isCurrentVersion;
            })
        );
    }

    async onDownloadPdf() {
        const byteCharacters = atob(this.operationNoteHistory.pdfblob);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: "application/pdf"});

        let hospitalNumber = await this.operationNoteService.getPersonHospitalNumber(this.appService.personId);

        saveAs(blob, hospitalNumber + ' ' + this.operationNoteHistory.filename + ".pdf");
    }
    
    onViewOperationNoteHistory(op: CoreOperation) {
        this.subscriptions.add(
            this.apiRequest.getRequest(this.appService.baseURI + AppConfig.dynamicApiEndpoints.find(x => x.endpointName == "BvGetOperationNotePdfHistory").url + op.operation_id)
                .subscribe((response) => {
                    this.operationNoteHistories = JSON.parse(response);
                })
        );
    }

    onAddHendersonOutcome(operationId) {
        this.isLoadingJSON = true;
        this.subscriptions.add(
            this.apiRequest.getRequest(this.endpoints.getOperationJsonUrl + operationId).subscribe(
                (data: any) => {
                    let opNoteData = JSON.parse(data);

                    if (opNoteData.operationjson != undefined) {
                        this.operation = JSON.parse(opNoteData.operationjson);
                        this.dbOperation = JSON.parse(opNoteData.operationjson);                                                              
                        this.subjects.operation.next(this.operation);
                        this.isLoadingJSON = false;
                    }
                    else {
                        throw ("Unable to load operation JSON")
                    }
                }
            )
        );
    }

    async onDeleteHendersonOutcome() {
        this.isProcessing = true;
        await this.operationNoteService.deleteHendersonOutcome(this.operation.hendersonoutcome);
        
        this.isProcessing = false;
        this.hendersonOutcomeModal.hide();
        this.isLoading = true;
        this.getAllOperation();
    }

    async onSaveHendersonOutcome() {
        if ((this.operation.hendersonoutcome.comments == null ||
            this.operation.hendersonoutcome.comments.length == 0) && 
            !this.operation.hendersonoutcome.isasepticloosening && 
            !this.operation.hendersonoutcome.isinfection && 
            !this.operation.hendersonoutcome.issofttissuefailure && 
            !this.operation.hendersonoutcome.isstructurefailure && 
            !this.operation.hendersonoutcome.istumorprogression) {
                
        }
        else {
            this.isProcessing = true;
            this.confirmCloseHendersonModal.hide();
            setTimeout(async () => {
                await this.operationNoteService.saveHendersonOutcome(this.operation.hendersonoutcome);
                this.isProcessing = false;
                this.hendersonOutcomeModal.hide();
                this.isLoading = true;
                this.getAllOperation();
            }, 1000);  
        }
    }

    // createOpNoteHistoryFilter(operationId: string) {
    //     let condition = "operation_id = @operation_id and person_id = @person_id";
    //     let f = new filters()
    //     f.filters.push(new filter(condition));

    //     let pm = new filterParams();
    //     pm.filterparams.push(new filterparam("operation_id", operationId));
    //     pm.filterparams.push(new filterparam("person_id", this.appService.personId));

    //     let select = new selectstatement("SELECT * ");

    //     let orderby = new orderbystatement("ORDER BY 1 DESC");

    //     let body = [];
    //     body.push(f);
    //     body.push(pm);
    //     body.push(select);
    //     body.push(orderby);

    //     return JSON.stringify(body);
    // }

    onImplantValidationModalHidden(): void {
        this.allowSaveAsDraft = false;
        this.proceduresWithMissingComponentGroups = [];
    }

    onEditSavedOpNote() {
        this.isViewOnlyMode = false;
        this.onEditOperationNote(this.operationNoteHistory.operation_id);
    }
    
    cleanUpHTML(html: string) {
        return html.replace(/#/g, "%23").replace(/(?:\r\n|\r|\n)/g, ' <br />').replace(/∅/g, "&empty;");
    }

    generateOperationNotePdf() {
        this.isPdfGenerated = false;
        this.subjects.isViewPDF.next(true);
        this.isViewPDF = true;

        setTimeout(async() => {
            var mediaType = 'application/pdf';
            let pdfDocBody: any = {
                "pdfBodyHTML": this.cleanUpHTML(this.divPdfBody.nativeElement.innerHTML),
                "pdfCssUrl": this.pdfCssUrl,
                "pdfHeaderHTML": this.divPdfHeader.nativeElement.innerHTML,
                "pdfFooterHTML": "<div class=\"page-footer\" style=\"width:100%; text-align:center; font-size:6px; margin-right:10px\">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>"
            };

            let response = await this.apiRequest.getDocumentByPost(AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GeneratePdfDocument").url, pdfDocBody)
                    .toPromise();
            let base64Pdf = await this.getBase64Pdf(new Blob([response], { type: mediaType }));
            this.operationNoteHistory = {
                operation_id: this.operation.operation_id,
                operationnotehistory_id: uuidv4(),
                pdfblob: base64Pdf.split(',')[1],
                isretrospectivedata: this.operation.isretrospectivedata, 
                filename: this.operation.latestoperationnotehistory.filename
            };
            
            this.isViewPDF = false;
            this.subjects.isViewPDF.next(false);
            this.isPdfGenerated = true;
        }, 1000);
    }

    /*
    viewPdf() {
        this.isViewPDF = true;
        this.subjects.isViewPDF.next(true);
        this.isViewPDF = true;
        this.isProcessing = true;

        setTimeout(() => {

            this.isDocumentDownloaded = false;
            var mediaType = 'application/pdf';
            let pdfDocBody: any = {
                "pdfBodyHTML": this.divPdfBody.nativeElement.innerHTML,
                "pdfCssUrl": this.pdfCssUrl,
                "pdfHeaderHTML": this.divPdfHeader.nativeElement.innerHTML,
                "pdfFooterHTML": "<div class=\"page-footer\" style=\"width:100%; text-align:right; font-size:6px; margin-right:10px\">Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>"
            };

            this.subscriptions.add(
                this.apiRequest.getDocumentByPost(AppConfig.dynamicApiEndpoints.find((x: { endpointName: string }) => x.endpointName == "GeneratePdfDocument").url, pdfDocBody)
                    .subscribe(
                        (response) => {
                            var blob = new Blob([response], { type: mediaType });
                            saveAs(blob, this.popupHeader + ".pdf");
                            this.isDocumentDownloaded = true;

                            this.isProcessing = false;
                            setTimeout(() => {
                                this.closeComponentModalButton.nativeElement.click();
                            }, 100);
                        },
                        error => {
                            this.isDocumentDownloaded = true;
                            this.errorHandlerService.handleError(error);

                            this.isProcessing = false;
                            setTimeout(() => {
                                this.closeComponentModalButton.nativeElement.click();
                            }, 100);
                        }
                    )
            );
        }, 1000);
    }
    */
}
