const fs = require('fs');

// Read the cleaned JSON data
fs.readFile('cleaned_data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const data = JSON.parse(jsonString);

    // Map and filter data: only include entries where prompt and completion are not the same
    const formattedData = data.conversations
        .filter(pair => pair.prompt !== pair.completion) // Filtering out duplicates
        .map(pair => ({
            instruction: "",
            input: pair.prompt.replace(/\n/g, ""),
            output: pair.completion.replace(/\n/g, "")  // Ensuring newline characters are properly escaped in JSON output
        }));

    // Convert the formatted data to a JSON string with proper formatting
    const outputData = JSON.stringify(formattedData, null, 4); // 'null, 4' adds indentation for readability

    // Write the reformatted data to a new file
    fs.writeFile('transformed_data.json', outputData, err => {
        if (err) {
            console.error("Error writing the file:", err);
        } else {
            console.log("Data saved in transformed format to transformed_data.json");
        }
    });
});

