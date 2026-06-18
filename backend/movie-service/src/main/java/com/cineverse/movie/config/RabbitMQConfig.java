package com.cineverse.movie.config;

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

    @Value("${rabbitmq.queues.movie-released}")
    private String movieReleasedQueue;

    @Value("${rabbitmq.queues.review-created}")
    private String reviewCreatedQueue;

    @Bean
    public TopicExchange cineverseExchange() {
        return new TopicExchange(exchange, true, false);
    }

    @Bean
    public Queue movieReleasedQueue() {
        return QueueBuilder.durable(movieReleasedQueue).build();
    }

    @Bean
    public Queue reviewCreatedQueue() {
        return QueueBuilder.durable(reviewCreatedQueue).build();
    }

    @Bean
    public Binding movieReleasedBinding() {
        return BindingBuilder.bind(movieReleasedQueue()).to(cineverseExchange()).with("movie.released");
    }

    @Bean
    public Binding reviewCreatedBinding() {
        return BindingBuilder.bind(reviewCreatedQueue()).to(cineverseExchange()).with("review.created");
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
