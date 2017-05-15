/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//Angular code
(function () {
    //Application module

    angular.module('pharmacyApp').controller("PurchaseController", ['$http', '$scope', '$window', '$cookies', 'accessService', 'userConnected', function ($http, $scope, $window, $cookies, accessService, userConnected) {
        $scope.purchase = new Purchase();
        $scope.purchasesArray = new Array();
        $scope.idUser = $scope.$parent.idUser;
        
        //Scope variables
        $scope.showForm = 0;
        $scope.specialRequests = ["Dlivery at the main hospital", "Fragil material, must be sended in a special vehicle", "Product easily contamined, special protection nedded"];
        
        //Date pickers scope variables and functions
        $scope.minDeliveryDate = new Date((new Date()).setDate((new Date()).getDate() + 1));
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.dateOptions = {
            dateDisabled: "",
            formatYear: 'yyyy',
            maxDate: "",
            minDate: $scope.minDeliveryDate,
            startingDay: 1
        };

        $scope.deliveryDate = {
            opened: false
        };

        $scope.openDeliveryDate = function () {
            $scope.deliveryDate.opened = true;
        };
        
        $scope.specialReqMng = function (indexChecked) {
            if($("#specialReq"+indexChecked).is(":checked")) {
                var arr = new Array();
                arr.push(($scope.specialRequests[indexChecked]));
            $scope.purchase.specialRequests = arr.toString();
            } else {
                $scope.purchase.removeSpecialRequests($scope.specialRequests[indexChecked]);
            }
        }
        
        this.addPurchase = function () {
            
            $scope.purchase = angular.copy($scope.purchase);
            console.log($scope.purchase);
            // Server conenction to verify user's data.
            var promise = accessService.getData("MainController",
                    true, "POST", {controllerType: 2, action: 10000, JSONData: JSON.stringify($scope.purchase)});

            promise.then(function (outputData) {
                
                console.log(outputData);
                if (outputData[0] === true) {
                    for (var i=0; outputData[1].length; i++) {
                        var purchaseObj = new Purchase();
                        purchaseObj.construct(outputData[1].id, $scope.idUser, $scope.selectedProduct, $scope.purchase.deliveryDate, $scope.purchase.specialRequests, $scope.purchase.specialInstructions);
                        console.log(purchaseObj);
                        //$scope.purchasesArray.push(purchaseObj);
                    }
                } else {
                    if (angular.isArray(outputData[1])) {
                        console.log(outputData);
                    }
                }
            });
        }
        
    }]);

})();

