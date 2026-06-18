package com.cineverse.movie.service;

import com.cineverse.movie.dto.MovieRequest;
import com.cineverse.movie.event.MovieEventPublisher;
import com.cineverse.movie.model.Movie;
import com.cineverse.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieEventPublisher eventPublisher;

    @Cacheable(value = "movies", key = "#id")
    public Movie getById(String id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Movie not found: " + id));
    }

    @Cacheable(value = "movies", key = "'imdb:' + #imdbId")
    public Movie getByImdbId(String imdbId) {
        return movieRepository.findByImdbId(imdbId)
                .orElseThrow(() -> new NoSuchElementException("Movie not found: " + imdbId));
    }

    public Page<Movie> search(String title, String genre, int page, int size) {
        var pageable = PageRequest.of(page, size);
        if (title != null && !title.isBlank()) {
            return movieRepository.findByTitleContainingIgnoreCase(title, pageable);
        }
        if (genre != null && !genre.isBlank()) {
            return movieRepository.findByGenreContainingIgnoreCase(genre, pageable);
        }
        return movieRepository.findAll(pageable);
    }

    @CacheEvict(value = "movies", allEntries = true)
    public Movie create(MovieRequest req, boolean publishEvent) {
        if (movieRepository.existsByImdbId(req.getImdbId())) {
            throw new IllegalArgumentException("Movie already exists: " + req.getImdbId());
        }
        Movie movie = toEntity(req);
        Movie saved = movieRepository.save(movie);
        if (publishEvent) {
            eventPublisher.publishMovieReleased(saved);
        }
        return saved;
    }

    @CacheEvict(value = "movies", key = "#id")
    public Movie update(String id, MovieRequest req) {
        Movie existing = getById(id);
        updateFields(existing, req);
        return movieRepository.save(existing);
    }

    @CacheEvict(value = "movies", key = "#id")
    public void delete(String id) {
        movieRepository.deleteById(id);
    }

    public List<Movie> getAll() {
        return movieRepository.findAll();
    }

    private Movie toEntity(MovieRequest req) {
        return Movie.builder()
                .imdbId(req.getImdbId())
                .title(req.getTitle())
                .year(req.getYear())
                .genre(req.getGenre())
                .director(req.getDirector())
                .actors(req.getActors())
                .plot(req.getPlot())
                .posterUrl(req.getPosterUrl())
                .runtime(req.getRuntime())
                .imdbRating(req.getImdbRating())
                .rated(req.getRated())
                .language(req.getLanguage())
                .country(req.getCountry())
                .awards(req.getAwards())
                .boxOffice(req.getBoxOffice())
                .build();
    }

    private void updateFields(Movie movie, MovieRequest req) {
        if (req.getTitle()      != null) movie.setTitle(req.getTitle());
        if (req.getGenre()      != null) movie.setGenre(req.getGenre());
        if (req.getPlot()       != null) movie.setPlot(req.getPlot());
        if (req.getPosterUrl()  != null) movie.setPosterUrl(req.getPosterUrl());
        if (req.getImdbRating() != null) movie.setImdbRating(req.getImdbRating());
        if (req.getBoxOffice()  != null) movie.setBoxOffice(req.getBoxOffice());
    }
}
