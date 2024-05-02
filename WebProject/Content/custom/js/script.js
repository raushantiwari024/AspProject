document.getElementById("input-field").addEventListener("input", function () {
    var searchText = this.value.toLowerCase();
    var rows = document.getElementById("table-body").getElementsByTagName("tr");

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        
        var name = row.cells[0].textContent.toLowerCase(); // Assuming name is in the first cell
        console.log(row.cells[0].textContent.toLowerCase());
        if (name.includes(searchText)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
});






$("#MyDropdown").hide();

function FetchData() {
    console.log('CALLED...................');
    $.ajax({
        type: "GET",
        url: "/Home/FetchData",
        success: function (data, status, xhr) {
            // Handle the successful submission response
            console.log("Form submitted successfully!");
            console.log("Response:", data);

            const masterData = JSON.parse(data);
            console.log("Master data is : ", masterData)

            // Log each item in the generic list

            //var select = $("<select>");
            //select.attr("id", "Menu");

            masterData.forEach(function (person) {

                var tr = $("<tr>");
                tr.attr("id", person.Name);

                var td1 = $("<td>");
                var td2 = $("<td>");

                td1.text(person.Name);

                td2.text(person.Designation);

                tr.append(td1);
                tr.append(td2);

                $("#table-body").append(tr);

                var opt = $(document.createElement("option"))
                /*var opt = $("<option>");*/
                opt.prop("value", person.Name);
                opt.text(person.Name + " / " + person.Designation);

                /*select.append(opt);*/
                $("select").append(opt);

                console.log("Name: " + person.Name + ", Age: " + person.Designation);
            });

            /*$("#drop-down").append(select);*/
            console.log($("#myDropdown").html())

        },
        error: function (xhr, status, error) {
            // Handle errors
            console.error("Error submitting form:", error);
        }
    });
    
};


$(document).ready(function () {
    console.log("hello json......................");
    FetchData();

    // Use a regular function instead of an arrow function

    $("#myDropdown").change(function () {
        console.log("Dropdown value changed:", $(this).val());
    });


    $("#Menu").change(function () {
        console.log("Dropdown value changed:", $(this).val());
    });




    

});

















/*

$(document).ready(function () {
    console.log("hello json......................");
    FetchData();

    $("#Menu").change(function() {
        console.log($(this).val());
    })



    function FetchData() {
        console.log('CALLED...................');
        $.ajax({
            type: "GET",
            url: "/Home/FetchData",
            success: function (data, status, xhr) {
                // Handle the successful submission response
                console.log("Form submitted successfully!");
                console.log("Response:", data);

                const masterData = JSON.parse(data);
                console.log("Master data is : ",masterData)

                // Log each item in the generic list

                var select = $("<select>");
                select.attr("id", "Menu");

                masterData.forEach(function (person) {

                    var tr = $("<tr>");
                    tr.attr("id", person.Name);

                    var td1 = $("<td>");
                    var td2 = $("<td>");

                    td1.text(person.Name);
                    
                    td2.text(person.Designation);

                    tr.append(td1);
                    tr.append(td2);

                    $("#table-body").append(tr);


                    var opt = $("<option>");
                    opt.prop("value", person.Name);
                    opt.text(person.Name + " / " + person.Designation);

                    select.append(opt);

                    console.log("Name: " + person.Name + ", Age: " + person.Designation);
                });

                $("#drop-down").append(select);
                console.log($("#drop-down").html())

            },
            error: function (xhr, status, error) {
                // Handle errors
                console.error("Error submitting form:", error);
            }
        });
    };

})
*/