var SimpleWorker = module.exports = {};
var http = require("http");
var utils = require("util");
var fs = require("fs");
var _request = require("request");

SimpleWorker.DEFAULT_PORT = 80;
SimpleWorker.DEFAULT_HOST = "worker-aws-us-east-1.iron.io";
SimpleWorker.init = function(host, port, version, token, protocol) {
    if(protocol === undefined || protocol === null)
        protocol = "http";
    if(host === undefined || host === null)
        host = SimpleWorker.DEFAULT_HOST;
    if(port === undefined || port === null)
        port = SimpleWorker.DEFAULT_PORT;
    
    SimpleWorker.url = protocol + "://"+host+":"+port+"/"+version+"/";
    console.log("url = " + SimpleWorker.url);
    SimpleWorker.token = token;
    SimpleWorker.version = version;
    SimpleWorker.project_id = '';
    SimpleWorker.headers = {};
    SimpleWorker.headers['Accept'] = "application/json";
    SimpleWorker.headers['Accept-Encoding'] = "gzip, deflate";
    SimpleWorker.headers['User-Agent'] = "SimpleWorker: Node-Ironworker v0.1";
    SimpleWorker.web_client = http.createClient();
    
};


SimpleWorker.__set_common_headers = function() {
    SimpleWorker.headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "User-Agent": "IronWorker Node-IronWorker v0.1",
    };    
}

SimpleWorker.__merge_headers = function(base, new_headers) {
    var cloned = {};
    for (var attrname in base) { cloned[attrname] = base[attrname]; }
    for (var attr_name in new_headers) { cloned[attr_name] = new_headers[attr_name]; }
    return cloned;
};

SimpleWorker.__get = function(url, headers, data, cb) {
    if(headers === undefined || headers === null)
        headers = {};
    SimpleWorker.__set_common_headers();
    var combined_headers = SimpleWorker.__merge_headers(SimpleWorker.headers, headers);
    console.log("_get headers: " + utils.inspect(combined_headers));
     _request.get({url: url, headers:combined_headers, json:data}, function(err, res, data) {
        console.log(data);
        cb(data);
     });
};


SimpleWorker.__post = function(url, headers, data, cb) {
    if(headers === undefined || headers === null)
        headers = {};
    SimpleWorker.__set_common_headers();
    var combined_headers = SimpleWorker.__merge_headers(SimpleWorker.headers, headers);
    console.log("_get headers: " + utils.inspect(combined_headers));
     _request.post({url: url, headers:combined_headers, json:data}, function(err, res, data) {
        console.log(data);
        cb(data);
     });
};

SimpleWorker.__del = function(url, headers, data, cb) {
    if(headers === undefined || headers === null)
        headers = {};
    
    var combined_headers = SimpleWorker.__merge_headers(SimpleWorker.headers, headers);
    console.log("_del url: " + url);
    console.log("_del headers: " + utils.inspect(combined_headers));
    _request.del({url: url, headers: combined_headers, json:data}, function(err, res, data) {
        console.log(data);
        cb(data);
     });
}

SimpleWorker.getTasks = function(project_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
        
    var url = SimpleWorker.url + 'projects/' +project_id+'/tasks?oauth=' + SimpleWorker.token;
    
    SimpleWorker.__get(url, {}, null, function(data) {
        return JSON.parse(data).tasks;
    });    
};

SimpleWorker.getProjects = function() {
    SimpleWorker.__set_common_headers();
    var url = SimpleWorker.url + 'projects?oauth=' + SimpleWorker.token;
    SimpleWorker.__get(url, {}, null, function(data) {
        return JSON.parse(data).projects;
    });
};

SimpleWorker.setProject = function(project_id) {
    SimpleWorker.project_id = project_id;    
};

SimpleWorker.getProjectDetails = function(project_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
        
    var url =  SimpleWorker.url + 'projects/'+project_id+'?oauth=' + SimpleWorker.token;
    SimpleWorker.__get(url, {}, null, function(data) {
        return JSON.parse(data);
    });
};

SimpleWorker.getCodes = function(project_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    
    var url = SimpleWorker.url + 'projects/'+project_id+'/codes?oauth=' + SimpleWorker.token;
    SimpleWorker.__get(url, {}, null, function(data) {
        console.log("getCodes body: " + data);
        return JSON.parse(data).codes;
    });
};

SimpleWorker.getCodeDetails = function(code_id) {
      SimpleWorker.__set_common_headers();
      var project_id = SimpleWorker.project_id;
      var url = SimpleWorker.url + 'projects/' + project_id + '/codes/'+code_id+'?oauth=' + SimpleWorker.token;
      console.log("getCodeDetails, url = " + url);
      SimpleWorker.__get(url, {}, null, function(data) {
            return JSON.parse(data);
      });
};

SimpleWorker.postCode = function(project_id, name, runFilename, zipFilename) {
     if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
     var url = SimpleWorker.url + 'projects/'+ project_id + '/codes?oauth=' + SimpleWorker.token;
     
     console.log(url);
     var data = JSON.stringify({
            'name': name,
            'runtime': "python",
            'file_name': runFilename,
            'oauth': SimpleWorker.token,
     });
    
     var headers = {
        'Accept':'application/json',
        'Accept-Encoding':'gzip,deflate',
        'User-Agent': 'NodeClient'
     };
    
     fs.createReadStream(zipFilename).pipe(_request.post({method:"POST", url: url, json: data}, function(err, res, _data) {
        console.log("PostCode Result: " + utils.inspect(_data));    
     }));
};

SimpleWorker.postProject = function(name) {
    SimpleWorker.__set_common_headers();
    var url = SimpleWorker.url + 'projects?oauth=' + SimpleWorker.token;
    var payload = [{name: name, class_name: name, access_key: name}];
    var timestamp = new Date();
    var data = {name: name};
        data = JSON.stringify(data);
    var data_len = data.length;
    var headers = SimpleWorker.headers;
        headers['Content-Type'] = "application/json";
        headers['Content-Length'] = data_len;
        
        SimpleWorker.__get(url, headers, data, function(response) {
            return JSON.parse(response).id;
        });
};

SimpleWorker.deleteProject = function(project_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    var url = SimpleWorker.url + 'projects/' + project_id + '?oauth=' + SimpleWorker.token;
    console.log("deleteProject url = " + url);
    
    SimpleWorker.__del(url, {}, function(data) {
        console.log('OnDelete: ' + data);
    });
};

SimpleWorker.deleteCode = function(project_id, code_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    var url = SimpleWorker.url + 'projects/' + project_id + '/codes/'+code_id+'?oauth=' + SimpleWorker.token;
    console.log("deleteCode url = " + url);
    
    SimpleWorker.__del(url, {}, function(data) {
        console.log('OnDelete: ' + data);
    });
};

SimpleWorker.deleteTask = function(project_id, task_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    var url = SimpleWorker.url + 'projects/' + project_id + '/tasks/'+task_id+'?oauth=' + SimpleWorker.token;
    console.log("deleteTask url = " + url);
    
    SimpleWorker.__del(url, {}, function(data) {
        console.log('OnDelete: ' + data);
    });
};

SimpleWorker.deleteSchedule = function(project_id, schedule_id) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    var url = SimpleWorker.url + 'projects/' + project_id + '/schedules/'+schedule_id+'?oauth=' + SimpleWorker.token;
    console.log("deleteTask url = " + url);
    
    SimpleWorker.__del(url, {}, function(data) {
        console.log('OnDelete: ' + data);
    });
};

SimpleWorker.postSchedule = function(project_id, name, delay) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    var url = SimpleWorker.url + 'projects/'+project_id+'/schedules?oauth='+ SimpleWorker.token;
    var timestamp = new Date();
    var schedules = [{delay: delay, code_name: name}];
    var payload = {schedule: schedules[0], project_id: project_id, class_name: name,
                    options: {}, token: SimpleWorker.token, api_version: SimpleWorker.version,
                    version: SimpleWorker.version, timestamp: timestamp, oauth: SimpleWorker.token, access_key: name, delay: delay};
    var options = {project_id: project_id, class_name: name,
                    options: {}, token: SimpleWorker.token, api_version: SimpleWorker.version,
                    version: SimpleWorker.version, timestamp: timestamp, oauth: SimpleWorker.token, access_key: name, delay: delay};
    var data = {schedules: schedules};
    data = JSON.stringify(data);
    console.log("data: " + data);
    var data_length = data.length;
    var headers = SimpleWorker.headers;
    headers['Content-Type'] = "application/json";
    headers['Content-Length'] = data_length;
    headers['Accept'] = "application/json";
    
    SimpleWorker.__get(url, headers, data, function(data) {
         return JSON.parse(data).schedules[0].id;
    });    
};

SimpleWorker.postTask = function (project_id, name) {
    SimpleWorker.__set_common_headers();
    if(project_id === undefined || project_id === null)
        project_id = SimpleWorker.project_id;
    var url = SimpleWorker.url + 'projects/'+project_id+'/tasks?oauth='+ SimpleWorker.token;
    var payload = [{class_name: name, access_key: name, code_name: name}];
    var timestamp = new Date();
    var data = {code_name: name, code_name: name, name: name,
                options: {}, token: SimpleWorker.token, api_version: SimpleWorker.version,
                version: SimpleWorker.version, timestamp: timestamp, oauth: SimpleWorker.token, access_key: name};
        payload = JSON.stringify(payload);
    var task = {name: name, code_name: name, payload: payload};
    var tasks = {tasks: [task]};
        data = JSON.stringify(data);
    var data_len = data.length;
    var headers = SimpleWorker.headers;
        
        SimpleWorker.__post(url, headers, data, function(_data) {
            console.log(_data);
            return JSON.parse(_data);
        });
};


SimpleWorker.getLog = function(project_id, task_id) {
    SimpleWorker.__set_common_headers();
    var url = SimpleWorker.url + 'projects/' + project_id + '/tasks/' + task_id + '/log/?oauth=' + SimpleWorker.token;
    var headers = {Accept: "text/plain"};
    
    delete SimpleWorker.headers['Content-Type'];
    delete SimpleWorker.headers['Content-Length'];
    SimpleWorker.__get(url, headers, null, function(data) {
        return data;
    });
};
