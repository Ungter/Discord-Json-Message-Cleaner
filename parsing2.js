const fs = require('fs');

// Read the cleaned JSON data
fs.readFile('cleaned_data.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const data = JSON.parse(jsonString);

    const formattedData = data.conversations.map(pair => ({
        messages: [
            { role: "system", content: "A chat bot based on the Potao Gang GC" },
            { role: "user", content: pair.prompt },
            { role: "assistant", content: pair.completion }
        ]
    }));

    // Convert each item to string and join them with line breaks
    const outputData = formattedData.map(entry => JSON.stringify(entry)).join('\n');

    // Write the reformatted data to a new file
    fs.writeFile('transformed_data.json', outputData, err => {
        if (err) {
            console.error("Error writing the file:", err);
        } else {
            console.log("Data saved in transformed format to transformed_data.json");
        }
    });
});

