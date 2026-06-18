package com.cineverse.movie.repository;

import com.cineverse.movie.model.Show;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.List;

public interface ShowRepository extends MongoRepository<Show, String> {
    List<Show> findByMovieIdAndShowTimeAfterOrderByShowTimeAsc(String movieId, Instant after);
    List<Show> findByTheatreOwnerId(String theatreOwnerId);
}
