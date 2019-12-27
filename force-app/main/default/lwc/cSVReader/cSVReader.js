import { LightningElement, track, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import readCSV from '@salesforce/apex/CSVReaderController.readCSVFile';

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

        // calling apex class
        readCSV({idContentDocument : uploadedFiles[0].documentId})
        .then(result => {
            window.console.log('result ===> '+result);
            this.error = '';
            this.data = result;
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
        window.console.log(this.data.Last_Name__);
    }
}