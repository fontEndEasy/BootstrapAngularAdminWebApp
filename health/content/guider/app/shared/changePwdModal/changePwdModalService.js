(function() {
    angular.module('app')
        .factory('ChangePwdModalFactory', ChangePwdModalFactory);

    // �ֶ�ע������

    ChangePwdModalFactory.$inject = ['$http','$uibModal'];

    function ChangePwdModalFactory($http,$uibModal) {
        return {
            openChangePwdModal:openChangePwdModal
        };

        //��ͼƬѡ��ģ̬��
        function openChangePwdModal(size){
            var modalInstance = $uibModal.open({
                templateUrl: 'app/shared/changePwdModal/changePwdModalTpl.html',
                controller: 'ChangePwdModalInstanceCtrl',
                size: size
            });

            modalInstance.result.then(function () {
            }, function () {
            });
        }


    };


    // ��������
    function getListsComplete(response) {

        var reData = response.data;

        if (reData.resultCode === 1) {

            try {

                return reData.data

            } catch (e) {

                if (e.type === undefined)
                    console.warn('��������û�� data �ֶ�')

                console.warn(e);
            }

        } else if (reData.resultMsg) {

            console.warn(reData.resultMsg);

        } else {
            console.warn('����ʧ��');
        }


    };
    // ������
    function getListsFailed(error) {

        console.warn('����ʧ��.' + error.data);
    };

})();
