package com.cineverse.notification.controller;

import com.cineverse.notification.model.Notification;
import com.cineverse.notification.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> list(HttpServletRequest req) {
        return notificationService.getForUser(userId(req));
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount(HttpServletRequest req) {
        return Map.of("count", notificationService.countUnread(userId(req)));
    }

    @PatchMapping("/{id}/read")
    public Notification markRead(@PathVariable String id) {
        return notificationService.markRead(id);
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<Void> markAllRead(HttpServletRequest req) {
        notificationService.markAllRead(userId(req));
        return ResponseEntity.ok().build();
    }

    private String userId(HttpServletRequest req) {
        String id = req.getHeader("X-User-Id");
        if (id == null || id.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return id;
    }
}
