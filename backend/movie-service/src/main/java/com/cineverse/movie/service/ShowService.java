package com.cineverse.movie.service;

import com.cineverse.movie.dto.ShowRequest;
import com.cineverse.movie.model.Show;
import com.cineverse.movie.repository.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ShowService {

    private final ShowRepository showRepository;

    public Show create(ShowRequest req, String theatreOwnerId) {
        Show show = Show.builder()
                .movieId(req.getMovieId())
                .theatreName(req.getTheatreName())
                .theatreOwnerId(theatreOwnerId)
                .showTime(req.getShowTime())
                .totalSeats(req.getTotalSeats())
                .availableSeats(req.getTotalSeats())
                .price(req.getPrice())
                .hall(req.getHall())
                .bookedSeatIds(new ArrayList<>())
                .build();
        return showRepository.save(show);
    }

    public List<Show> getUpcomingByMovie(String movieId) {
        return showRepository.findByMovieIdAndShowTimeAfterOrderByShowTimeAsc(movieId, Instant.now());
    }

    public List<Show> getByTheatreOwner(String theatreOwnerId) {
        return showRepository.findByTheatreOwnerId(theatreOwnerId);
    }

    public Show getById(String showId) {
        return showRepository.findById(showId)
                .orElseThrow(() -> new NoSuchElementException("Show not found: " + showId));
    }

    public void delete(String showId, String requesterId, boolean isAdmin) {
        Show show = getById(showId);
        if (!isAdmin && !show.getTheatreOwnerId().equals(requesterId)) {
            throw new SecurityException("Access denied");
        }
        showRepository.deleteById(showId);
    }
}
