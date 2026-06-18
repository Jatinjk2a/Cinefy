package com.cineverse.movie.controller;

import com.cineverse.movie.dto.ShowRequest;
import com.cineverse.movie.model.Show;
import com.cineverse.movie.security.RequestUserContext;
import com.cineverse.movie.service.ShowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowService showService;
    private final RequestUserContext userCtx;

    @GetMapping("/movie/{movieId}")
    public List<Show> getUpcoming(@PathVariable String movieId) {
        return showService.getUpcomingByMovie(movieId);
    }

    @GetMapping("/mine")
    public List<Show> getMine() {
        requireAuth();
        return showService.getByTheatreOwner(userCtx.getUserId());
    }

    @GetMapping("/{showId}")
    public Show getById(@PathVariable String showId) {
        return showService.getById(showId);
    }

    @PostMapping
    public ResponseEntity<Show> create(@Valid @RequestBody ShowRequest req) {
        if (!userCtx.isTheatreOwner()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Theatre owner access required");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(showService.create(req, userCtx.getUserId()));
    }

    @DeleteMapping("/{showId}")
    public ResponseEntity<Void> delete(@PathVariable String showId) {
        requireAuth();
        showService.delete(showId, userCtx.getUserId(), userCtx.isAdmin());
        return ResponseEntity.noContent().build();
    }

    private void requireAuth() {
        if (!userCtx.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
    }
}
