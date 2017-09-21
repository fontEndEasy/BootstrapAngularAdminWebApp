window.serverApiRoot = '/kangzhe/';
window.medicineApiRoot = '/web/';
window.uploadApiRoot = '/upload/';
window.orgApiRoot = '/org/';

(function() {
    var hostname = window.location.hostname,
        port = window.location.port;

    if (hostname === '192.168.3.30') {
        if (port === '8083') {
            serverApiRoot = 'http://112.74.208.140' + ':' + '9001/';
            uploadApiRoot = 'http://112.74.208.140' + ':' + '9000/';
            medicineApiRoot = 'http://112.74.208.140' + '/';
            orgApiRoot = 'http://112.74.208.140' + '/' + 'org/';
        } else if (port === '8082') {
            serverApiRoot = 'http://120.24.94.126' + '/' + 'health/';
            uploadApiRoot = 'http://120.24.94.126' + ':' + '9000/';
            medicineApiRoot = 'http://120.24.94.126' + '/';
            orgApiRoot = 'http://120.24.94.126' + '/' + 'org/';
        } else if (port === '8081') {
            serverApiRoot = 'http://192.168.3.7' + '/' + 'health/';
            uploadApiRoot = 'http://192.168.3.7' + ':' + '9000/';
            medicineApiRoot = 'http://192.168.3.7' + '/';
            orgApiRoot = 'http://192.168.3.7' + '/' + 'org/';
        }
    } else if (hostname === 'localhost' || hostname === '192.168.3.38') {
        if (port === '9900') {
            serverApiRoot = 'http://112.74.208.140' + ':' + '9001/';
            uploadApiRoot = 'http://112.74.208.140' + ':' + '9000/';
            medicineApiRoot = 'http://112.74.208.140' + '/';
            orgApiRoot = 'http://112.74.208.140' + '/' + 'org/';
        } else if (port === '8800') {
            serverApiRoot = 'http://120.24.94.126' + '/' + 'health/';
            uploadApiRoot = 'http://120.24.94.126' + ':' + '9000/';
            medicineApiRoot = 'http://120.24.94.126' + '/';
            orgApiRoot = 'http://120.24.94.126' + '/' + 'org/';
        } else if (port === '8000') {
            serverApiRoot = 'http://192.168.3.7' + '/' + 'health/';
            uploadApiRoot = 'http://192.168.3.7' + ':' + '9000/';
            medicineApiRoot = 'http://192.168.3.7' + '/';
            orgApiRoot = 'http://192.168.3.7' + '/' + 'org/';
        }
    } else {
        serverApiRoot = 'http://' + hostname + '/' + 'health/';
        uploadApiRoot = 'http://' + hostname + ':' + '9000/';
        medicineApiRoot = 'http://' + hostname + '/';
        orgApiRoot = 'http://' + hostname + '/' + 'org/';
    }

})();
