
export interface MovieDto {
    id: string | number;
    title?: string;
    year?: number;
    director?: string;
    genre?: string[];
    plot?: string;
    cast?: CastMember[];
    oscars?: Record<string, string>;
    rating?: number | null;
  }
  
  export interface ActorDto {
    id: string | number;
    name: string;
    birthdate?: string;
    height?: number | null;
    nationality?: string;
    notable_works?: string[];
  }
  
  export interface GenreDto {
    id: string;
    name: string;
  }
  
  
  export interface CastMember {
    actor: string;
    character: string;
  }
  
  export interface Oscar {
    type: string;       
    recipient: string;  
  }
  
  export interface Movie {
    id: string;
    title: string;
    year: number | null;
    director: string;
    genres: string[];
    plot: string;
    cast: CastMember[];
    oscars: Oscar[];
    rating: number | null;
  }
  
  export interface Actor {
    id: string;
    name: string;
    birthdate: string;
    height: number | null;
    nationality: string;
    notableWorks: string[];
  }
  
 
  export type MovieInput = Omit<Movie, 'id'>;