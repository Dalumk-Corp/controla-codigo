
export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}
