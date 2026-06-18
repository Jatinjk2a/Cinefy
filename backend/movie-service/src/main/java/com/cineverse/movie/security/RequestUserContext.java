package com.cineverse.movie.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class RequestUserContext {

    private final String userId;
    private final String email;
    private final String role;

    public RequestUserContext(HttpServletRequest request) {
        this.userId = request.getHeader("X-User-Id");
        this.email  = request.getHeader("X-User-Email");
        this.role   = request.getHeader("X-User-Role");
    }

    public String getUserId() { return userId; }
    public String getEmail()  { return email; }
    public String getRole()   { return role; }
    public boolean isAdmin()  { return "ADMIN".equals(role); }
    public boolean isTheatreOwner() { return "THEATRE_OWNER".equals(role) || isAdmin(); }
    public boolean isAuthenticated() { return email != null && !email.isBlank(); }
}
