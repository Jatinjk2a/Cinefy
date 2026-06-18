package com.cineverse.booking.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

/**
 * Redis-based seat locking: each seat gets a key seat:{showId}:{seatId}
 * with a 5-minute TTL. setIfAbsent = compare-and-set, preventing double booking.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SeatLockService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${seat.lock.ttl:300}")
    private long lockTtlSeconds;

    private String key(String showId, String seatId) {
        return "seat:" + showId + ":" + seatId;
    }

    public boolean lockSeats(String showId, List<String> seatIds, String userId) {
        for (String seatId : seatIds) {
            Boolean acquired = redisTemplate.opsForValue()
                    .setIfAbsent(key(showId, seatId), userId, Duration.ofSeconds(lockTtlSeconds));
            if (!Boolean.TRUE.equals(acquired)) {
                // Roll back already-acquired locks for this batch
                seatIds.subList(0, seatIds.indexOf(seatId))
                       .forEach(prev -> redisTemplate.delete(key(showId, prev)));
                log.warn("Seat {} in show {} already locked", seatId, showId);
                return false;
            }
        }
        return true;
    }

    public void releaseSeats(String showId, List<String> seatIds) {
        seatIds.forEach(seatId -> redisTemplate.delete(key(showId, seatId)));
    }

    public boolean isSeatLocked(String showId, String seatId) {
        return redisTemplate.hasKey(key(showId, seatId));
    }
}
