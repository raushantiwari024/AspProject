protected void SubmitButton_Click(object sender, EventArgs e)
{
    // Create a list to store the checked row data
    List<string> checkedRowData = new List<string>();

    // Loop through each row in the GridView
    foreach (GridViewRow row in GridView1.Rows)
    {
        // Find the CheckBox control in the current row
        CheckBox checkBox = (CheckBox)row.FindControl("CheckBox1");

        // Check if the CheckBox is checked
        if (checkBox != null && checkBox.Checked)
        {
            // If the CheckBox is checked, retrieve data from other cells in the row
            // Assuming you have more cells, you can access them using Cells[index].Text
            // Replace "index" with the appropriate cell index
            string rowData = row.Cells[1].Text; // Example: Retrieving data from the second cell
            // Add the rowData to the list
            checkedRowData.Add(rowData);
        }
    }

    // Now you have all the checked row data in the checkedRowData list
    // You can further process or display this data as needed
}



protected void SubmitButton_Click(object sender, EventArgs e)
{
    // Create a list to store the checked row data
    List<List<string>> checkedRowData = new List<List<string>>();

    // Loop through each row in the GridView
    foreach (GridViewRow row in GridView1.Rows)
    {
        // Find the CheckBox control in the current row
        CheckBox checkBox = (CheckBox)row.FindControl("CheckBox1");

        // Check if the CheckBox is checked
        if (checkBox != null && checkBox.Checked)
        {
            // Create a list to store data of the current checked row
            List<string> rowData = new List<string>();

            // Loop through each cell in the row
            foreach (TableCell cell in row.Cells)
            {
                // Add the text of the cell to the rowData list
                rowData.Add(cell.Text);
            }

            // Add the rowData list to the checkedRowData list
            checkedRowData.Add(rowData);
        }
    }

    // Now you have all the checked row data in the checkedRowData list
    // You can further process or display this data as needed
}
