package com.cineverse.movie.service;

import com.cineverse.movie.dto.ReviewRequest;
import com.cineverse.movie.event.MovieEventPublisher;
import com.cineverse.movie.model.Review;
import com.cineverse.movie.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MovieEventPublisher eventPublisher;

    public Review createOrUpdate(String movieId, String userId, String userEmail, ReviewRequest req) {
        Review review = reviewRepository.findByMovieIdAndUserId(movieId, userId)
                .map(existing -> {
                    existing.setRating(req.getRating());
                    existing.setComment(req.getComment());
                    return existing;
                })
                .orElseGet(() -> Review.builder()
                        .movieId(movieId)
                        .userId(userId)
                        .userEmail(userEmail)
                        .rating(req.getRating())
                        .comment(req.getComment())
                        .build());

        Review saved = reviewRepository.save(review);
        eventPublisher.publishReviewCreated(movieId, userId, req.getRating());
        return saved;
    }

    public List<Review> getForMovie(String movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    public void delete(String reviewId, String requesterId, boolean isAdmin) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new java.util.NoSuchElementException("Review not found"));
        if (!isAdmin && !review.getUserId().equals(requesterId)) {
            throw new SecurityException("Access denied");
        }
        reviewRepository.deleteById(reviewId);
    }
}
