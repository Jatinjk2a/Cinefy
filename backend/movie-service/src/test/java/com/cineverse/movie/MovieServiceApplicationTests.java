package com.cineverse.movie;

import com.cineverse.movie.model.Movie;
import com.cineverse.movie.repository.MovieRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
@ActiveProfiles("test")
class MovieServiceApplicationTests {

    @Autowired
    MovieRepository movieRepository;

    @Test
    void contextLoads() {
        assertThat(movieRepository).isNotNull();
    }

    @Test
    void saveAndFindMovie() {
        Movie movie = Movie.builder()
                .imdbId("tt9999999")
                .title("Test Movie")
                .year("2024")
                .genre("Action")
                .build();

        Movie saved = movieRepository.save(movie);
        assertThat(saved.getId()).isNotNull();
        assertThat(movieRepository.findByImdbId("tt9999999")).isPresent();
        assertThat(movieRepository.existsByImdbId("tt9999999")).isTrue();

        movieRepository.deleteById(saved.getId());
    }
}
