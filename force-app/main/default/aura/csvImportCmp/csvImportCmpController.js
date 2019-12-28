({
  handleUploadFinished: function (cmp, evt, helper) {
    cmp.set('v.isLoading', true);
    var uploaded_file = evt.getParam("files");
    var columns = [];
    var data = [];
    var count = 0;

    console.log(uploaded_file.length);

    for (var i = 0; i < uploaded_file.length; i++) {

      var reader = new FileReader();
      reader.readAsText(uploaded_file[i], "UTF-8");
      reader.onload = function (evt) {
        //clean columns to avoid multiple same columns
        columns = [];
        count = count + 1;
        var csv = evt.target.result;
        console.log(csv);
        var lines = csv.split('\n');
        var headers = lines[0].split(',');
        for (let index in headers) {
          console.log(headers[index]);
          columns.push({
            label: headers[index].trim(),
            fieldName: headers[index].trim(),
            type: 'text',
            editable: false
          });
        }
        
        for (let index in lines) {
          console.log(lines[index]);
          //we need to check value instead of type and value ;) so anyways xD
          if (index != '0') {
            data.push(helper.getJson(lines[index], headers));
          }
        }
        //checking
        console.log(data);

        if (count == uploaded_file.length) {

          cmp.set('v.isLoading', false);
          cmp.set('v.data', data);
          cmp.set('v.columns', columns);
        }
      
      }     
    } 
  },

  importCSV: function (cmp, evt, helper) {
    cmp.set('v.saving', true);
  }
})
