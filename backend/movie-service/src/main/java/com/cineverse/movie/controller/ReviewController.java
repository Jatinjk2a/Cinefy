package com.cineverse.movie.controller;

import com.cineverse.movie.dto.ReviewRequest;
import com.cineverse.movie.model.Review;
import com.cineverse.movie.security.RequestUserContext;
import com.cineverse.movie.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/movies/{movieId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final RequestUserContext userCtx;

    @GetMapping
    public List<Review> list(@PathVariable String movieId) {
        return reviewService.getForMovie(movieId);
    }

    @PostMapping
    public ResponseEntity<Review> upsert(@PathVariable String movieId,
                                         @Valid @RequestBody ReviewRequest req) {
        requireAuth();
        return ResponseEntity.status(HttpStatus.CREATED).body(
                reviewService.createOrUpdate(movieId, userCtx.getUserId(),
                        userCtx.getEmail(), req)
        );
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(@PathVariable String movieId,
                                       @PathVariable String reviewId) {
        requireAuth();
        reviewService.delete(reviewId, userCtx.getUserId(), userCtx.isAdmin());
        return ResponseEntity.noContent().build();
    }

    private void requireAuth() {
        if (!userCtx.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
    }
}
