public inherited sharing class CSVReaderController {
    @AuraEnabled
    public static list<Account> readCSVFile(List<Id> docIds){
        System.debug(docIds);
        list<Account> accounts_to_insert = new list<Account>();
        list<Account> list_accounts_db = [SELECT Id, Identity_Document__c, First_Name__c, Last_Name__c FROM Account LIMIT 500];
        if(docIds[0] != null) {
            List<ContentVersion> objVersion = new List<ContentVersion>();
            list<list<String>> list_csv_lines = new List<List<String>>();
            // getting File Data based on document id 
            for(Id id : docIds){
                objVersion.add([SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:id]);
            }
            
            // split the file data
            for(ContentVersion obj_doc : objVersion){
                list_csv_lines.add(obj_doc.VersionData.toString().split('\n'));
            }

            system.debug('@@@ ' + list_csv_lines);
            //make magic, neh 
            for(Integer i = 0; i < list_csv_lines.size(); i++){
                for(Integer j = 0; j < list_csv_lines[i].size(); j++){
                    //every first line of a file from each file has a header so we skip
                    String HEADER = list_csv_lines[i][0];
                    Boolean has_id_column = false;
                    if(HEADER.contains('id,')){
                        system.debug('@@@ contains id');
                        has_id_column = true;
                    }else{
                        system.debug('@@@ ! contains id');
                    }
                    if( j != 0){

                        //file validity
                        if(list_csv_lines[i][j].contains(';') ){
                            throw new AuraHandledException('Please use a CSV file separated  with commas \',\' instead of semicolon. \';\'');
                        }

                        Account obj_acc = new Account();
                        list<String> csv_row_data = list_csv_lines[i][j].split(',');
                        System.debug('csv_row_data====> '+csv_row_data);
                        if(has_id_column){
                            obj_acc.Aux_Id__c = csv_row_data[0];
                            obj_acc.Identity_Document__c = csv_row_data[1];
                            obj_acc.Name = csv_row_data[2] + ' ' + csv_row_data[3];
                            obj_acc.First_Name__c = csv_row_data[2];
                            obj_acc.Last_Name__c = csv_row_data[3];
                            obj_acc.Status__c = get_status_record(obj_acc, list_accounts_db);
                            accounts_to_insert.add(obj_acc);
                        }else{
                            obj_acc.Aux_Id__c = '0';
                            obj_acc.Identity_Document__c = csv_row_data[0];
                            obj_acc.Name = csv_row_data[1] + csv_row_data[2];
                            obj_acc.First_Name__c = csv_row_data[1];
                            obj_acc.Last_Name__c = csv_row_data[2];
                            obj_acc.Status__c = get_status_record(obj_acc, list_accounts_db);
                            accounts_to_insert.add(obj_acc);
                        }
                    }
                }
            }
            System.debug('@@@ ' + accounts_to_insert);
        }
        return accounts_to_insert;    
    }


    public static String get_status_record(Account acc_to_validate, List<Account> accounts){
        for(Account acc : accounts){
            if(acc.Identity_Document__c == acc_to_validate.Identity_Document__c){
                acc_to_validate.Aux_Id__c = acc.Id;
                acc_to_validate.Id = acc.Id;
                return 'Already Exists';
            }
        }
        acc_to_validate.Aux_Id__c = '0';
        return 'Brand new';
    } 

    @AuraEnabled
    public static list<Account> import_data(List<Account> accounts_to_import){
        System.debug('@@@ called from import button');
        System.debug(accounts_to_import);
        try{
            upsert accounts_to_import;
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
        return accounts_to_import; 
    }
}
