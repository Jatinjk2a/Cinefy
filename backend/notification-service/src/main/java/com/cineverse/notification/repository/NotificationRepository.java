package com.cineverse.notification.repository;

import com.cineverse.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByUserIdAndRead(String userId, boolean read);
    long countByUserIdAndRead(String userId, boolean read);
}
