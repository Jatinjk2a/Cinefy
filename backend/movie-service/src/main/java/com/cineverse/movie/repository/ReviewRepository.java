package com.cineverse.movie.repository;

import com.cineverse.movie.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByMovieId(String movieId);
    Optional<Review> findByMovieIdAndUserId(String movieId, String userId);
    boolean existsByMovieIdAndUserId(String movieId, String userId);
}
