({

  getJson: function (lines, headers) {
    var colums = lines.split(',');
    var obj = {}
    for (let header_index in headers) {
      obj[headers[header_index].trim()] = colums[header_index].trim();
      obj.createOrUpdate = 'No action';
      obj.variant = 'Neutral';
    }
    //console.log(`Returning obj ${JSON.stringify(obj)}`);
    return obj;
  },

  save: function (cmp, obj, row) {
    var action = cmp.get('c.set_account');
    action.setParams({
      acc: obj,
    });

    action.setCallback(this, function (res) {
      var state = res.getState();

      var data = cmp.get('v.data');
      var headers = cmp.get('v.headers');

      if (state === "SUCCESS") {
        var objReturn = res.getReturnValue();
        console.log(data[row]);
        data[row].createOrUpdate = 'Created';
        data[row].variant = 'success';
        data[row].Id = objReturn.Id;
      } else {
        let errors = res.getError();
        let message = 'Unknown error'; // Default error message
        // Retrieve the error message sent by the server
        if (errors && Array.isArray(errors) && errors.length > 0) {
          message = errors[0].message;
        }
        // Display the message
        console.error(message);

        if(message.includes('DUPLICATE_VALUE')){
          message = 'Duplicate CC'
        }else{
          message = 'Error'
        }

        data[row].createOrUpdate = message;
        data[row].variant = 'destructive';
      }
      cmp.set("v.data", data);
      if ((row + 1) < data.length) {
        console.log(`data: ${data[row + 1]}`);
        var obj = {}
        var save = true;
        for (let i in headers) {
          if (headers[i].trim() == 'id') {
            if (data[row + 1][headers[i].trim()].trim() != '0') {
              obj[headers[i].trim()] = data[row + 1][headers[i].trim()].trim();
              save = false;
            } else {
              obj.Id = undefined;
              save = true;
            }
          } else {
            obj[headers[i].trim()] = data[row + 1][headers[i].trim()].trim();
          }

        }

        if (save) {
          this.save(cmp, obj, row + 1);
        } else {
          this.update(cmp, obj, row + 1);
        }
      } else {
        cmp.set('v.saving', false);
      }
    })
    $A.enqueueAction(action);
  },

  update: function (cmp, obj, row) {
    var action = cmp.get("c.update_account");
    action.setParams({
      acc: obj,
    });
    action.setCallback(this, function (res) {
      var state = res.getState();
      var data = cmp.get('v.data');
      var headers = cmp.get('v.headers');

      if (state === "SUCCESS") {
        var rsl = res.getReturnValue();
        data[row].createOrUpdate = 'Updated';
        data[row].variant = 'brand';
      } else {
        let errors = res.getError();
        let message = 'Unknown error'; // Default error message
        // Retrieve the error message sent by the server
        if (errors && Array.isArray(errors) && errors.length > 0) {
          message = errors[0].message;
        }
        // Display the message
        console.error(message);

        if(message.includes('DUPLICATE_VALUE')){
          message = 'Duplicate CC'
        }else{
          message = 'Error'
        }
        data[row].createOrUpdate = message;
        data[row].variant = 'destructive';
      }
      cmp.set("v.data", data);

      if ((row + 1) < data.length) {
        console.log(`data: ${data[row + 1]}`);
        var obj = {}
        var save = true;
        for (let i in headers) {
          if (headers[i].trim() == 'Id') {
            if (data[row + 1][headers[i].trim()].trim() != '0') {
              obj[headers[i].trim()] = data[row + 1][headers[i].trim()].trim();
              save = false;
            } else {
              obj.Id = undefined;
              save = true;
            }
          } else {
            obj[headers[i].trim()] = data[row + 1][headers[i].trim()].trim();
          }

        }
        if (save) {
          this.save(cmp, obj, row + 1);
        } else {
          this.update(cmp, obj, row + 1);
        }

      } else {
        cmp.set('v.saving', false);
      }
    })
    $A.enqueueAction(action);
  }
})
