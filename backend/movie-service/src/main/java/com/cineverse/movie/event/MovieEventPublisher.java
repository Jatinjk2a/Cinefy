package com.cineverse.movie.event;

import com.cineverse.movie.model.Movie;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class MovieEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    public void publishMovieReleased(Movie movie) {
        var payload = Map.of(
                "eventType", "MOVIE_RELEASED",
                "movieId", movie.getId(),
                "title", movie.getTitle(),
                "year", movie.getYear()
        );
        rabbitTemplate.convertAndSend(exchange, "movie.released", payload);
        log.info("Published movie.released for '{}'", movie.getTitle());
    }

    public void publishReviewCreated(String movieId, String userId, int rating) {
        var payload = Map.of(
                "eventType", "REVIEW_CREATED",
                "movieId", movieId,
                "userId", userId,
                "rating", rating
        );
        rabbitTemplate.convertAndSend(exchange, "review.created", payload);
        log.info("Published review.created for movieId={}", movieId);
    }
}
