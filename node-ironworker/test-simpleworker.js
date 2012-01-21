var SimpleWorker = require("./simpleworker.js");
SimpleWorker.init(null, null, 2, "QiVQ0a-e9qvhLLS5cpAr6j1Suvc", "http");

var Code = SimpleWorker.postCode("4f147067b21c5304f10002a1", "HelloWorker-python", "hello_worker.py", "./node-ironworker/hello_worker.zip");
//var Task = SimpleWorker.postTask("4f147067b21c5304f10002a1", "HelloWorker-python");
