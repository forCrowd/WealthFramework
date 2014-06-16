(function () {
    'use strict';

    var controllerId = 'chapter5Controller';
    angular.module('main')
        .controller(controllerId, ['userLicenseRatingService', 'resourcePoolService', '$scope', '$timeout', 'logger', chapter5Controller]);

    function chapter5Controller(userLicenseRatingService, resourcePoolService, $scope, $timeout, logger) {
        logger = logger.forSource(controllerId);

        // TODO Static?
        var resourcePoolId = 2;

        var refreshTimeout = null;

        var vm = this;
        vm.chartData = null;
        vm.decrease = decrease;
        vm.oldSystemChartConfig = null;
        vm.newSystemChartConfig = null;
        vm.increase = increase;
        vm.licenseChartConfig = null;
        vm.displayLicenseResult = false;
        vm.licenseResultChartConfig = null;
        vm.licenseResultLicenseSet = [];
        vm.resetChanges = resetChanges;
        vm.saveChanges = saveChanges;

        initialize();

        /* Implementations */

        function initialize() {
            configureCharts();
            loadChartData();

            refreshTimeout = $timeout(refreshPage, 5000);

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            $scope.$on("$destroy", function (event) {
                $timeout.cancel(refreshTimeout);
            });
        }

        function refreshPage() {

            var organizationIndex = Math.floor(Math.random() * 4);
            vm.oldSystemChartConfig.series[organizationIndex].data[0] += 1;
            vm.newSystemChartConfig.series[0].data[0] += 1;

            refreshTimeout = $timeout(refreshPage, 1000);
        }

        function decrease(index) {
            vm.chartData[index].y = vm.chartData[index].y - 5 < 0
                ? 0
                : vm.chartData[index].y - 5;
        }

        function increase(index) {
            vm.chartData[index].y += 5;
        }

        function configureCharts() {

            vm.oldSystemChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Development process' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Knowledge'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                },
                series: [
                    { name: "My Precious", data: [0] },
                    { name: "Vicky's Secret", data: [0] },
                    { name: 'Imperial Stars', data: [0] },
                    { name: 'Xplore Eldorado', data: [0] }
                ]
            };

            vm.newSystemChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'column'
                    },
                    yAxis: {
                        title: { text: 'Development process' },
                        min: 0,
                        allowDecimals: false
                    },
                    xAxis: { categories: ['Knowledge'] },
                    plotOptions: {
                        column: {
                            pointWidth: 15
                        }
                    }
                },
                series: [
                    { name: 'Global Knowledge Database', data: [0] }
                ]
            };

            vm.licenseChartConfig = {
                title: {
                    //text: 'Sectors'
                    text: ''
                },
                options: {
                    chart: {
                        type: 'pie'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true
                        }
                    }
                }
            };

            vm.licenseResultChartConfig = {
                title: {
                    text: ''
                },
                options: {
                    chart: {
                        type: 'pie'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true
                        }
                    }
                }
            };
        }

        function loadChartData() {

            vm.licenseChartConfig.loading = true;

            userLicenseRatingService.getUserLicenseRatingSetByResourcePoolId(resourcePoolId, false)
                .then(function (data) {

                    // Convert userLicenseRating to chart data
                    vm.chartData = [];
                    for (var i = 0; i < data.length; i++) {
                        var chartDataItem = {
                            name: data[i].License.Name,
                            y: data[i].Rating
                        }
                        vm.chartData.push(chartDataItem);
                    }

                    vm.licenseChartConfig.series = [{ data: vm.chartData }];
                    vm.licenseChartConfig.loading = false;
                });

            // License Result Chart

            vm.licenseResultChartConfig.loading = true;

            resourcePoolService.getLicenseSet(resourcePoolId)
                .success(function (licenseSet) {

                    vm.licenseResultLicenseSet = licenseSet;

                    // Convert licenseSet to chart data
                    var licenseResultChartData = [];
                    for (var i = 0; i < vm.licenseResultLicenseSet.length; i++) {
                        var chartDataItem = {
                            name: vm.licenseResultLicenseSet[i].LicenseName,
                            y: vm.licenseResultLicenseSet[i].AverageRating
                        }
                        licenseResultChartData.push(chartDataItem);
                    }

                    vm.licenseResultChartConfig.series = [{ data: licenseResultChartData }];
                    vm.licenseResultChartConfig.loading = false;

                });
        }

        function resetChanges() {
            loadChartData();
        }

        function saveChanges() {

            userLicenseRatingService.getUserLicenseRatingSetByResourcePoolId(resourcePoolId, false)
                .then(function (data) {

                    // Convert chart data to userSectorRating
                    for (var i = 0; i < vm.chartData.length; i++) {
                        var dataItem = data[i];
                        var chartDataItem = vm.chartData[i];

                        if (dataItem.Rating !== chartDataItem.y) {
                            dataItem.Rating = chartDataItem.y;

                            var rowVersion = dataItem.RowVersion;
                            dataItem.RowVersion = '';
                            dataItem.RowVersion = rowVersion;
                        }
                    }

                    userLicenseRatingService.saveChanges()
                        .then(function () {
                            logger.logSuccess('Your changes have been saved!', null, true);

                            vm.displayLicenseResult = true;

                            loadChartData();
                        });
                });
        }
    };
})();
