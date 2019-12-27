public inherited sharing class CSVReaderController {
    @AuraEnabled
    public static list<Account> readCSVFile(Id idContentDocument){
        list<Account> accounts_to_insert = new list<Account>();
        list<Account> list_accounts_db = [SELECT Id, Identity_Document__c, First_Name__c, Last_Name__c FROM Account LIMIT 500];
        if(idContentDocument != null) {
            
            // getting File Data based on document id 
            ContentVersion objVersion = [SELECT Id, VersionData FROM ContentVersion WHERE ContentDocumentId =:idContentDocument limit 1];
            // split the file data
            list<String> list_csv_lines = objVersion.VersionData.toString().split('\n');
            //check if overload the process
            if(list_csv_lines.size() > 500){
                CustomExceptionData my_own_exception = new CustomExceptionData
                                                        ('Limit csv lines data', 
                                                        'You are not allow to import a CSV with ' + list_csv_lines.size() + ' lines.', 
                                                        999);
                throw new AuraHandledException(JSON.serialize(my_own_exception));
            } else //CHECK FORMAT FILE
                if(list_csv_lines[0].contains(';') && list_csv_lines.size() > 0){
                CustomExceptionData my_own_exception = new CustomExceptionData
                                                        ('Invalid Format',
                                                        'Please use a CSV file separated  with commas instead of semicolon.', 
                                                        666);
                throw new AuraHandledException(JSON.serialize(my_own_exception));
            }
            String HEADER = list_csv_lines[0];
            Boolean has_id_column = false;
            String defaulf_header = 'Identity_Document__c,First_Name__c,Last_Name__c';
            string default_header_id = 'id,Identity_Document__c,First_Name__c,Last_Name__c';

            if(HEADER.contains('id,')){
                system.debug('@@@ contains id');
                has_id_column = true;
            }else{
                system.debug('@@@ ! contains id');
            }

            for(Integer i = 1; i < list_csv_lines.size(); i++){
                Account obj_acc = new Account();
                list<String> csv_row_data = list_csv_lines[i].split(',');
                System.debug('csv_row_data====> '+csv_row_data);
                if(has_id_column){
                    obj_acc.Aux_Id__c = csv_row_data[0];
                    obj_acc.Identity_Document__c = csv_row_data[1];
                    obj_acc.Name = csv_row_data[2] + csv_row_data[3];
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
