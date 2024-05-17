const fs = require('fs');

// Read the original JSON data
fs.readFile('.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    const data = JSON.parse(jsonString);

    // Remove URLs and non-alphanumeric characters (except common punctuations)
    const cleanContent = message => {
        // Remove URLs
        let cleaned = message.replace(/https?:\/\/[^\s]+/g, '');

        // Remove "Started a call..." messages
        cleaned = cleaned.replace(/Started a call that lasted \d+ minutes\./g, '');

        // Remove "Removed (some user) from the group" messages
        cleaned = cleaned.replace(/Removed .* from the group/g, '');

        // Remove "Added (some user) to the group" messages
        cleaned = cleaned.replace(/Added .* to the group/g, '');

        // Remove "Pinned a message."
        cleaned = cleaned.replace(/Pinned a message\./g, '');

        // Remove "Changed the channel name..."
        cleaned = cleaned.replace(/Changed the channel name .*/g, '');

        // Remove "Changed the channel icon."
        cleaned = cleaned.replace(/Changed the channel icon\./g, '');

        // Remove all non-alphanumeric characters, except for spaces and common punctuation marks
        cleaned = cleaned.replace(/[^\w\s.,!?]/g, '');
        return cleaned.trim();
    }

    // Extract content values and clean them
    const contents = data.messages.map(message => cleanContent(message.content)).filter(content => content);  // Filtering out empty strings

    // Construct Question and Answer pairs
    const qaPairs = [];
    for (let i = 0; i < contents.length - 1; i += 2) {
        if (contents[i] && contents[i + 1]) {  // Checking if both question and answer are non-empty
            qaPairs.push({
                prompt: contents[i],
                completion: contents[i + 1]
            });
        }
    }

    // Write the modified data back to a new JSON file
    fs.writeFile('cleaned_data.json', JSON.stringify({conversations: qaPairs}, null, 4), err => {
        if (err) {
            console.error("Error writing the file:", err);
        } else {
            console.log("Cleaned data saved to cleaned_data.json");
        }
    });
});
