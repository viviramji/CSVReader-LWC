import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import readCSV from '@salesforce/apex/CSVReaderController.readCSVFile';
import import_data from '@salesforce/apex/CSVReaderController.import_data';

const columns = [
  { label: 'id', fieldName: 'Aux_Id__c' },
  { label: 'Identity Document', fieldName: 'Identity_Document__c' },
  { label: 'First Name', fieldName: 'First_Name__c' },
  { label: 'Last Name', fieldName: 'Last_Name__c' },
  { label: 'Status', fieldName: 'Status__c' }
];

export default class CSVReader extends LightningElement {
  @api recordId;
  @track error;
  @track isLoaded;
  @track columns = columns;
  @track data;
  sizeOfSpinner = 'small';

  // accepted parameters
  get acceptedFormats() {
    return ['.csv'];
  }

  handleUploadFinished(event) {
    // Get the list of uploaded files
    //TODO: Allow more than one file DONE
    var docIds = [];
    if (this.data != null || this.error != null) {
      this.data = null;
      this.error = null;
    }
    this.isLoaded = true;
    const uploadedFiles = event.detail.files;
    for (let i = 0; i < uploadedFiles.length; i++) {
      docIds.push(uploadedFiles[i].documentId);
    }

    // calling apex class and make sure only 10 files upload
    readCSV({ docIds: docIds })
      .then(res => {
        window.console.log('res ===> ' + res);
        this.data = res;
        this.isLoaded = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success!!',
            message: 'Uploaded file!',
            variant: 'success',
          }),
        );
      })
      .catch(error => {
        let error_excep = JSON.parse(JSON.stringify(error)).body;
        this.error = error_excep.message;
        this.isLoaded = false;
        this.data = null;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error!!',
            message: error_excep.message,
            variant: 'error',
          }),
        );
      })

  }

  importData() {
    // TODO: Import process DONE
    //call apex import class
    this.isLoaded = true;
    import_data({ accounts_to_import: this.data })
      .then(res => {
        this.isLoaded = false;
        this.data = res;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success!!',
            message: 'Accounts were created based CSV file!!!!',
            variant: 'success',
          }),
        );
      })
      .catch(error => {
        this.isLoaded = false;
        let error_excep = JSON.parse(JSON.stringify(error)).body;
        this.error = error_excep.message;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error!!',
            message: error_excep.message,
            variant: 'error',
          }),
        );
      })
  }
}