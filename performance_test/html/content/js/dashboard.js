/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6446154640939457, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.609435210774201, 500, 1500, "http://localhost:8080/api/item/update"], "isController": false}, {"data": [0.7352821840523988, 500, 1500, "http://localhost:8080/api/list/all"], "isController": false}, {"data": [0.727484591679507, 500, 1500, "http://localhost:8080/api/list/add"], "isController": false}, {"data": [0.6661163814484127, 500, 1500, "http://localhost:8080/api/item/all"], "isController": false}, {"data": [0.5577642158287319, 500, 1500, "http://localhost:8080/api/item/add"], "isController": false}, {"data": [2.7330938622520694E-4, 500, 1500, "Test"], "isController": true}, {"data": [0.7892394190223333, 500, 1500, "http://localhost:8080/api/auth/signout"], "isController": false}, {"data": [0.7171732757290542, 500, 1500, "http://localhost:8080/api/list/update"], "isController": false}, {"data": [0.7085144365104005, 500, 1500, "http://localhost:8080/api/list/delete"], "isController": false}, {"data": [0.6896283020338191, 500, 1500, "http://localhost:8080/api/item/delete"], "isController": false}, {"data": [0.6746404122759788, 500, 1500, "http://localhost:8080/api/auth/signin"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 296905, 0, 0.0, 1215.2323133662326, 1, 26162, 176.5, 3855.9000000000015, 5208.0, 8163.960000000006, 164.41579383968926, 2720.9543009906038, 509.29934241539013], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://localhost:8080/api/item/update", 25691, 0, 0.0, 1374.6732707952215, 5, 17567, 249.0, 4189.700000000004, 5652.950000000001, 8909.830000000027, 14.264456844618417, 7.463338985418228, 13.828269772320313], "isController": false}, {"data": ["http://localhost:8080/api/list/all", 51757, 0, 0.0, 1042.536854918158, 17, 19818, 86.0, 3695.9000000000015, 5275.550000000007, 8441.970000000005, 28.669854360219713, 1201.500580581238, 16.350776314812805], "isController": false}, {"data": ["http://localhost:8080/api/list/add", 25960, 0, 0.0, 1039.2938366718042, 2, 18152, 13.0, 3782.9000000000015, 5307.800000000003, 8650.710000000046, 14.382614101056147, 7.114002036301972, 9.670349725609807], "isController": false}, {"data": ["http://localhost:8080/api/item/all", 64512, 0, 0.0, 1306.0573691716222, 2, 23528, 184.5, 4146.9000000000015, 5711.0, 8830.980000000003, 35.7511187464498, 944.7172978809626, 20.59878912148963], "isController": false}, {"data": ["http://localhost:8080/api/item/add", 51615, 0, 0.0, 1592.277283735337, 4, 26162, 691.5, 4444.0, 5816.0, 8764.910000000014, 28.603380313847495, 538.7187545805447, 422.3460016537758], "isController": false}, {"data": ["Test", 12806, 0, 0.0, 27926.964782133397, 1194, 86248, 26718.0, 44701.40000000002, 50494.799999999996, 61963.220000000016, 7.094972686072667, 2701.3325976426154, 506.20070170268815], "isController": true}, {"data": ["http://localhost:8080/api/auth/signout", 12806, 0, 0.0, 598.746915508358, 1, 12412, 9.0, 2064.0, 3170.5999999999985, 6047.720000000001, 7.128380428181539, 3.61290361284784, 4.378663368482606], "isController": false}, {"data": ["http://localhost:8080/api/list/update", 12962, 0, 0.0, 1054.1505940441234, 2, 21305, 14.0, 3757.100000000002, 5288.8499999999985, 8673.739999999998, 7.184160483570155, 3.6130961940078046, 4.953141895898954], "isController": false}, {"data": ["http://localhost:8080/api/list/delete", 25768, 0, 0.0, 1103.7574122943138, 3, 19355, 23.0, 3922.0, 5485.850000000002, 8701.970000000005, 14.280797680755894, 6.763838674973578, 9.469396118391847], "isController": false}, {"data": ["http://localhost:8080/api/item/delete", 12833, 0, 0.0, 1173.425309748304, 4, 19171, 7.0, 4088.6000000000004, 5657.299999999999, 9056.259999999998, 7.138629481043387, 3.3950317942071577, 4.738920762074981], "isController": false}, {"data": ["http://localhost:8080/api/auth/signin", 13001, 0, 0.0, 1021.4418121682936, 108, 17987, 481.0, 2580.0, 3800.0, 7308.799999999996, 7.199611029398735, 5.575448659611683, 3.3888794103224513], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 296905, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
