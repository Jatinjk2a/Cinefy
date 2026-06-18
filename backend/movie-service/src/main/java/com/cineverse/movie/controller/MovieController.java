package com.cineverse.movie.controller;

import com.cineverse.movie.dto.MovieRequest;
import com.cineverse.movie.model.Movie;
import com.cineverse.movie.security.RequestUserContext;
import com.cineverse.movie.service.MovieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;
    private final RequestUserContext userCtx;

    @GetMapping
    public Page<Movie> search(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return movieService.search(title, genre, page, size);
    }

    @GetMapping("/{id}")
    public Movie getById(@PathVariable String id) {
        return movieService.getById(id);
    }

    @GetMapping("/imdb/{imdbId}")
    public Movie getByImdbId(@PathVariable String imdbId) {
        return movieService.getByImdbId(imdbId);
    }

    @PostMapping
    public ResponseEntity<Movie> create(@Valid @RequestBody MovieRequest req,
                                        @RequestParam(defaultValue = "false") boolean notify) {
        requireAdmin();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(movieService.create(req, notify));
    }

    @PutMapping("/{id}")
    public Movie update(@PathVariable String id, @Valid @RequestBody MovieRequest req) {
        requireAdmin();
        return movieService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        requireAdmin();
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private void requireAdmin() {
        if (!userCtx.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access required");
        }
    }
}
