package com.cineverse.booking.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.queues.booking-created}")
    private String bookingCreatedQueue;

    @Value("${rabbitmq.queues.booking-cancelled}")
    private String bookingCancelledQueue;

    @Bean TopicExchange cineverseExchange() { return new TopicExchange(exchange, true, false); }

    @Bean Queue bookingCreatedQueue()   { return QueueBuilder.durable(bookingCreatedQueue).build(); }
    @Bean Queue bookingCancelledQueue() { return QueueBuilder.durable(bookingCancelledQueue).build(); }

    @Bean Binding bookingCreatedBinding()   { return BindingBuilder.bind(bookingCreatedQueue()).to(cineverseExchange()).with("booking.created"); }
    @Bean Binding bookingCancelledBinding() { return BindingBuilder.bind(bookingCancelledQueue()).to(cineverseExchange()).with("booking.cancelled"); }

    @Bean Jackson2JsonMessageConverter messageConverter() { return new Jackson2JsonMessageConverter(); }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf) {
        RabbitTemplate t = new RabbitTemplate(cf);
        t.setMessageConverter(messageConverter());
        return t;
    }
}
