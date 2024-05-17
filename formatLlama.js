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
            output: pair.completion.replace(/\n/g, "")  // Newline characters are escaped in JSON output
        }));


    const outputData = JSON.stringify(formattedData, null, 4);

    fs.writeFile('transformed_data.json', outputData, err => {
        if (err) {
            console.error("Error writing the file:", err);
        } else {
            console.log("Data saved in transformed format to transformed_data.json");
        }
    });
});

