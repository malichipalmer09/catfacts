/* global angular */
var app = angular.module('catfacts');

app.controller('RecipientsCtrl', ['$scope', '$rootScope', 'RecipientService', '$mdDialog', '$mdMedia',
    function($scope, $rootScope, RecipientService, $mdDialog, $mdMedia) {
    
    $scope.selected = [], $scope.recipients = [];
    
    getRecipients();
    
    $scope.addRecipient = function() {
        var name = $scope.form.name, number = $scope.form.number;
        
        if (name && number && number.replace(/[^0-9]/gi, '').trim().length == 10) {
            
            RecipientService.addRecipient({
                name: name,
                number: number.replace(/[^0-9]/gi, '').trim()
            }).then(function(response) {
                $scope.recipients.push(response.data);
                $rootScope.toast({message: "Recipient added!"});
                $scope.form = null;
            }, function(err) {
                console.log(err);
                $rootScope.toast({message: err.data.errors[Object.keys(err.data.errors)[0]].message || err.data.message});
            });
            
        } else {
            $rootScope.toast({message: "Invalid name or number"});
        }
    };
    
    $scope.openConversation = function(event, recipient) {
        $mdDialog.show({
            controller: 'ConversationCtrl',
            templateUrl: '/views/conversation.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: $mdMedia('xs'),
            locals: {data: {recipient: recipient}}
        });
    };
    
    function getRecipients() {
        RecipientService.getRecipients().then(function(response) {
            $scope.recipients = response.data;
        }, function(err) {
            $rootScope.toast({message: err.data.message});
        });
    }

}]);