var app = angular.module("app", ['firebase','ngToast']);

app.controller("calendar", function($scope,$firebaseArray,$firebaseObject,ngToast) {



    $scope.day = moment();


   
  var list = $firebaseArray(new Firebase("https://calendar-ae263.firebaseio.com/schedule"));
  var ref = new Firebase("https://calendar-ae263.firebaseio.com/schedule");

  // download the data into a local object
  $scope.data = $firebaseObject(ref);


  $scope.reset = function(){
    ref.remove();
  }
  

  $scope.saveDate = function(date){
      console.log("Date Selected:"+date.format('DD/MM/YYYY'));
      $scope.flag = true;

      var fDate = date.format('DD/MM/YYYY');
      console.log("Date Selected::"+fDate);


      ref.on("value", function(snapshot){
         // console.log(snapshot.val());
         snapshot.forEach(function(data){
          var myDate = data.val();
            console.log("Date from db:"+myDate.date);
             if(fDate === myDate.date ){

               console.log("Date is same");
               $scope.flag = false;

             }
          });

      }, function (errorObject){
          console.log("The read failed: " + errorObject.code);
      });
            
          if($scope.flag){

              list.$add({ date : fDate }).then(function(){
              console.log("Data added");
                ngToast.create({
                  className: 'warning',
                  content: 'Your date is '+fDate
                });


              }).catch(function(err){
                console.log(err);
              });



          }else{
            ngToast.create({
                  className: 'warning',
                  content: 'Date already booked please choose another one'
                });
          } 

           
          
    }

});

app.directive("calendar", function() {
    return {
        restrict: "E",
        templateUrl: "template/calendar.html",
        scope: {
            selected: "="
        },
        link: function(scope) {
            scope.selected = _removeTime(scope.selected || moment());
            scope.month = scope.selected.clone();

            var start = scope.selected.clone();
            start.date(1);
            _removeTime(start.day(0));

            _buildMonth(scope, start, scope.month);

            scope.select = function(day) {
                scope.selected = day.date;
                  
            };

            scope.next = function() {
                var next = scope.month.clone();
                _removeTime(next.month(next.month()+1)).date(1);
                scope.month.month(scope.month.month()+1);
                _buildMonth(scope, next, scope.month);
            };

            scope.previous = function() {
                var previous = scope.month.clone();
                _removeTime(previous.month(previous.month()-1).date(1));
                scope.month.month(scope.month.month()-1);
                _buildMonth(scope, previous, scope.month);
            };
        }
    };
    
    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {

          
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date,
                booked : function(date){

                   

                    var ref = new Firebase("https://calendar-ae263.firebaseio.com/schedule");
                    var fDate = date.date.format('DD/MM/YYYY');
                   

                    var f= false;


                    ref.on("value", function(snapshot){
                       
                       snapshot.forEach(function(data){
                        var myDate = data.val();
                          console.log("Date from db:"+myDate.date);
                           if(fDate === myDate.date ){

                             console.log("Date is same");
                             f = true;

                           }
                        });

                    }, function (errorObject){
                        console.log("The read failed: " + errorObject.code);
                    });

                    if(f){
                      return true;
                    }
                    else{
                      return false;
                    }

                }
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }
});