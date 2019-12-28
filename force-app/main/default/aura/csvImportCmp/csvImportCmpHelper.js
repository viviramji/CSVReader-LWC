({
  test: function () {

  },

  getJson: function (lines, headers) {
    var colums = lines.split(',');
    var obj = {}
    for (let header_index in headers) {
      obj[headers[header_index].trim()] = colums[header_index].trim();
    }

    console.log(`Returning an json ${JSON.stringify(obj)}`);
    return obj;
  }
})
