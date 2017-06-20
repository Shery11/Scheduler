// inject "service" in this controller if you changed the service name what i created then change in this dependency injection too
$scope.e = [];
$scope.score = [];
$scope.newArr = [];
//this service will send a promise back.
service.get_users().then(function (data) {
// success
// console.log(data);
//ok we are getting all the users.
$scope.allusers = data;


for(var i = 0; i < $scope.allusers.length; i++){
$scope.e[i] = $scope.allusers[i].emai; 
// console.log($scope.allusers[i].emai); 
service.get_hobbies($scope.e[i]).then(function (edata) {$scope.score.push(edata);}); 
}
// var j=0;
// $scope.allusers.forEach(function(data){


// var obj = {
// companyName:$scope.allusers[j].companyname,
// score:$scope.score[j]
// };

// $scope.newArr.push(obj);



// j++;



// }); 

$scope.score.forEach(function(sdata){
console.log(sdata);
}) 


console.log($scope.newArr);