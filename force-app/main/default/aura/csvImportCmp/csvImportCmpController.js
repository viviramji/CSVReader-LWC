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
        cmp.set('v.headers', headers);
        for (let index in headers) {
          console.log(headers[index]);
          columns.push({
            label: headers[index].trim(),
            fieldName: headers[index].trim(),
            type: 'text',
            editable: false
          });
        }

        columns.push({
          label: 'Status', fieldName: 'actionState', type: 'button', initialWidth: 150, typeAttributes:
            { label: { fieldName: 'createOrUpdate' }, title: 'Status', name: 'status', variant: { fieldName: 'variant' }, class: 'btn_next' }
        });

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
    var obj = {};
    var isToSave = true;
    var data = cmp.get('v.data');
    var headers = cmp.get('v.headers');
    cmp.set('v.saving', true);
    //console.log('@@@ ' + JSON.stringify(data[1]));
    for (let index in headers) {
      if(headers[index].trim() == 'Id'){
        if (data[0][headers[index].trim()].trim() != '0') {
          obj[headers[index].trim()] = data[0][headers[index].trim()].trim();
          isToSave = false;
        } else {
          obj.Id = undefined;
          isToSave = true;
        }
      }else{
        obj[headers[index].trim()] = data[0][headers[index].trim()].trim();
      }
      //console.log(`esta naciendo un nuevo obj ${JSON.stringify(obj)}`);
    }

    if(isToSave){
      helper.save(cmp, obj, 0);
    }else{
      helper.update(cmp, obj, 0);
    }

  }
})
