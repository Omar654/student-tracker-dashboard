angular.module('app').controller('surveysCtrl', function($scope, surveyService) {

    $scope.surveyName;
    $scope.selectedProgram;
    $scope.allData = [];
    $scope.allPrograms = {ux: [], ios: [], qa: [], webdev: []};

    // -------------- Weekly Survey Graph -------------- //

    surveyService.getWeeklySurveyData().then(res => {
        $scope.allData = res.data
        let ios = $scope.allData.filter(e => {
            return  e.program === "ios"
        })
        let webdev = $scope.allData.filter(e => {
            return  e.program === "webdev"
        })
        let qa = $scope.allData.filter(e => {
            return  e.program === "qa"
        })
        let ux = $scope.allData.filter(e => {
            return  e.program === "ux"
        })

        $scope.allPrograms = {
            ios,
            webdev,
            qa,
            ux
        }
        
        $scope.sd = $scope.allPrograms
    })


    getAllSurveyData = (program, column) => {
        $scope.surveyName = column || "OSAT"
        $scope.selectedProgram = program || 'all'
        let surveyData = [];
        if($scope.selectedProgram === "all") {
            surveyData = $scope.allPrograms;
        } else {
            surveyData = $scope.allPrograms[$scope.selectedProgram].filter(e => {
                return e.program === $scope.selectedProgram
            })
        }
        
        $scope.sd = surveyData
    }

    getAllSurveyData()

 

    $scope.changeSurveyName = () => {
        getAllSurveyData($scope.selectedProgram, event.target.value)
    }

    $scope.changeselectedProgram = () => {
        getAllSurveyData(event.target.value, $scope.surveyName)
    }
  

    // -------------- Survey Topic Graph -------------- //

    getTopicSurveyData = (selectedTopic) => {
       let topic = selectedTopic || 'Javascript'
       console.log(topic)
        $scope.topicData = surveyService.getSurveyByTopic(topic).then(res => {
            $scope.topicData = res.data
            console.log($scope.topicData)
        })
    }
    getTopicSurveyData()

    $scope.changeSelectedTopic = () => {
        getTopicSurveyData(event.target.value)
    }

})