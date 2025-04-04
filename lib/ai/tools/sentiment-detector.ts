// src/lib/sentiment-detector.ts

// Define types for our sentiment analysis
export type SentimentEntry = {
    text: string;
    sentiment: string;
    response: string;
  };
  
  export type SentimentResult = {
    sentiment: string;
    confidence: number;
    response: string;
  };
  
  // This is a simple example dataset - in production, you would use a much larger dataset
  // or integrate with a proper NLP service like TensorFlow.js or an external API
  const defaultTrainingData: SentimentEntry[] = [
    // Worry/anxiety patterns
    { text: "worried", sentiment: "anxious", response: "I notice you seem concerned. How can I help ease your worries?" },
    { text: "anxious", sentiment: "anxious", response: "Taking a deep breath can help. Is there something specific causing anxiety?" },
    { text: "nervous", sentiment: "anxious", response: "It's normal to feel nervous sometimes. Would you like some guidance?" },
    { text: "stressed", sentiment: "anxious", response: "Stress affects us all. Perhaps I can help you find some calm." },
    
    // Frustration patterns
    { text: "frustrated", sentiment: "frustrated", response: "I understand this can be frustrating. Let's find a solution together." },
    { text: "annoyed", sentiment: "frustrated", response: "I apologize for any inconvenience. How can I make this better?" },
    { text: "can't", sentiment: "frustrated", response: "Sometimes things don't work as expected. Let me try to help." },
    { text: "not working", sentiment: "frustrated", response: "I understand your frustration. Let's troubleshoot this together." },
    
    // Positive patterns
    { text: "happy", sentiment: "positive", response: "I'm glad to hear you're feeling good! How else can I assist you today?" },
    { text: "excited", sentiment: "positive", response: "Your enthusiasm is wonderful! I'm here to help with whatever you need." },
    { text: "grateful", sentiment: "positive", response: "It's a pleasure to assist you. What else would you like to know?" },
    
    // Confusion patterns
    { text: "confused", sentiment: "confused", response: "I'm happy to clarify things. What specifically is unclear?" },
    { text: "don't understand", sentiment: "confused", response: "Let me explain in a different way to make things clearer." },
    { text: "unclear", sentiment: "confused", response: "Sometimes these things can be complex. Let me break it down for you." },
  ];
  
  // Default responses when no clear sentiment is detected
  const defaultResponses: string[] = [
    "How can I assist you further today?",
    "Is there anything specific you'd like help with?",
    "I'm here to help if you have any questions.",
    "Let me know if you need any clarification."
  ];
  
  export class SentimentDetector {
    private trainingData: SentimentEntry[];
    
    constructor(customTrainingData?: SentimentEntry[]) {
      // Use custom training data if provided, otherwise use the default
      this.trainingData = customTrainingData || defaultTrainingData;
    }
    
    // Method to analyze text and detect sentiment
    public analyze(text: string): SentimentResult {
      if (!text || text.trim() === '') {
        return {
          sentiment: 'neutral',
          confidence: 1.0,
          response: this.getRandomDefaultResponse()
        };
      }
      
      const lowercaseText = text.toLowerCase();
      let bestMatch: SentimentEntry | null = null;
      let highestConfidence = 0;
      
      // Simple pattern matching - in production you would use a more sophisticated algorithm
      for (const entry of this.trainingData) {
        // Check if the text contains the exact sentiment term
        if (lowercaseText.includes(entry.sentiment)) {
          return {
            sentiment: entry.sentiment,
            confidence: 0.9,
            response: entry.response
          };
        }
        
        // Check if the text contains the example text (more general match)
        if (lowercaseText.includes(entry.text.toLowerCase())) {
          // If we find an exact match, return immediately
          if (lowercaseText === entry.text.toLowerCase()) {
            return {
              sentiment: entry.sentiment,
              confidence: 0.95,
              response: entry.response
            };
          }
          
          // Otherwise, track the best partial match
          const confidence = 0.7;
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = entry;
          }
        }
      }
      
      // If we found a good match, return it
      if (bestMatch && highestConfidence > 0.5) {
        return {
          sentiment: bestMatch.sentiment,
          confidence: highestConfidence,
          response: bestMatch.response
        };
      }
      
      // Default to neutral if no good match
      return {
        sentiment: 'neutral',
        confidence: 0.4,
        response: this.getRandomDefaultResponse()
      };
    }
    
    // Add new training data
    public addTrainingData(entry: SentimentEntry): void {
      this.trainingData.push(entry);
    }
    
    // Add multiple training data entries
    public addBulkTrainingData(entries: SentimentEntry[]): void {
      this.trainingData = [...this.trainingData, ...entries];
    }
    
    // Get a random default response
    private getRandomDefaultResponse(): string {
      const index = Math.floor(Math.random() * defaultResponses.length);
      return defaultResponses[index];
    }
  }
  
  // Export a singleton instance for easy use
  export const sentimentDetector = new SentimentDetector();