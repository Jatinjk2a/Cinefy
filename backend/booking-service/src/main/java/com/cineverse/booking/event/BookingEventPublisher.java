package com.cineverse.booking.event;

import com.cineverse.booking.model.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    public void publishBookingCreated(Booking booking) {
        var payload = Map.of(
                "eventType", "BOOKING_CREATED",
                "bookingId", booking.getId(),
                "userId",    booking.getUserId(),
                "showId",    booking.getShowId(),
                "seatIds",   booking.getSeatIds(),
                "totalPrice", booking.getTotalPrice()
        );
        rabbitTemplate.convertAndSend(exchange, "booking.created", payload);
        log.info("Published booking.created bookingId={}", booking.getId());
    }

    public void publishBookingCancelled(Booking booking) {
        var payload = Map.of(
                "eventType", "BOOKING_CANCELLED",
                "bookingId", booking.getId(),
                "userId",    booking.getUserId(),
                "showId",    booking.getShowId(),
                "seatIds",   booking.getSeatIds()
        );
        rabbitTemplate.convertAndSend(exchange, "booking.cancelled", payload);
        log.info("Published booking.cancelled bookingId={}", booking.getId());
    }
}
