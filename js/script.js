var jsonArray = [];

$(function() {
    var url = 'https://api.usa.gov/jobs/search.json?size=100&query=';

    $('#searchButton').click(function() {
        //Clear the contents of the table. Otherwise it will append to the current html
        $("#dataTable").html("");
        var input = $('#jobQuery').val(),
            jobName = encodeURI(input);
        $.ajax({
            url: url + jobName,
            dataType: 'jsonp',
            success: function(parsed_json) {
                console.log(parsed_json);

                $("#dataTable").append('<tr><td><h4>Serial Number</h4></td>' + '<td><h4>Organization Name</h4></td>' + '<td><h4>Job Title</h4></td><td>' + '<h4>Locations</h4></td>' + '<td><h4>URL</h4></td></tr>');

                for (m in parsed_json) {
                    var jsonObject = {};
                    var counter = parseInt(m) + 1;
                    jsonObject.orgName = parsed_json[m]['organization_name'];
                    jsonObject.jobTitle = parsed_json[m]['position_title'];
                    jsonObject.maxSalary = parsed_json[m]['maximum'];
                    jsonObject.minSalary = parsed_json[m]['minimum'];
                    jsonObject.startDate = parsed_json[m]['start_date'];
                    jsonObject.endDate = parsed_json[m]['end_date'];
                    jsonObject.location1 = parsed_json[m]['locations'][0];
                    jsonObject.location2 = parsed_json[m]['locations'][1]
                    jsonObject.url = parsed_json[m]['url'];

                    $("#dataTable").append('<tr><td>' + counter + '</td>' + '<td>' + jsonObject.orgName + '</td><td>' + jsonObject.jobTitle + '</td><td>' + jsonObject.location1 + '</td><td><a onClick=\"loadModal(' + m + ')\">View Details</a></td></tr>');

                    jsonArray[m] = jsonObject;
                }

            }
        });

    });

});

function loadModal(m) {
    jsonContent = jsonArray[m];

    // Clear the current contents
    $("#detailTable").html("");

    // Fill the Job details
    $("#detailTable").append('<tr><td><h4>Organization Name</h4></td><td>' + jsonContent.orgName + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>Job Title</h4></td><td>' + jsonContent.jobTitle + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>Maximum Salary</h4></td><td>' + format(jsonContent.maxSalary, "$") + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>Minimum Salary</h4></td><td>' + format(jsonContent.minSalary, "$") + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>Start Date</h4></td><td>' + jsonContent.startDate + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>End Date</h4></td><td>' + jsonContent.endDate + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>Location</h4></td><td>' + jsonContent.location1 + '</td></tr>');
    $("#detailTable").append('<tr><td><h4>URL:</h4></td><td><a href=\"' + jsonContent.url + '\"target=\"_blank\">' + jsonContent.url + '</a></td></tr>');
    $("#mymodal").modal('show');

}

function format(n, currency) {
    return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}
