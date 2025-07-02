// Function tool definition for keyword generation
const KEYWORD_FUNCTION = {
  name: "generate_app_keywords",
  description: "Generates relevant search keywords for app store optimization based on app data and screenshots",
  input_schema: {
    type: "object",
    properties: {
      keywords: {
        type: "array",
        items: {
          type: "string",
          description: "A relevant search keyword that users would likely use to find this app"
        },
        description: "Array of 10-15 highly relevant keywords for app store search optimization"
      }
    },
    required: ["keywords"]
  }
};

module.exports = {
  KEYWORD_FUNCTION
};