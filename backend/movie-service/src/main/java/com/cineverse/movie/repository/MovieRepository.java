package com.cineverse.movie.repository;

import com.cineverse.movie.model.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MovieRepository extends MongoRepository<Movie, String> {
    Optional<Movie> findByImdbId(String imdbId);
    boolean existsByImdbId(String imdbId);
    Page<Movie> findByGenreContainingIgnoreCase(String genre, Pageable pageable);
    Page<Movie> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
