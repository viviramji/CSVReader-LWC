import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import readCSV from '@salesforce/apex/CSVReaderController.readCSVFile';
import import_data from '@salesforce/apex/CSVReaderController.import_data';

const columns = [
    { label: 'id', fieldName: 'Aux_Id__c'},
    { label: 'Identity Document', fieldName: 'Identity_Document__c' }, 
    { label: 'First Name', fieldName: 'First_Name__c' },
    { label: 'Last Name', fieldName: 'Last_Name__c'},
    { label: 'Status', fieldName: 'Status__c'}
];

export default class CSVReader extends LightningElement {
    @api recordId;
    @track error;
    @track columns = columns;
    @track data;

    // accepted parameters
    get acceptedFormats() {
        return ['.csv'];
    }
    
    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        window.console.log('files length ' + uploadedFiles.length);
        // calling apex class
        readCSV({idContentDocument : uploadedFiles[0].documentId})
        .then(res => {
            window.console.log('res ===> '+res);
            this.error = '';
            this.data = res;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Uploaded file!',
                    variant: 'success',
                }),
            );
        })
        .catch(error => {
            var error_excep = JSON.parse(JSON.stringify(error)).body;
            this.error = error_excep.message;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error,
                    variant: 'error',
                }),
            );     
        })
    }

    importData(){
        // TODO: Import process
        //call apex import class
        import_data({ accounts_to_import: this.data })
        .then(res => {
            this.data = res;
            window.console.log(JSON.parse(JSON.stringify(res)));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success!!',
                    message: 'Imported data!',
                    variant: 'success',
                }),
            );
        })
        .catch(error =>{
            window.console.error(JSON.stringify(error));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error on Importing data',
                    message: JSON.stringify(error),
                    variant: 'Error'
                }),
            )
        })
    }
}