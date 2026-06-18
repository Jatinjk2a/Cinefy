package com.cineverse.notification.service;

import com.cineverse.notification.model.Notification;
import com.cineverse.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification create(String userId, String type, String title, String message) {
        Notification n = Notification.builder()
                .userId(userId).type(type).title(title).message(message).read(false).build();
        return notificationRepository.save(n);
    }

    public List<Notification> getForUser(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long countUnread(String userId) {
        return notificationRepository.countByUserIdAndRead(userId, false);
    }

    public Notification markRead(String notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NoSuchElementException("Notification not found"));
        n.setRead(true);
        return notificationRepository.save(n);
    }

    public void markAllRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndRead(userId, false);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
