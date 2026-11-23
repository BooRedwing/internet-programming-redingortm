import { Actor, ActorDto, Movie, MovieDto, MovieInput } from './movie.models';

/** API -> app. Missing fields get safe defaults here, in one place. */
export function toMovie(dto: MovieDto): Movie { 
  return {
    id: String(dto.id),
    title: dto.title ?? '',
    year: dto.year ?? null,
    director: dto.director ?? '',
    genres: dto.genre ?? [],
    plot: dto.plot ?? '',
    cast: dto.cast ?? [],
    oscars: Object.entries(dto.oscars ?? {}).map(([type, recipient]) => ({ type, recipient })),
    rating: dto.rating ?? null,
  };
}

/** app -> API (for POST and PUT). The API expects "genre" and an oscars object. */
export function toMovieDto(movie: MovieInput): Omit<MovieDto, 'id'> {
  return {
    title: movie.title,
    year: movie.year ?? undefined,
    director: movie.director,
    genre: movie.genres,
    plot: movie.plot,
    cast: movie.cast,
    oscars: Object.fromEntries(movie.oscars.map(o => [o.type, o.recipient])),
    rating: movie.rating,
  };
}

export function toActor(dto: ActorDto): Actor {
  return {
    id: String(dto.id),
    name: dto.name,
    birthdate: dto.birthdate ?? '',
    height: dto.height ?? null,
    nationality: dto.nationality ?? '',
    notableWorks: dto.notable_works ?? [],
  };
}