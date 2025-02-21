export interface CharCard {
  name?: string;
  description?: string;
  creatorcomment?: string;
  personality?: string;
  first_mes?: string;
  avatar?: string;
  chat?: string;
  mes_example?: string;
  scenario?: string;
  create_date: Date;
  talkativeness?: string;
  creator?: string;
  tags?: string[];
  fav?: boolean;
  spec: string;
  spec_version: string;
  data: CharData;
}

export interface CharData {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  creator_notes: string;
  system_prompt: string;
  post_history_instructions: string;
  tags: string[] | null;
  creator: string;
  character_version: string;
  alternate_greetings: string[] | null;
  extensions: CharExtensions | null;
}

export interface CharExtensions {
  talkativeness: string;
  fav: boolean;
  world: string;
  depth_prompt: DepthPromptExtension | null;
}

export interface DepthPromptExtension {
  prompt: string;
  depth: number;
  role: string;
}
