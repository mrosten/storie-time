
import { GoogleGenAI, Modality } from "@google/genai";
import { StoryTheme, StoryMood, StoryLength, TargetAge, MagicIngredient } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStoryText = async (
  theme: StoryTheme, 
  mood: StoryMood, 
  length: StoryLength,
  age: TargetAge,
  ingredients: MagicIngredient[]
): Promise<{ title: string; content: string }> => {
  const ai = getAI();
  const prompt = `Write a bedtime story for a child. 
    Theme: ${theme}
    Mood: ${mood}
    Target Age Group: ${age} (Adjust vocabulary and complexity accordingly)
    Target Length: ${length}
    Special Ingredients to include: ${ingredients.join(', ') || 'None'}
    
    The story should be engaging, safe for children, and follow a traditional story structure.
    Return the output in the following JSON format:
    {
      "title": "A short magical title",
      "content": "The full story text goes here..."
    }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return {
      title: data.title || "A Magical Tale",
      content: data.content || "Once upon a time..."
    };
  } catch (e) {
    return {
      title: "A Magical Tale",
      content: response.text || "Once upon a time in a faraway land..."
    };
  }
};

export const generateSpeech = async (text: string, voiceName: string = 'Kore'): Promise<string | undefined> => {
  const ai = getAI();
  const narrationPrompt = `Narrate this bedtime story with a soft, soothing, and warm voice: ${text.slice(0, 3000)}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: narrationPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const decodeBase64 = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodePCM = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
